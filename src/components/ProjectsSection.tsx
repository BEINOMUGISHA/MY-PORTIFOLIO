import { useEffect, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import {
  PROJECTS,
  type ProjectCategory,
  type ProjectItem,
} from '../data/portfolioData';
import type { LabTabId } from './InteractiveLab';

interface ProjectsSectionProps {
  onLaunchLab: (tab: LabTabId) => void;
}

const FILTER_OPTIONS: { id: ProjectCategory; label: string }[] = [
  { id: 'all', label: 'All Projects' },
  { id: 'web-mobile', label: 'Web & Mobile' },
  { id: 'ai-data', label: 'AI & Data' },
  { id: 'web3-security', label: 'Web3 & Security' },
];

export function ProjectsSection({ onLaunchLab }: ProjectsSectionProps) {
  const [filter, setFilter] = useState<ProjectCategory>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const visibleProjects =
    filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  const featured = visibleProjects.filter((p) => p.featured);
  const archive = visibleProjects.filter((p) => !p.featured);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleLabJump = (tab: LabTabId) => {
    setSelectedProject(null);
    onLaunchLab(tab);
    const el = document.getElementById('lab');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="projects" className="rainbow-surface-alt border-b border-slate-200/80 py-16 lg:py-24">
      <div className="relative z-[1] mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#0E7490]">Selected Work</p>
            <h2
              className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Production builds, smart contract protocols &amp; applied AI systems
            </h2>
          </div>

          <div
            role="group"
            aria-label="Filter projects by domain"
            className="inline-flex flex-wrap gap-1 rounded-xl border border-slate-200/80 bg-white/85 p-1 self-start"
          >
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFilter(opt.id)}
                className={`min-h-[38px] rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  filter === opt.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Bento Grid */}
        {featured.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {featured.map((project, idx) => (
              <article
                key={project.id}
                className={`flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/85 p-7 transition-colors duration-150 hover:border-slate-300 ${
                  idx === 0 && featured.length === 3 ? 'lg:col-span-1' : ''
                }`}
              >
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    <span>{project.categoryLabel}</span>
                    <span className="mx-2 text-slate-300" aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{project.year}</span>
                  </p>

                  <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-slate-950">
                    {project.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {project.summary}
                  </p>
                  <p className="mt-3 text-xs font-medium text-slate-500">
                    {project.accessLabel}
                  </p>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <p className="font-mono text-xs text-slate-500 leading-relaxed">
                    {project.stack.join(' · ')}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex min-h-[40px] items-center gap-1.5 text-sm font-semibold text-[#0E7490] hover:text-[#0B5F76]"
                    >
                      <span>Inspect Architecture</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </button>

                    <div className="flex items-center gap-4">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-[#0E7490] underline-offset-4 hover:underline"
                        >
                          Live Site
                        </a>
                      )}
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-slate-600 underline-offset-4 hover:text-slate-950 hover:underline"
                        >
                          GitHub
                        </a>
                      )}
                      {project.labTab && (
                        <button
                          type="button"
                          onClick={() => handleLabJump(project.labTab!)}
                          className="text-xs font-semibold text-slate-600 underline-offset-4 hover:text-slate-950 hover:underline"
                        >
                          Sandbox
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Hairline-Divided Engineering Index */}
        {archive.length > 0 && (
          <div className="mt-10 divide-y divide-slate-200/80 rounded-2xl border border-slate-200/80 bg-white/85">
            {archive.map((project) => (
              <article
                key={project.id}
                className="grid grid-cols-1 gap-4 p-6 sm:p-7 lg:grid-cols-12 lg:items-center"
              >
                <div className="lg:col-span-4">
                  <p className="text-xs font-medium text-slate-500">
                    <span>{project.categoryLabel}</span>
                    <span className="mx-2 text-slate-300" aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{project.year}</span>
                  </p>
                  <h3 className="mt-1.5 font-display text-xl font-bold text-slate-950">
                    {project.title}
                  </h3>
                </div>

                <div className="lg:col-span-5">
                  <p className="text-sm leading-relaxed text-slate-600">{project.summary}</p>
                  <p className="mt-2 font-mono text-xs text-slate-500">
                    {project.stack.join(' · ')}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 lg:col-span-3 lg:justify-end">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-[#0E7490] underline-offset-4 hover:underline"
                    >
                      Live Site
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-slate-700 underline-offset-4 hover:text-slate-950 hover:underline"
                    >
                      GitHub
                    </a>
                  )}
                  {project.labTab && (
                    <button
                      type="button"
                      onClick={() => handleLabJump(project.labTab!)}
                      className="text-xs font-semibold text-slate-700 underline-offset-4 hover:text-slate-950 hover:underline"
                    >
                      Sandbox
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 bg-[#F7F9FB] px-3.5 py-2 text-xs font-semibold text-slate-900 whitespace-nowrap hover:border-slate-300 hover:bg-slate-100"
                  >
                    <span>View Specs</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Architecture Detail Modal */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-xs"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  <span>{selectedProject.categoryLabel}</span>
                  <span className="mx-2 text-slate-300" aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{selectedProject.year}</span>
                </p>
                <h3
                  id="project-modal-title"
                  className="mt-1.5 font-display text-2xl font-bold text-slate-950"
                >
                  {selectedProject.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Close project details"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <h4 className="text-xs font-semibold text-[#0E7490]">Overview</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {selectedProject.summary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#0E7490]">System Architecture</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {selectedProject.architecture}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#0E7490]">Key Engineering Highlights</h4>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {selectedProject.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="text-[#0E7490]" aria-hidden="true">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#0E7490]">Delivery &amp; Outcome</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {selectedProject.outcome}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-5">
                <div>
                  <h4 className="text-xs font-semibold text-slate-500">Technology Stack</h4>
                  <p className="mt-1.5 font-mono text-xs font-medium text-slate-800">
                    {selectedProject.stack.join(' · ')}
                  </p>
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-semibold text-slate-500">Repository Access</h4>
                  <p className="mt-1.5 text-xs font-medium text-slate-700">
                    {selectedProject.accessLabel}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-5">
              {selectedProject.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-lg bg-[#0E7490] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0B5F76]"
                >
                  <span>Visit Live Site</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
              {selectedProject.repoUrl && (
                <a
                  href={selectedProject.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  <span>View on GitHub</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
              {selectedProject.labTab && (
                <button
                  type="button"
                  onClick={() => handleLabJump(selectedProject.labTab!)}
                  className="min-h-[42px] rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Open Sandbox
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="min-h-[42px] rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
