import React from 'react';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

export default function PageHeader({ title, subtitle }) {
  return (
    <div className="relative pt-36 pb-14 px-6">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-500/20 blur-3xl animate-blob" />
        <div className="absolute top-0 -left-32 w-96 h-96 rounded-full bg-brand-600/15 blur-3xl animate-blob" style={{ animationDelay: '-6s' }} />
      </div>
      <div className="max-w-6xl mx-auto">
        <SectionHeading title={title} subtitle={subtitle} />
        <Reveal delay={150}>
          <div className="mt-8 flex justify-center gap-3 text-sm text-muted">
            <span className="px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20">
              Software Engineering
            </span>
          </div>
        </Reveal>
      </div>
    </div>
  );
}