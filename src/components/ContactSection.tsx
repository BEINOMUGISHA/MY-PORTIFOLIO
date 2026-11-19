import { FormEvent, useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';

export function ContactSection() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [scope, setScope] = useState('Web & Mobile App');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      setCopiedEmail(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please complete your name, email address, and project brief.');
      return;
    }
    setErrorMsg('');
    setSubmitted(true);
  };

  return (
    <>
      <section id="contact" className="rainbow-surface py-16 lg:py-24">
        <div className="relative z-[1] mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-sm font-semibold text-[#0E7490]">Contact</p>
              <h2
                className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                Let&apos;s build your next cross-platform, Web3, or AI product
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Available for software engineering roles, apprenticeships, and specialized client
                engagements across responsive web/mobile development, DeFi smart contracts, and
                predictive analytics dashboards.
              </p>

              <div className="mt-8 divide-y divide-slate-200/80 rounded-2xl border border-slate-200/80 bg-white/85">
                <div className="flex items-center justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <span className="block text-xs text-slate-500">Email</span>
                    <a
                      href={`mailto:${PROFILE.email}`}
                      className="block truncate font-mono text-sm font-medium text-slate-900 hover:text-[#0E7490]"
                    >
                      {PROFILE.email}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label="Copy email address"
                    className="inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:text-slate-950"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 px-5 py-4">
                  <div>
                    <span className="block text-xs text-slate-500">Phone / WhatsApp</span>
                    <a
                      href="tel:+256786834364"
                      className="font-mono text-sm font-medium text-slate-900 tabular-nums hover:text-[#0E7490]"
                    >
                      {PROFILE.phone}
                    </a>
                  </div>
                  <a
                    href="tel:+256786834364"
                    className="text-xs font-semibold text-[#0E7490] hover:underline"
                  >
                    Call
                  </a>
                </div>

                <div className="flex items-center justify-between gap-3 px-5 py-4">
                  <div>
                    <span className="block text-xs text-slate-500">GitHub</span>
                    <a
                      href={PROFILE.github}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-sm font-medium text-slate-900 hover:text-[#0E7490]"
                    >
                      github.com/BEINOMUGISHA
                    </a>
                  </div>
                  <a
                    href={PROFILE.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open GitHub profile"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0E7490] hover:underline"
                  >
                    <span>Profile</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>

                <div className="flex items-center justify-between gap-3 px-5 py-4">
                  <div>
                    <span className="block text-xs text-slate-500">Curriculum Vitae</span>
                    <span className="font-mono text-sm font-medium text-slate-900">
                      Beinomugisha_Innocent_CV.pdf
                    </span>
                  </div>
                  <a
                    href={PROFILE.cvUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0E7490] hover:underline"
                  >
                    <span>View PDF</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-6 sm:p-8">
                {submitted ? (
                  <div className="py-10 text-left">
                    <h3 className="font-display text-2xl font-bold text-slate-950">
                      Inquiry prepared for {PROFILE.name}
                    </h3>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600">
                      Thank you, {name}. Your brief for <strong>{scope}</strong> is ready. You
                      can also dispatch it directly via your email client to{' '}
                      <span className="font-mono text-slate-900">{PROFILE.email}</span>.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <a
                        href={`mailto:${PROFILE.email}?subject=${encodeURIComponent(
                          `${scope} Inquiry from ${name}`
                        )}&body=${encodeURIComponent(message)}`}
                        className="inline-flex min-h-[42px] items-center rounded-lg bg-[#0E7490] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0B5F76]"
                      >
                        Open in Mail App
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setName('');
                          setEmail('');
                          setMessage('');
                        }}
                        className="inline-flex min-h-[42px] items-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        Send Another Note
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-xs font-semibold text-slate-700"
                        >
                          Your Name
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Jane Doe"
                          className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0E7490] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-xs font-semibold text-slate-700"
                        >
                          Email Address
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="jane@company.com"
                          className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0E7490] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="block text-xs font-semibold text-slate-700">
                        Focus Area
                      </span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {[
                          'Web & Mobile App',
                          'Web3 & DeFi Protocol',
                          'ML & Analytics Dashboard',
                          'Engineering Role',
                        ].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setScope(option)}
                            className={`min-h-[38px] rounded-lg border px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                              scope === option
                                ? 'border-[#0E7490] bg-[#0E7490] text-white'
                                : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-semibold text-slate-700"
                      >
                        Project Brief or Opportunity
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell me about the product, technical stack, or team role..."
                        className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0E7490] focus:outline-none"
                      />
                    </div>

                    {errorMsg && (
                      <p role="alert" className="text-xs font-medium text-rose-600">
                        {errorMsg}
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs text-slate-500">
                        Direct response from Kampala, Uganda
                      </span>
                      <button
                        type="submit"
                        className="min-h-[44px] rounded-lg bg-[#0E7490] px-6 py-2.5 text-sm font-semibold text-white whitespace-nowrap transition-colors hover:bg-[#0B5F76] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7490]"
                      >
                        Send Inquiry
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="rainbow-surface-alt border-t border-slate-200/80 py-8">
        <div className="relative z-[1] mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-5 text-sm text-slate-600 sm:flex-row sm:items-center sm:px-8">
          <p>
            &copy; {new Date().getFullYear()} {PROFILE.name} · {PROFILE.location}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#lab" className="hover:text-slate-900">
              Interactive Lab
            </a>
            <a href="#projects" className="hover:text-slate-900">
              Projects
            </a>
            <a href={PROFILE.github} target="_blank" rel="noreferrer" className="hover:text-slate-900">
              GitHub
            </a>
            <a href={`mailto:${PROFILE.email}`} className="hover:text-slate-900">
              Email
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
