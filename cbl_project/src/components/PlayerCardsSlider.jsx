import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import PlayerCard from './PlayerCard.jsx';
import 'swiper/css';
import 'swiper/css/pagination';

export default function PlayerCardsSlider({ players, on_profile_click }) {
  var swiper_ref = useRef(null);
  var wrap_ref = useRef(null);

  function run_swiper_update() {
    var inst = swiper_ref.current;
    if (inst && typeof inst.update === 'function') {
      inst.update();
    }
  }

  useEffect(function () {
    function on_resize() {
      run_swiper_update();
    }
    window.addEventListener('resize', on_resize);
    return function () { window.removeEventListener('resize', on_resize); };
  }, []);

  useEffect(function () {
    var el = wrap_ref.current;
    if (!el || typeof MutationObserver === 'undefined') return undefined;
    var obs = new MutationObserver(function () {
      if (el.classList.contains('visible')) {
        window.requestAnimationFrame(function () {
          run_swiper_update();
        });
      }
    });
    obs.observe(el, { attributes: true, attributeFilter: ['class'] });
    if (el.classList.contains('visible')) {
      window.requestAnimationFrame(run_swiper_update);
    }
    return function () { obs.disconnect(); };
  }, []);

  return (
    <div ref={wrap_ref} className="players_swiper_wrap fade_up delay_2">
      <Swiper
        modules={[Pagination]}
        className="players_swiper"
        onSwiper={function (swiper) {
          swiper_ref.current = swiper;
          window.requestAnimationFrame(run_swiper_update);
        }}
        observer={true}
        observeParents={true}
        resizeObserver={true}
        updateOnWindowResize={true}
        watchOverflow={false}
        loop={true}
        loopAdditionalSlides={2}
        loopPreventsSliding={false}
        speed={450}
        spaceBetween={20}
        slidesPerView={1.15}
        centeredSlides={false}
        grabCursor={true}
        allowTouchMove={true}
        simulateTouch={true}
        threshold={8}
        touchRatio={1}
        touchAngle={45}
        touchReleaseOnEdges={true}
        resistance={false}
        pagination={{ clickable: true, dynamicBullets: true }}
        breakpoints={{
          480: { slidesPerView: 1.35, spaceBetween: 16 },
          640: { slidesPerView: 2, spaceBetween: 18 },
          900: { slidesPerView: 3, spaceBetween: 20 },
          1200: { slidesPerView: 3.5, spaceBetween: 22 },
        }}
      >
        {players.map(function (player, i) {
          return (
            <SwiperSlide key={player.name || i} className="players_swiper_slide">
              <PlayerCard player={player} on_profile_click={on_profile_click} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
