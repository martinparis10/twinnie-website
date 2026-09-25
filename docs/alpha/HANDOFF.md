# Twinnie alpha UI preview

## September 25 update

This section supersedes the original September 16 implementation notes below.

Preview branch: `codex/alpha-prototype`. The same implementation is also saved on `codex/twinnie-alpha-desktop-mobile`. The [original alpha journey](original-alpha-user-journey.pdf) is included with the design reference.

Review the [brand board](brand-board.png), [desktop studio](screenshots/desktop-studio.jpg), [mobile studio](screenshots/mobile-studio.jpg), [open mobile wardrobe](screenshots/mobile-wardrobe-open.jpg), and [camera instructions](screenshots/mobile-camera-instructions.jpg).

- Exact supplied wordmark and symbol PNG artwork is used in the header, home and creation step. Source PNGs are preserved under `public/alpha/brand`; inline SVG viewports crop only the surrounding whitespace. The supplied files were PNGs, not PDFs.
- Requested copy removed/replaced; the optional marketing preference was restored. Capture instructions refer to a device, Take photo precedes Choose photo, and the side/video intros use the requested opening sentences. The demo banner, screen review menu, help footer, and preview-error button remain removed. The existing Use sample capture option remains available while reconstruction is simulated.
- Browser Back/Forward and the on-page Back button navigate between flow steps while preserving in-memory inputs. Creation replaces its transient history entry with the studio so Back goes to measurements. Refresh starts a new flow.
- Front/side capture opens an instruction dialog, then an in-page camera. Tap the view or Start 10-second timer. Photos are captured after 10 seconds; spin video starts after 10 seconds and records 15 seconds. MP4/WebM support is selected at runtime. Microphone audio is not requested. Captures can be previewed, replaced or removed.
- Camera permission denial, missing devices, unsupported recording and insecure connections have fallback instructions. Cancel, unmount, backgrounding and pending-permission cleanup release streams and timers. The original file picker remains.
- Mobile wardrobe opens from a three-bar button at the left of the header into a drawer covering 80% of the screen. Selecting a garment closes the drawer and returns focus to the menu button. The four progress labels are hidden on the studio screen; desktop retains its 25/75 sidebar and toggle.
- Terms and Privacy review drafts open in dialogs and at `/alpha/terms` and `/alpha/privacy`, with downloadable Markdown copies. US adults; privacy contact conor@trytwinnie.com. Current storage remains browser-only; proposed connected-alpha retention is tied to disclosed need and applicable legal limits. See `legal/LAUNCH-NOTES.md` before connecting uploads.

Validation: production build, TypeScript and scoped ESLint passed. Nine automated camera tests cover photo/video timing, cancellation, permission denial, late stream resolution, background cleanup, camera switching and unsupported/insecure contexts. Browser walkthrough checked the sample flow, restored optional preference, revised capture text and action order, Back/Forward, desktop sidebar, and the 393px mobile drawer at exactly 80% viewport width. Garment selection closed the drawer and restored menu focus. The production build rendered the sample body and hid the progress labels on the studio screen. Actual iPhone camera permission/recording still needs device testing. Automated file selection was blocked by the Chrome extension file-URL permission, so no new end-to-end file-picker claim is made.

For a phone camera, the hosted preview must use HTTPS; localhost works only on the computer running the server. The Vercel preview may require project sign-in. Personal reconstruction, garment fitting, verification, uploads, consent persistence and server retention/deletion remain unconnected.

## Original September 16 handoff

Route: `/alpha` • Original prototype branch: `codex/alpha-prototype`

Run `npm install` if dependencies are missing, then `npm run dev -- --hostname 127.0.0.1 --port 3100`. Open http://localhost:3100/alpha.

## Design

`design.md` is the unmodified brand guide supplied in the Stitch export. Cream #FAF7F2, charcoal #1C1917, dusty rose #C08B7E; Libre Baskerville headings and Josefin Sans body. Existing marketing routes are unchanged. The preview removes extra navigation, technical readouts and elaborate copy.

## Implemented

Home (Try It Out) → name → phone → agreement → front photo → side photo → turn video → measurements → simulated creation → garment selection (automatically, without a twin-review screen).

Desktop shop occupies the left 25%, with the twin viewer on the right 75%. Close/Open shop toggles the viewer to full width while preserving garment and size selections. Mobile stacks the viewer above the shop.

Buttons support forward/back navigation, field validation, local file preview/replacement, sample selection, retake, measurement unit conversion, creation error/retry, dialogs, garment/size selection, and 3D rotation/zoom/reset. Review screens menu jumps to any screen. The sample mannequin is generated from geometric primitives, not a reconstructed person.

## Connect for the real alpha

- Invitation/phone verification and authenticated sessions.
- Final approved terms/privacy and consent storage. Current agreement is a demo placeholder.
- Secure media upload, capture quality checks and actual camera capture if required. Current file picker only previews local files; no uploads occur.
- Reconstruction job submission, real status/error handling and the personal mesh asset.
- Body mismatch feedback and retake processing.
- Garment catalog, available sizes and actual try-on result assets. Current selection does not dress the mannequin.
- Persistence and deletion handling. Current form state is memory-only and resets on refresh.

Height, weight and gender (Male or Female) are required. Imperial height uses separate feet and inches fields, with centimeters available. Confirm required inputs with the reconstruction service before integration. Do not use the simulation timer or sample mannequin as production results.

## Files

- `src/app/alpha/page.tsx`: route and no-index metadata (not access control).
- `src/app/alpha/alpha.css`: scoped branding/responsive styles.
- `src/components/alpha/AlphaFlow.tsx`: UI state and interactions.
- `src/components/alpha/PreviewBody.tsx`: sample WebGL viewer; replace Body with real mesh loading.

This is a local review prototype. Add authentication before hosting a private preview; no deployment or outreach was performed.

## Validation

TypeScript and scoped ESLint passed. Browser walkthrough completed from blank-name validation through onboarding, sample capture, creation and wardrobe selection. Desktop and 390px mobile layout inspected; mobile horizontal overflow fixed. Rotation/zoom, size selection and help dialog checked. Retake validation and simulated error/retry also passed. Production build passed after clearing the generated Next.js build cache; the first attempt encountered a disk-space error. Local preview is running with the production server on port 3100.

## Original journey review (September 16)

Source: `/Users/martinparis/Desktop/ALPHA UI _ UX.pdf`, reviewed in full. The home page now starts the flow with Try It Out. The logo returns home from every step, retaining in-memory form values. Home copy is proposed; the PDF specifies the action rather than exact homepage copy.

Remaining differences from the original plan to address:
- Add the separate “Now let’s create your twinnie” introduction before capture.
- Add a creation progress bar tied to real job progress (or explicitly indeterminate during the demo).
- Inventory should start with five category buttons: T-Shirt, Pants, Sweater, Shorts, Long Sleeve Shirt. Selecting one reveals S, M, L, XL. Current mock has three categories and XS–XL.
- Size selection should enqueue a single garment immediately and replace the previous garment. Current mock uses a separate try-on button and does not fit garments.
- Add the below-body swipe rotation interaction; cloth touch/swipe interaction requires a real cloth system.
- Final consent behavior needs product/legal text; current marketing checkbox remains optional in the demo.
- Account/twin persistence and tried-on history need backend integration; the survey remains manual as specified.

Keep the subsequent user-requested feet/inches fields, required weight and Male/Female selection, direct creation-to-shop transition, 25/75 desktop layout and divider toggle.
