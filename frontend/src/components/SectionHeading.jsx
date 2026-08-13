import React from 'react';
import Reveal from './Reveal';

export default function SectionHeading({ title, subtitle, center = true }) {
  return (
    <Reveal className={center ? 'text-center' : ''}>
      <div className={center ? 'flex flex-col items-center' : ''}>
        <span className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-300 text-sm font-semibold uppercase tracking-widest mb-3">
          <span className="w-8 h-px bg-brand-500" />
        </span>
        <h2 className="section-title">
          <span className="gradient-text">{title}</span>
        </h2>
        {subtitle && <p className="mt-3 text-muted max-w-2xl text-lg">{subtitle}</p>}
      </div>
    </Reveal>
  );
}