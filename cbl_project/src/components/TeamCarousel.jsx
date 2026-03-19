import { useState, useEffect, useRef } from 'react';

var SLIDES = [
  { team_name: 'Thunder Boys', team_tag: 'Speed & Power', image: '/images/thunder_boys.png' },
  { team_name: 'Smash Masters', team_tag: 'Precision & Strength', image: '/images/smash_masters.png' },
  { team_name: 'Smart Boys', team_tag: 'Strategy & Skill', image: '/images/smart_boys.png' },
];

var INTERVAL_MS = 6000;
var SWIPE_THRESHOLD = 50;

export default function TeamCarousel() {
  var [current, set_current] = useState(0);
  var [is_paused, set_is_paused] = useState(false);
  var progress_ref = useRef(null);
  var touch_start_x = useRef(0);
  var touch_end_x = useRef(0);
  var total = SLIDES.length;
  var slide = SLIDES[current];

  useEffect(function () {
    if (is_paused) return;
    var timer = setInterval(function () {
      set_current(function (prev) { return (prev + 1) % total; });
    }, INTERVAL_MS);
    return function () { clearInterval(timer); };
  }, [total, is_paused]);

  useEffect(function () {
    if (!progress_ref.current) return;
    var bar = progress_ref.current;
    bar.style.transition = 'none';
    bar.style.width = '0%';
    void bar.offsetHeight;
    bar.style.transition = 'width ' + (INTERVAL_MS / 1000) + 's linear';
    bar.style.width = '100%';
  }, [current]);

  function go_to(i) {
    set_current(((i % total) + total) % total);
  }

  function prev_slide() {
    go_to(current - 1);
  }

  function next_slide() {
    go_to(current + 1);
  }

  function handle_touch_start(e) {
    touch_start_x.current = e.touches[0].clientX;
    set_is_paused(true);
  }

  function handle_touch_move(e) {
    touch_end_x.current = e.touches[0].clientX;
  }

  function handle_touch_end() {
    var diff = touch_start_x.current - touch_end_x.current;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      go_to(diff > 0 ? current + 1 : current - 1);
    }
    set_is_paused(false);
  }

  return (
    <section
      className="hero_defi"
      id="home"
      onTouchStart={handle_touch_start}
      onTouchMove={handle_touch_move}
      onTouchEnd={handle_touch_end}
    >
      <div className="hero_defi_grid">
        {/* Left: copy (DeFi-style) */}
        <div className="hero_defi_copy">
          <div className="hero_defi_mesh" aria-hidden="true" />
          <p className="hero_defi_eyebrow">Chendamangalam Badminton League</p>
          <h1 className="hero_defi_headline">
            Simplifying the league&apos;s most exciting rivalries.
          </h1>
          <p className="hero_defi_sub">
            Three teams. One court. Thunder Boys, Smash Masters &amp; Smart Boys — live energy, every match.
          </p>
          <a href="#players" className="hero_defi_cta">Get started</a>
        </div>

        {/* Right: carousel + purple glow + arrows */}
        <div className="hero_defi_stage">
          {SLIDES.map(function (s, i) {
            return (
              <div
                key={i}
                className={'hero_defi_slide' + (i === current ? ' hero_defi_slide_on' : '')}
              >
                <img src={s.image} alt={s.team_name} className="hero_defi_img" />
              </div>
            );
          })}
          <div className="hero_defi_glow" aria-hidden="true" />
          <div className="hero_defi_vignette" aria-hidden="true" />

          <button
            type="button"
            className="hero_defi_arrow hero_defi_arrow_prev"
            onClick={prev_slide}
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            type="button"
            className="hero_defi_arrow hero_defi_arrow_next"
            onClick={next_slide}
            aria-label="Next slide"
          >
            ›
          </button>

          <div className="hero_defi_team_strip">
            <span className="hero_defi_team_name">{slide.team_name}</span>
            <span className="hero_defi_team_tag">{slide.team_tag}</span>
          </div>
        </div>
      </div>

      <div className="hero_defi_rail">
        <div className="hero_defi_dots">
          {SLIDES.map(function (s, i) {
            return (
              <button
                key={i}
                type="button"
                className={'hero_defi_dot' + (i === current ? ' active' : '')}
                onClick={function () { go_to(i); }}
                aria-label={s.team_name}
              />
            );
          })}
        </div>
        <div className="hero_defi_progress">
          <div className="hero_defi_progress_fill" ref={progress_ref} />
        </div>
      </div>
    </section>
  );
}
