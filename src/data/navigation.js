/** Ids of the page sections the navbar scrolls to. */
export const SECTION_IDS = Object.freeze({
  JOIN: 'join',
  SERVICES: 'services',
  ABOUT: 'about',
  CONTACT: 'contact',
});

/** "Home" has no section element: it scrolls to the top of the page. */
export const HOME_ID = 'home';

export const NAV_ITEMS = [
  { id: HOME_ID, label: 'Home', href: '#' },
  { id: SECTION_IDS.JOIN, label: 'Join EVLV', href: `#${SECTION_IDS.JOIN}` },
  { id: SECTION_IDS.SERVICES, label: 'Services', href: `#${SECTION_IDS.SERVICES}` },
  { id: SECTION_IDS.ABOUT, label: 'About Us', href: `#${SECTION_IDS.ABOUT}` },
  { id: SECTION_IDS.CONTACT, label: 'Contact Us', href: `#${SECTION_IDS.CONTACT}` },
];

/** Section ids in page order, used to work out which one is currently in view. */
export const OBSERVED_SECTION_IDS = NAV_ITEMS.filter((item) => item.id !== HOME_ID).map(
  (item) => item.id,
);
