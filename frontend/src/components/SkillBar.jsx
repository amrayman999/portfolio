import React from 'react';
import { useApp, L } from '../context/AppContext';
import Reveal from './Reveal';

export default function SkillBar({ skill, index }) {
  const { lang } = useApp();
  const level = Number(skill.level) || 0;

  return (
    <Reveal delay={index * 60}>
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-3">
          {skill.icon && (
            <span className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-300">
              <i className={`${skill.icon} text-lg`} />
            </span>
          )}
          <div className="flex-1">
            <p className="font-semibold">{L(skill.name, lang)}</p>
            {skill.category && <p className="text-xs text-muted">{skill.category}</p>}
          </div>
          <span className="text-sm font-bold text-brand-600 dark:text-brand-300">{level}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700 transition-all duration-1000"
            style={{ width: `${level}%` }}
          />
        </div>
      </div>
    </Reveal>
  );
}