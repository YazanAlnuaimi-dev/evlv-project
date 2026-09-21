import { JOIN_OPTIONS } from '@/data/joinOptions';
import { SECTION_IDS } from '@/data/navigation';

const CARD_BASE =
  'group relative flex flex-col items-center justify-center p-12 rounded-2xl transition-all duration-300';

const VARIANTS = {
  dark: {
    card: 'bg-zinc-950/80 backdrop-blur-sm border border-zinc-900 hover:border-white hover:shadow-[0_0_35px_rgba(255,255,255,0.2)] hover:bg-zinc-900/90',
    label: 'text-xl text-white font-bold group-hover:text-zinc-300',
  },
  light: {
    card: 'bg-white border border-white hover:bg-zinc-100 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:border-white',
    label: 'text-xl text-black font-extrabold',
  },
};

/** "Join EVLV" call-to-action cards. Picking one opens the matching registration form. */
export default function JoinSection({ onSelect }) {
  return (
    <section id={SECTION_IDS.JOIN} className="relative px-6 pt-12 pb-32">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-10">
          JOIN EVLV
        </h2>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {JOIN_OPTIONS.map(({ type, prefix, label, variant }) => (
            <button
              key={type}
              type="button"
              onClick={() => onSelect(type)}
              className={`${CARD_BASE} ${VARIANTS[variant].card}`}
            >
              <h3 className="text-base font-bold tracking-widest text-zinc-500 mb-1">{prefix}</h3>
              <p className={VARIANTS[variant].label}>{label}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
