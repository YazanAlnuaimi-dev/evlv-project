import { useRef } from 'react';
import logo from '@/assets/images/logo.png';
import { useHeroScroll } from '@/hooks/useHeroScroll';

/** Pinned scroll-chase reveal for "BUILT / FOR THE / BOLD" (animation lives in useHeroScroll). */
export default function Hero() {
  const containerRef = useRef(null);
  useHeroScroll(containerRef);

  return (
    <div className="hero-container" ref={containerRef}>
      <div className="hero-sticky">
        {/* Faint EVLV logo watermark, sits behind the headline */}
        <img src={logo} alt="" aria-hidden="true" className="hero-logo-watermark" />

        <h1 className="hero-title-brand text-cream relative z-10">
          <span className="hero-word-line">
            <span>BUILT</span>
          </span>
          <span className="hero-word-line">
            <span>FOR THE</span>
          </span>
          <span className="hero-word-line">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream via-zinc-300 to-zinc-500">
              BOLD
            </span>
          </span>
        </h1>
      </div>
    </div>
  );
}
