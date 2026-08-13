import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight, FiMail, FiDownload, FiChevronDown } from 'react-icons/fi';
import { useApp, L } from '../context/AppContext';
import Hero3D from '../components/Hero3D';
import Slideshow from '../components/Slideshow';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import ProjectCard from '../components/ProjectCard';
import SkillBar from '../components/SkillBar';
import { Tag, EmptyState, formatDate } from '../components/ui';

function Stats({ about }) {
  const { t, i18n } = useTranslation();
  const stats = [
    { label: t('aboutPage.statsYears'), value: about?.years_experience || 0 },
    { label: t('aboutPage.statsProjects'), value: about?.projects_completed || 0 },
    { label: t('aboutPage.statsClients'), value: about?.clients_served || 0 },
    { label: t('aboutPage.statsCertifications'), value: about?.certification_count || 0 },
  ];
  const fmt = new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-EG' : 'en-US');
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <Reveal key={i} delay={i * 80}>
          <div className="card p-6 text-center">
            <div className="text-3xl sm:text-4xl font-heading font-extrabold gradient-text">
              {fmt.format(s.value)}
            </div>
            <div className="mt-1 text-sm text-muted">{s.label}</div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const { data, lang } = useApp();
  const about = data?.about;
  const slides = data?.slides || [];
  const projects = (data?.projects || []).filter((p) => p.featured).slice(0, 3);
  const skills = (data?.skills || []).slice(0, 8);
  const services = data?.services || [];
  const experiences = (data?.experiences || []).slice(0, 3);
  const participations = (data?.participations || []).slice(0, 3);
  const trophies = (data?.trophies || []).slice(0, 3);
  const certificates = (data?.certificates || []).slice(0, 3);
  const testimonials = data?.testimonials || [];
  const posts = (data?.posts || []).slice(0, 3);

  const categories = [
    ...new Set((data?.skills || []).map((s) => s.category).filter(Boolean)),
  ];
  const groupedSkills = categories.map((c) => ({
    category: c,
    items: (data?.skills || []).filter((s) => s.category === c),
  }));

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-32 -start-32 w-[500px] h-[500px] rounded-full bg-brand-500/20 blur-3xl animate-blob" />
          <div className="absolute top-1/3 -end-40 w-[500px] h-[500px] rounded-full bg-brand-600/15 blur-3xl animate-blob" style={{ animationDelay: '-5s' }} />
          <div className="absolute bottom-0 start-1/3 w-[400px] h-[400px] rounded-full bg-brand-800/10 blur-3xl animate-blob" style={{ animationDelay: '-9s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-2 gap-10 items-center w-full">
          <div className="text-center lg:text-start">
            <Reveal>
              {about?.available_for_hire && (
                <p className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-sm font-medium mb-5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {t('hero.available')}
                </p>
              )}
            </Reveal>
            <Reveal delay={100}>
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-heading font-extrabold leading-tight mb-4">
                <span className="block text-muted text-2xl sm:text-3xl font-semibold mb-2">
                  {t('hero.hello')} 👋
                </span>
                <span className="gradient-text">
                  {about ? `${about.first_name} ${about.last_name}` : ''}
                </span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                {about ? L(about.title, lang) : ''}
              </h2>
              <p className="text-muted text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
                {about ? L(about.headline, lang) : ''}
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Link to="/projects" className="px-6 py-3 rounded-xl btn-primary font-semibold inline-flex items-center gap-2">
                  {t('hero.viewProjects')} <FiArrowRight />
                </Link>
                <Link to="/contact" className="px-6 py-3 rounded-xl border border-soft bg-card font-semibold inline-flex items-center gap-2 text-muted hover:text-brand-500 transition-colors">
                  <FiMail /> {t('hero.contactMe')}
                </Link>
                {about?.resume_url && (
                  <a href={about.resume_url} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-xl border border-soft bg-card font-semibold inline-flex items-center gap-2 text-muted hover:text-brand-500 transition-colors">
                    <FiDownload /> {t('common.downloadResume')}
                  </a>
                )}
              </div>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <Hero3D />
          </Reveal>
        </div>

        {slides.length > 0 && (
          <div className="absolute bottom-6 inset-x-0 max-w-4xl mx-auto px-5">
            <Slideshow />
          </div>
        )}

        <div className="absolute bottom-28 start-1/2 -translate-x-1/2 hidden md:flex flex-col items-center text-muted animate-bounce">
          <FiChevronDown className="text-xl" />
          <span className="text-xs">{t('hero.scroll')}</span>
        </div>
      </section>

      {/* ============ STATS ============ */}
      {about && (
        <section className="max-w-6xl mx-auto px-5 pb-20">
          <Stats about={about} />
        </section>
      )}

      {/* ============ ABOUT PREVIEW ============ */}
      <section className="py-20 bg-soft border-y border-soft">
        <div className="max-w-6xl mx-auto px-5 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="relative">
              {about?.avatar ? (
                <img src={about.avatar} alt={L(about, lang)} className="rounded-3xl w-full max-w-md mx-auto shadow-2xl shadow-brand-500/20 aspect-square object-cover" />
              ) : (
                <div className="rounded-3xl w-full max-w-md mx-auto aspect-square bg-gradient-to-br from-brand-500 to-brand-800 flex items-center justify-center text-8xl text-white font-heading font-extrabold shadow-2xl shadow-brand-500/30">
                  {(about?.first_name || 'A').charAt(0)}
                </div>
              )}
              <div className="absolute -bottom-5 -end-2 sm:end-4 px-5 py-3 rounded-2xl glass border border-soft shadow-lg">
                <p className="font-heading font-bold text-sm">
                  {about ? L(about.title, lang) : ''}
                </p>
              </div>
            </div>
          </Reveal>
          <div>
            <SectionHeading title={t('home.aboutTitle')} subtitle={t('home.aboutText')} center={false} />
            <Reveal delay={150}>
              <p className="text-muted leading-relaxed mt-4 mb-6 text-lg">
                {about ? L(about.bio, lang) : ''}
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {String(L(about?.languages, lang) || '')
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((lg, i) => (
                    <Tag key={i}>{lg}</Tag>
                  ))}
              </div>
              <Link to="/about" className="inline-flex items-center gap-2 font-semibold text-brand-600 dark:text-brand-300 hover:gap-3 transition-all">
                {t('common.readMore')} <FiArrowRight />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      {services.length > 0 && (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-5">
            <SectionHeading title={t('home.servicesTitle')} subtitle={t('home.servicesText')} />
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="card p-6 h-full">
                    <span className="inline-flex w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 items-center justify-center text-brand-600 dark:text-brand-300 text-xl mb-4">
                      <i className={s.icon || 'fa-solid fa-code'} />
                    </span>
                    <h3 className="font-heading font-bold text-lg mb-2">{L(s.title, lang)}</h3>
                    <p className="text-muted text-sm leading-relaxed">{L(s.description, lang)}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ SKILLS PREVIEW ============ */}
      {skills.length > 0 && (
        <section className="py-20 bg-soft border-y border-soft">
          <div className="max-w-6xl mx-auto px-5">
            <SectionHeading title={t('home.skillsTitle')} subtitle={t('home.skillsText')} />
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {groupedSkills.length > 0
                ? groupedSkills.map((g, gi) => (
                    <div key={gi}>
                      <h3 className="font-heading font-semibold mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-500" /> {g.category}
                      </h3>
                      <div className="space-y-3">
                        {g.items.slice(0, 4).map((s, si) => (
                          <SkillBar key={si} skill={s} index={si} />
                        ))}
                      </div>
                    </div>
                  ))
                : skills.map((s, i) => <SkillBar key={i} skill={s} index={i} />)}
            </div>
            <div className="text-center mt-10">
              <Link to="/skills" className="inline-flex items-center gap-2 font-semibold text-brand-600 dark:text-brand-300">
                {t('common.viewAll')} <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============ FEATURED PROJECTS ============ */}
      {projects.length > 0 && (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-5">
            <SectionHeading title={t('home.projectsTitle')} subtitle={t('home.projectsText')} />
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p, i) => (
                <ProjectCard key={i} project={p} index={i} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/projects" className="inline-flex items-center gap-2 font-semibold text-brand-600 dark:text-brand-300">
                {t('home.allProjects')} <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============ EXPERIENCE PREVIEW ============ */}
      {experiences.length > 0 && (
        <section className="py-20 bg-soft border-y border-soft">
          <div className="max-w-5xl mx-auto px-5">
            <SectionHeading title={t('home.experienceTitle')} subtitle={t('home.experienceText')} />
            <div className="mt-12 relative">
              <div className="absolute start-4 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/60 to-transparent" />
              <div className="space-y-8">
                {experiences.map((exp, i) => (
                  <Reveal key={i} delay={i * 80}>
                    <div className="relative ps-12">
                      <span className="absolute start-0 top-1 w-8 h-8 rounded-full bg-brand-500/15 border border-brand-500/40 flex items-center justify-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                      </span>
                      <div className="card p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <h3 className="font-heading font-bold text-lg">{L(exp.role, lang)}</h3>
                          <Tag>
                            {formatDate(exp.start_date, lang)} — {exp.current ? t('common.present') : formatDate(exp.end_date, lang)}
                          </Tag>
                        </div>
                        <p className="font-medium text-brand-600 dark:text-brand-300 text-sm mb-2">
                          {exp.company}{exp.location ? ` · ${L(exp.location, lang)}` : ''}
                        </p>
                        <p className="text-muted text-sm leading-relaxed">{L(exp.description, lang)}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
            <div className="text-center mt-10">
              <Link to="/experience" className="inline-flex items-center gap-2 font-semibold text-brand-600 dark:text-brand-300">
                {t('common.viewAll')} <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============ PARTICIPATIONS ============ */}
      {participations.length > 0 && (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-5">
            <SectionHeading title={t('home.participationsTitle')} subtitle={t('home.participationsText')} />
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {participations.map((p, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="card p-6 h-full">
                    <div className="flex items-center justify-between mb-3">
                      {p.event_type && <Tag>{p.event_type}</Tag>}
                      {p.date && <span className="text-xs text-muted">{formatDate(p.date, lang)}</span>}
                    </div>
                    <h3 className="font-heading font-bold text-lg mb-1">{L(p.title, lang)}</h3>
                    {L(p.role, lang) && <p className="text-sm text-brand-600 dark:text-brand-300 font-medium mb-2">{L(p.role, lang)}</p>}
                    <p className="text-muted text-sm leading-relaxed">{L(p.description, lang)}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ TROPHIES ============ */}
      {trophies.length > 0 && (
        <section className="py-20 bg-soft border-y border-soft">
          <div className="max-w-6xl mx-auto px-5">
            <SectionHeading title={t('home.trophiesTitle')} subtitle={t('home.trophiesText')} />
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trophies.map((tr, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="card p-6 text-center h-full">
                    <span className="text-5xl mb-3 inline-block">🏆</span>
                    <h3 className="font-heading font-bold text-lg mb-1">{L(tr.title, lang)}</h3>
                    {tr.year && <Tag>{tr.year}</Tag>}
                    {tr.issuer && <p className="text-xs text-muted mt-2">{tr.issuer}</p>}
                    {L(tr.description, lang) && (
                      <p className="text-muted text-sm leading-relaxed mt-2">{L(tr.description, lang)}</p>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ CERTIFICATES PREVIEW ============ */}
      {certificates.length > 0 && (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-5">
            <SectionHeading title={t('home.certificatesTitle')} subtitle={t('home.certificatesText')} />
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((c, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="card overflow-hidden h-full">
                    {c.image && (
                      <img src={c.image} alt={L(c.title, lang)} loading="lazy" className="w-full h-40 object-cover" />
                    )}
                    <div className="p-5">
                      <h3 className="font-heading font-bold mb-1">{L(c.title, lang)}</h3>
                      <p className="text-sm text-muted mb-2">{c.issuer}</p>
                      {L(c.description, lang) && <p className="text-xs text-muted leading-relaxed">{L(c.description, lang)}</p>}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ TESTIMONIALS ============ */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-soft border-y border-soft">
          <div className="max-w-6xl mx-auto px-5">
            <SectionHeading title={t('home.testimonialsTitle')} subtitle={t('home.testimonialsText')} />
            <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((tm, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="card p-6 h-full relative">
                    <span className="text-5xl text-brand-500/20 absolute top-4 end-5 font-serif">"</span>
                    <p className="text-muted leading-relaxed mb-5">{L(tm.content, lang)}</p>
                    <div className="flex items-center gap-3">
                      {tm.avatar ? (
                        <img src={tm.avatar} alt={tm.name} className="w-11 h-11 rounded-full object-cover" />
                      ) : (
                        <span className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold">
                          {tm.name?.charAt(0)}
                        </span>
                      )}
                      <div>
                        <p className="font-semibold">{tm.name}</p>
                        <p className="text-xs text-muted">
                          {L(tm.role, lang)}{tm.company ? ` · ${tm.company}` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ BLOG PREVIEW ============ */}
      {posts.length > 0 && (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-5">
            <SectionHeading title={t('home.blogTitle')} subtitle={t('home.blogText')} />
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <Reveal key={i} delay={i * 80}>
                  <Link to={`/blog/${post.id}`} className="card overflow-hidden block h-full group">
                    {post.image && (
                      <img src={post.image} alt={L(post.title, lang)} loading="lazy" className="w-full h-44 object-cover transition-transform duration-700 group-hover:scale-105" />
                    )}
                    <div className="p-5">
                      {post.category && <Tag>{post.category}</Tag>}
                      <h3 className="font-heading font-bold text-lg mt-2 mb-2 group-hover:text-brand-500 transition-colors">
                        {L(post.title, lang)}
                      </h3>
                      <p className="text-muted text-sm leading-relaxed">{L(post.excerpt, lang)}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ CTA ============ */}
      <section className="py-24 px-5">
        <div className="max-w-4xl mx-auto text-center card p-12 relative overflow-hidden">
          <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-brand-500/20 blur-3xl" />
          <Reveal>
            <h2 className="section-title mb-4">
              <span className="gradient-text">{t('common.getInTouch')}</span>
            </h2>
            <p className="text-muted text-lg mb-8">{L(about?.headline, lang)}</p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl btn-primary font-semibold text-lg">
              <FiMail /> {t('hero.contactMe')}
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}