import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Rise-and-stick reveal for the "BUILT / FOR THE / BOLD" headline.
 *
 * The top of the page starts empty (background + faint logo watermark only).
 * As the user scrolls, each line enters from the bottom edge of the screen
 * (y: 100vh) and rises to its resting position. Once settled, the text stays
 * pinned on screen while the user keeps scrolling through the rest of the
 * section. Everything is tied to scroll position (scrub), so it reverses
 * smoothly when scrolling back up.
 *
 * Expected markup inside `containerRef`:
 *   .hero-sticky, .hero-word-line > span (x3), .hero-logo-watermark
 */
export function useHeroScroll(containerRef) {
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    // gsap.context tracks every tween/trigger created inside it, so revert()
    // cleans up completely (also under React StrictMode's double-mount).
    const ctx = gsap.context(() => {
      const sticky = container.querySelector('.hero-sticky');
      const words = container.querySelectorAll('.hero-word-line > span');
      const watermark = container.querySelector('.hero-logo-watermark');

      gsap.set(words, { y: '100vh' });
      if (watermark) gsap.set(watermark, { opacity: 1 });

      // Pin the visual stage for the full length of the scroll track.
      ScrollTrigger.create({
        trigger: sticky,
        start: 'top top',
        endTrigger: container,
        end: 'bottom bottom',
        pin: true,
        pinSpacing: false,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 3.5,
        },
      });

      // Entrance: each line rises from the bottom edge to its resting spot,
      // staggered; the watermark fades out as the words assemble.
      timeline
        .fromTo(words[0], { y: '100vh' }, { y: '-25px', ease: 'none', duration: 1 }, 0)
        .fromTo(words[1], { y: '100vh' }, { y: '-25px', ease: 'none', duration: 1 }, 0.15)
        .fromTo(words[2], { y: '100vh' }, { y: '-25px', ease: 'none', duration: 1 }, 0.3);

      if (watermark) timeline.to(watermark, { opacity: 0, ease: 'none', duration: 0.5 }, 0);

      // Hold: an empty tween pads out the rest of the pinned distance so the
      // settled text stays visible instead of moving again.
      timeline.to({}, { duration: 2.5 });
    }, container);

    return () => ctx.revert();
  }, [containerRef]);
}
