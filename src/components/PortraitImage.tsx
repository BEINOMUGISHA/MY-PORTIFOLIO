import { useState } from 'react';
import { PROFILE } from '../data/portfolioData';

interface PortraitImageProps {
  className?: string;
  compact?: boolean;
}

export function PortraitImage({ className = '', compact = false }: PortraitImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={`${PROFILE.name} portrait`}
        className={`flex flex-col items-center justify-center bg-slate-800 text-slate-200 ${className}`}
      >
        <span className={`font-display font-bold ${compact ? 'text-lg' : 'text-3xl'}`}>BI</span>
        {!compact && (
          <span className="mt-1 text-xs text-slate-400">{PROFILE.name}</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={PROFILE.portraitUrl}
      alt={`${PROFILE.name}, ${PROFILE.role}`}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`object-cover object-top ${className}`}
    />
  );
}
