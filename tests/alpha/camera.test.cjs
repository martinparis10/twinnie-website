/* eslint-disable @typescript-eslint/no-require-imports -- Node CommonJS test harness transpiles TSX without a browser. */
const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const ts = require('typescript');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const React = require('react');
const { act } = React;
const { createRoot } = require('react-dom/client');

const file = path.resolve('src/components/alpha/CameraCapture.tsx');
const m = new Module(file, module);
m.filename = file; m.paths = Module._nodeModulePaths(path.dirname(file));
m._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, file);
const CameraCapture = m.exports.default;
let dom, root, output, closed, stops, now, jobs, seq, requests, recorders;
let originals;
function schedule(fn, ms, repeat) { const id = ++seq; jobs.set(id, { fn, at: now + ms, ms, repeat }); return id; }
async function advance(ms) {
  const end = now + ms;
  await act(async () => {
    while (true) {
      const due = [...jobs.entries()].filter(([,v])=>v.at <= end).sort((a,b)=>a[1].at-b[1].at)[0];
      if (!due) break;
      const [id, v] = due; now = v.at;
      if (v.repeat) v.at += v.ms; else jobs.delete(id);
      v.fn(); await Promise.resolve();
    }
    now = end;
  });
}
function button(name) { return [...document.querySelectorAll('button')].find(b => (b.getAttribute('aria-label') || b.textContent) === name); }
async function click(name) { const b = button(name); assert.ok(b, name); await act(async()=>b.click()); }
async function mount(kind = 'front') {
  await act(async()=>root.render(React.createElement(CameraCapture, {kind, onClose:()=>closed++, onCapture:f=>output.push(f)})));
}
beforeEach(()=>{
  dom = new JSDOM('<div id="root"></div>', { url:'https://twinnie.test' });
  for(const key of ['window','document','navigator','HTMLElement','HTMLDialogElement','HTMLMediaElement','HTMLCanvasElement','File','Blob','DOMException']) Object.defineProperty(global, key, {configurable:true,value:dom.window[key]});
  global.IS_REACT_ACT_ENVIRONMENT = true;
  Object.defineProperty(window,'isSecureContext',{value:true,configurable:true});
  Object.defineProperty(document,'hidden',{value:false,configurable:true});
  HTMLDialogElement.prototype.showModal=function(){this.open=true;};
  HTMLMediaElement.prototype.play=async function(){};
  Object.defineProperty(window.HTMLVideoElement.prototype,'videoWidth',{get:()=>1080,configurable:true});
  Object.defineProperty(window.HTMLVideoElement.prototype,'videoHeight',{get:()=>1920,configurable:true});
  Object.defineProperty(HTMLMediaElement.prototype,'readyState',{get:()=>4,configurable:true});
  HTMLCanvasElement.prototype.getContext=()=>({drawImage:()=>{}});
  HTMLCanvasElement.prototype.toBlob=function(cb,type){ cb(new Blob(['photo'],{type})); };
  output=[]; closed=0; stops=0; now=0; jobs=new Map(); seq=0; requests=[]; recorders=[];
  navigator.mediaDevices={ getUserMedia:async(options)=>{requests.push(options); const track={stop:()=>stops++,addEventListener:()=>{}}; return {getTracks:()=>[track],getVideoTracks:()=>[track]};} };
  global.MediaRecorder=class {
    static isTypeSupported(type) {return type === 'video/mp4';}
    constructor(stream,options) {this.mimeType=options?.mimeType || 'video/webm';this.state='inactive';recorders.push(this);}
    start(){this.state='recording';this.startedAt=now;}
    stop(){this.state='inactive';this.stoppedAt=now;this.ondataavailable?.({data:new Blob(['video'],{type:this.mimeType})});this.onstop?.();}
  };
  originals={ setTimeout:global.setTimeout,clearTimeout:global.clearTimeout,setInterval:global.setInterval,clearInterval:global.clearInterval,performance:global.performance };
  global.setTimeout=(fn,ms)=>schedule(fn,ms,false); global.setInterval=(fn,ms)=>schedule(fn,ms,true);
  global.clearTimeout=global.clearInterval=id=>jobs.delete(id);
  global.performance={now:()=>now};
  root=createRoot(document.getElementById('root'));
});
afterEach(async()=>{await act(async()=>root.unmount());Object.assign(global,originals);dom.window.close();});

