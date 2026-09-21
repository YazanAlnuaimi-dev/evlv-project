import { SECTION_IDS } from '@/data/navigation';
import { SERVICES } from '@/data/services';

export default function ServicesSection() {
  return (
    <section
      id={SECTION_IDS.SERVICES}
      className="py-32 border-t border-zinc-900/60 bg-zinc-950/20 relative"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            CORE SERVICES
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map(({ title, description }) => (
            <div
              key={title}
              className="p-8 border border-zinc-900/60 rounded-2xl bg-zinc-950/60 backdrop-blur-md hover:border-white/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:bg-zinc-900/80"
            >
              <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-light">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
