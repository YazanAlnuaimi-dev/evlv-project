import { SECTION_IDS } from '@/data/navigation';

const PARAGRAPH = 'text-zinc-400 text-lg leading-relaxed font-light';
const EMPHASIS = 'font-bold text-white';

export default function AboutSection() {
  return (
    <section
      id={SECTION_IDS.ABOUT}
      className="py-32 border-t border-zinc-900/60 bg-zinc-950/40 relative"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="space-y-6">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            ABOUT US
          </h2>
        </div>

        <div className="relative group mt-8 w-full rounded-2xl overflow-hidden border border-zinc-900/60 bg-zinc-950/80 backdrop-blur-md p-6 flex flex-col justify-center gap-4">
          <p className={PARAGRAPH}>
            EVLV is a talent management agency built to connect{' '}
            <strong className={EMPHASIS}>BOLD</strong> artists and content creators with audiences
            and opportunities across the SWANA region.
          </p>
          <p className={PARAGRAPH}>
            We partner with talent to grow their careers and create authentic projects with partners
            that drive real impact online and offline across art, media, entertainment, and creator
            economy.
          </p>
          <p className={PARAGRAPH}>
            At EVLV, we believe talent deserves more than representation; it deserves strategy,
            innovation, and long-term growth planning. Every project is built on creativity,
            transparency, and a commitment to helping our partners{' '}
            <strong className={EMPHASIS}>EVOLVE</strong>.
          </p>
          <p className="text-zinc-400 text-lg leading-relaxed font-bold text-white">
            BUILT FOR THE BOLD.
          </p>
        </div>
      </div>
    </section>
  );
}
