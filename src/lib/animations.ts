import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  ScrollTrigger.defaults({
    toggleActions: "play none none reverse",
  });
}

export function fadeInUp(
  element: gsap.TweenTarget,
  trigger: Element,
  options?: {
    start?: string;
    end?: string;
    delay?: number;
  }
) {
  return gsap.fromTo(
    element,
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      delay: options?.delay ?? 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger,
        start: options?.start ?? "top 70%",
        end: options?.end ?? "top 40%",
        scrub: 1,
      },
    }
  );
}

export function staggerIn(
  elements: gsap.TweenTarget,
  trigger: Element,
  options?: {
    direction?: "left" | "right" | "up";
    stagger?: number;
  }
) {
  const dir = options?.direction ?? "left";
  const fromVars: gsap.TweenVars = { opacity: 0 };

  if (dir === "left") fromVars.x = -80;
  else if (dir === "right") fromVars.x = 80;
  else fromVars.y = 80;

  const toVars: gsap.TweenVars = {
    opacity: 1,
    x: 0,
    y: 0,
    stagger: options?.stagger ?? 0.15,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger,
      start: "top 70%",
      end: "top 30%",
      scrub: 1,
    },
  };

  return gsap.fromTo(elements, fromVars, toVars);
}
