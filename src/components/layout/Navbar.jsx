import logo from '@/assets/images/logo.png';
import { NAV_ITEMS, OBSERVED_SECTION_IDS } from '@/data/navigation';
import { useActiveSection } from '@/hooks/useActiveSection';

export default function Navbar() {
  const { activeId, scrollToSection } = useActiveSection(OBSERVED_SECTION_IDS);

  const handleClick = (event, id) => {
    event.preventDefault();
    scrollToSection(id);
  };

  return (
    <nav className="evlv-nav" aria-label="Primary">
      <div className="brand">
        <img className="logo" src={logo} alt="EVLV" />
      </div>

      <ul className="nav-links">
        {NAV_ITEMS.map(({ id, label, href }) => (
          <li key={id}>
            <a
              href={href}
              className={activeId === id ? 'active' : ''}
              aria-current={activeId === id ? 'location' : undefined}
              onClick={(event) => handleClick(event, id)}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
