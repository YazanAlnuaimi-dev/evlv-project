import { SOCIAL_ICONS } from '@/components/icons/SocialIcons';
import { SECTION_IDS } from '@/data/navigation';
import { SITE } from '@/data/site';

export default function Footer() {
  return (
    <footer
      id={SECTION_IDS.CONTACT}
      className="py-16 border-t border-zinc-900/60 bg-zinc-950 mt-auto relative z-10"
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-zinc-500 text-xs gap-6">
        <div className="w-full flex flex-col md:flex-row gap-8 self-start text-[15px]">
          <div className="text-left">
            <p className="font-bold text-zinc-400 tracking-widest uppercase mb-1">CONTACT US</p>
            <p>{SITE.email}</p>
            <div className="flex gap-3 mt-3">
              {SITE.socials.map(({ id, label, href }) => {
                const Icon = SOCIAL_ICONS[id];
                return (
                  <a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="text-left">
            <p className="font-bold text-zinc-400 tracking-widest uppercase mb-1">LOCATIONS</p>
            <p>{SITE.locations.join(' · ')}</p>
          </div>
        </div>

        <p>
          &copy; {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
