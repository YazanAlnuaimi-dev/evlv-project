import { useCallback, useEffect, useRef, useState } from 'react';
import { HOME_ID } from '@/data/navigation';

/** A section counts as "current" once its top is within this many px of the viewport top. */
const ACTIVATION_OFFSET = 200;

/** After a nav click, scroll-spy pauses so the smooth scroll doesn't flicker the highlight. */
const NAVIGATION_LOCK_MS = 1000;

/**
 * Scroll-spy for the navbar.
 *
 * @param {string[]} sectionIds - element ids in page order (must be a stable reference)
 * @returns {{ activeId: string, scrollToSection: (id: string) => void }}
 */
export function useActiveSection(sectionIds) {
  const [activeId, setActiveId] = useState(HOME_ID);
  const isNavigatingRef = useRef(false);
  const unlockTimerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (isNavigatingRef.current) return;

      const scrollPosition = window.scrollY + ACTIVATION_OFFSET;
      let current = HOME_ID;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element && scrollPosition >= element.offsetTop) current = id;
      }
      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  useEffect(() => () => clearTimeout(unlockTimerRef.current), []);

  const scrollToSection = useCallback((id) => {
    isNavigatingRef.current = true;
    setActiveId(id);

    if (id === HOME_ID) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }

    clearTimeout(unlockTimerRef.current);
    unlockTimerRef.current = setTimeout(() => {
      isNavigatingRef.current = false;
    }, NAVIGATION_LOCK_MS);
  }, []);

  return { activeId, scrollToSection };
}
