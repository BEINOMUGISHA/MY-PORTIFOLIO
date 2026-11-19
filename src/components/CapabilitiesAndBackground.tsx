import { ArrowUpRight } from 'lucide-react';
import {
  CAPABILITY_GROUPS,
  COURSEWORK,
  PROFILE,
  TIMELINE_ENTRIES,
} from '../data/portfolioData';

export function CapabilitiesAndBackground() {
  return (
    <>
      {/* Capabilities Section */}
      <section id="capabilities" className="rainbow-surface border-b border-slate-200/80 py-16 lg:py-24">
        <div className="relative z-[1] mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#0E7490]">Engineering Capabilities</p>
            <h2
              className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Full-lifecycle delivery from interface craft to smart contracts &amp; ML pipelines
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-200/80 md:grid-cols-2">
            {CAPABILITY_GROUPS.map((group) => (
              <div key={group.index} className="bg-white/85 p-7 sm:p-9">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm font-semibold text-[#0E7490] tabular-nums">
                    {group.index}.
                  </span>
                  <h3 className="font-display text-xl font-bold text-slate-950">
                    {group.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {group.description}
                </p>
                <ul className="mt-6 space-y-2.5 border-t border-slate-100 pt-5 text-sm text-slate-700">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="text-[#0E7490] select-none" aria-hidden="true">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience & Education Timeline */}
      <section id="experience" className="rainbow-surface-alt border-b border-slate-200/80 py-16 lg:py-24">
        <div className="relative z-[1] mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-sm font-semibold text-[#0E7490]">Background &amp; Education</p>
              <h2
                className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                Academic rigor paired with shipped client systems
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Graduated from {PROFILE.university} with Second Class Upper Division honors. I
                combine software engineering with product thinking and digital commercialization to
                build maintainable, user-ready systems.
              </p>

              <dl className="mt-8 divide-y divide-slate-200/80 rounded-2xl border border-slate-200/80 bg-white/85">
                <div className="flex items-center justify-between gap-4 px-5 py-4 text-sm">
                  <dt className="text-slate-500">Based in</dt>
                  <dd className="font-semibold text-slate-900 text-right">{PROFILE.location}</dd>
                </div>
                <div className="flex items-start justify-between gap-4 px-5 py-4 text-sm">
                  <dt className="text-slate-500 shrink-0">Degree</dt>
                  <dd className="font-semibold text-slate-900 text-right">{PROFILE.degree}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 px-5 py-4 text-sm">
                  <dt className="text-slate-500">Academic Standing</dt>
                  <dd className="font-mono font-semibold text-slate-900 text-right tabular-nums">
                    CGPA 3.70
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 px-5 py-4 text-sm">
                  <dt className="text-slate-500 shrink-0">Languages</dt>
                  <dd className="font-medium text-slate-900 text-right">
                    {PROFILE.languages.join(' · ')}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 px-5 py-4 text-sm">
                  <dt className="text-slate-500">Curriculum Vitae</dt>
                  <dd>
                    <a
                      href={PROFILE.cvUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-[#0E7490] hover:underline"
                    >
                      <span>Open CV PDF</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </dd>
                </div>
              </dl>

              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                Academic and professional references are included in the attached CV and available
                upon request.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="divide-y divide-slate-200/80 rounded-2xl border border-slate-200/80 bg-white/85">
                {TIMELINE_ENTRIES.map((entry) => (
                  <article key={entry.title} className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-xl font-bold text-slate-950">
                        {entry.title}
                      </h3>
                      <span className="font-mono text-xs font-semibold text-[#0E7490] tabular-nums">
                        {entry.period}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {entry.organization}
                    </p>
                    <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-600">
                      {entry.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-2.5">
                          <span className="text-slate-400 select-none" aria-hidden="true">—</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-6 sm:p-7">
                <h3 className="font-display text-base font-bold text-slate-950">
                  Relevant BSc IT Coursework
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {COURSEWORK.join(' · ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
