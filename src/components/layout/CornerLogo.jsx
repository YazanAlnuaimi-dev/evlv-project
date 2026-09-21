import logo from '@/assets/images/logo.png';

/** Decorative EVLV mark pinned to the bottom-right corner (hidden on mobile via CSS). */
export default function CornerLogo() {
  return <img src={logo} alt="" aria-hidden="true" className="corner-logo" />;
}
