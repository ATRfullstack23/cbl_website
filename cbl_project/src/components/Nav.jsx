import { useState, useEffect, useRef } from 'react';

var NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Players', href: '#players' },
  { label: 'Points', href: '#points' },
  { label: 'Contact', href: '#contact' },
];

export default function Nav() {
  var [menu_open, set_menu_open] = useState(false);
  var [scrolled, set_scrolled] = useState(false);
  var [active_section, set_active_section] = useState('home');
  var nav_ref = useRef(null);

  useEffect(function () {
    function handle_scroll() {
      set_scrolled(window.scrollY > 50);

      var sections = NAV_ITEMS.map(function (item) {
        return document.getElementById(item.href.slice(1));
      });

      for (var i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && sections[i].getBoundingClientRect().top <= 150) {
          set_active_section(NAV_ITEMS[i].href.slice(1));
          break;
        }
      }
    }

    function handle_click_outside(e) {
      if (nav_ref.current && !nav_ref.current.contains(e.target)) {
        set_menu_open(false);
      }
    }

    function handle_resize() {
      if (window.innerWidth > 768) {
        set_menu_open(false);
      }
    }

    window.addEventListener('scroll', handle_scroll, { passive: true });
    document.addEventListener('mousedown', handle_click_outside);
    document.addEventListener('touchstart', handle_click_outside);
    window.addEventListener('resize', handle_resize);

    return function () {
      window.removeEventListener('scroll', handle_scroll);
      document.removeEventListener('mousedown', handle_click_outside);
      document.removeEventListener('touchstart', handle_click_outside);
      window.removeEventListener('resize', handle_resize);
    };
  }, []);

  function handle_nav_click(e, href) {
    e.preventDefault();
    set_menu_open(false);
    var el = document.getElementById(href.slice(1));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <nav ref={nav_ref} className={'nav' + (scrolled ? ' scrolled' : '')}>
      <a
        href="#home"
        className="nav_logo"
        onClick={function (e) { handle_nav_click(e, '#home'); }}
      >
        CBL<span className="accent"> League</span>
      </a>
      <ul className={'nav_links' + (menu_open ? ' open' : '')}>
        {NAV_ITEMS.map(function (item) {
          return (
            <li key={item.href}>
              <a
                href={item.href}
                className={active_section === item.href.slice(1) ? 'active' : ''}
                onClick={function (e) { handle_nav_click(e, item.href); }}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className="nav_toggle"
        aria-label="Menu"
        aria-expanded={menu_open}
        onClick={function () { set_menu_open(!menu_open); }}
      >
        {menu_open ? '✕' : '☰'}
      </button>
    </nav>
  );
}
