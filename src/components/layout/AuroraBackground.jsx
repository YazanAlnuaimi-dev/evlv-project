import { useEffect, useRef } from 'react';
import { AURORA_DEFAULTS, createAurora } from '@/lib/aurora';

/** Fixed, full-viewport WebGL aurora behind the whole page. */
export default function AuroraBackground({
  colorStops = AURORA_DEFAULTS.colorStops,
  amplitude = AURORA_DEFAULTS.amplitude,
  blend = AURORA_DEFAULTS.blend,
  speed = AURORA_DEFAULTS.speed,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const aurora = createAurora(containerRef.current, { colorStops, amplitude, blend, speed });
    return () => aurora?.destroy();
  }, [colorStops, amplitude, blend, speed]);

  return <div ref={containerRef} className="aurora-bg" aria-hidden="true" />;
}