test('front and side photos wait a full 10 seconds, then save JPEG and stop camera',async()=>{
  for (const kind of ['front','side']) {
    await act(async()=>root.render(null)); await mount(kind);
    assert.equal(requests.length,kind==='front'?0:1);
    await click('Open camera'); await click('Start 10-second timer');
    const previous=output.length;
    await advance(9999);assert.equal(output.length,previous);
    await advance(1);assert.equal(output.length,previous+1);
    assert.equal(output.at(-1).type,'image/jpeg');assert.equal(output.at(-1).name,`twinnie-${kind}.jpg`);
    assert.ok(stops>0);assert.equal(jobs.size,0);
  }
});
test('spin waits 10 seconds then records 15 seconds, without microphone audio',async()=>{
  await mount('spin'); await click('Open camera'); await click('Start 10-second countdown');
  await advance(9999);assert.equal(recorders.length,0);
  await advance(1);assert.equal(recorders.length,1);assert.equal(recorders[0].state,'recording');
  await advance(14999);assert.equal(output.length,0);
  await advance(1);assert.equal(output.length,1);assert.equal(output[0].type,'video/mp4');
  assert.equal(recorders[0].stoppedAt-recorders[0].startedAt,15000);assert.equal(requests[0].audio,false);assert.equal(stops,1);
});
test('cancel during countdown releases camera and never captures',async()=>{
  await mount();await click('Open camera');await click('Start 10-second timer');await advance(4000);
  await click('Cancel capture');await advance(20000);assert.equal(closed,1);assert.equal(output.length,0);assert.equal(stops,1);assert.equal(jobs.size,0);
});
test('cancel during video discards recording and stops all tracks',async()=>{
  await mount('spin');await click('Open camera');await click('Start 10-second timer');await advance(12000);await click('Cancel capture');
  await advance(20000);assert.equal(output.length,0);assert.equal(stops,1);assert.equal(recorders[0].state,'inactive');
});
test('permission denial provides actionable retry and file fallback',async()=>{
  navigator.mediaDevices.getUserMedia=async()=>{throw new DOMException('denied','NotAllowedError');};
  await mount();await click('Open camera');assert.match(document.querySelector('[role="alert"]').textContent,/denied/);assert.ok(button('Open camera'));assert.equal(output.length,0);
});
test('unmount stops media that resolves after a pending permission request',async()=>{
  let resolve; navigator.mediaDevices.getUserMedia=()=>new Promise(r=>{resolve=r;});
  await mount();await click('Open camera');await act(async()=>root.render(null));
  await act(async()=>resolve({getTracks:()=>[{stop:()=>stops++}]}));assert.equal(stops,1);assert.equal(output.length,0);
});
test('backgrounding cancels capture and requires a fresh camera start',async()=>{
  await mount();await click('Open camera');await click('Start 10-second timer');
  Object.defineProperty(document,'hidden',{value:true});await act(async()=>document.dispatchEvent(new window.Event('visibilitychange')));
  await advance(20000);assert.equal(output.length,0);assert.equal(stops,1);assert.match(document.querySelector('[role="alert"]').textContent,/paused/);
});
test('switch camera stops previous stream and requests alternate facing mode',async()=>{
  await mount();await click('Open camera');await click('Switch camera');assert.equal(stops,1);assert.equal(requests[1].video.facingMode.ideal,'environment');
});
test('unsupported recording and insecure contexts expose fallback instead of failing silently',async()=>{
  delete global.MediaRecorder;await mount('spin');await click('Open camera');assert.match(document.querySelector('[role="alert"]').textContent,/cannot record/);
  Object.defineProperty(window,'isSecureContext',{value:false});await click('Open camera');assert.match(document.querySelector('[role="alert"]').textContent,/HTTPS/);
});
