import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectCoverflow } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import { useApp, L } from '../context/AppContext';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

export default function Slideshow() {
  const { t } = useTranslation();
  const { data, lang } = useApp();
  const slides = (data?.slides || []).slice(0, 8);

  if (slides.length === 0) return null;

  return (
    <div className="relative">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-500 dark:text-brand-300 mb-4 flex items-center gap-2 justify-center">
        {t('hero.slideshow')}
      </p>
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectCoverflow]}
        effect="coverflow"
        centeredSlides
        grabCursor
        loop
        autoplay={{ delay: 4200, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        coverflowEffect={{ rotate: 30, stretch: 0, depth: 120, modifier: 1, slideShadows: false }}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 1.5 },
          1100: { slidesPerView: 2.2 },
        }}
        className="py-6 !px-10"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] group">
              {slide.image ? (
                <img
                  src={slide.image}
                  alt={L(slide.title, lang)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-brand-600/40 to-brand-900/40" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-5 text-left" dir="auto">
                <h3 className="text-white font-heading font-bold text-xl sm:text-2xl mb-1">
                  {L(slide.title, lang)}
                </h3>
                {L(slide.subtitle, lang) && (
                  <p className="text-slate-200 text-sm">{L(slide.subtitle, lang)}</p>
                )}
              </div>
              {slide.link && (
                <a
                  href={slide.link}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute top-4 start-4 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur text-white text-xs font-semibold hover:bg-white/35 transition-colors"
                >
                  {t('common.learnMore')}
                </a>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}