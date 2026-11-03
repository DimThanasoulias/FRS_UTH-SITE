import React, { useEffect, useState } from 'react';
import { Snowflake } from 'lucide-react';
import { getAthensClock } from '../lib/schedule';
import { isChristmasSeason, type ChristmasMode } from '../lib/season';
import { setChristmasMode } from '../lib/adminService';

export default function SeasonalTheme({ isGreek, isAdmin, mode }: {
  isGreek: boolean; isAdmin: boolean; mode: ChristmasMode;
}) {
  const [snow, setSnow] = useState(() => {
    try { return localStorage.getItem('frs_snow') !== 'off'; } catch { return true; }
  });
  const [hidden, setHidden] = useState(document.hidden);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [today, setToday] = useState(() => getAthensClock());
  useEffect(() => {
    const update = () => { setHidden(document.hidden); setToday(getAthensClock()); };
    document.addEventListener('visibilitychange', update);
    const timer = window.setInterval(update, 60000);
    return () => { document.removeEventListener('visibilitychange', update); clearInterval(timer); };
  }, []);
  const active = isChristmasSeason(today.month, today.day, mode);
  return <>
    {active && <>
      <div className="seasonal-lights" aria-hidden="true">
        <svg viewBox="0 0 1000 28" preserveAspectRatio="none"><path d="M0 1 Q500 45 1000 1" fill="none" stroke="#365344" strokeWidth="1.5" /></svg>
        {Array.from({ length: 15 }, (_, i) => <i key={i} style={{ left: `${3 + i * 6.7}%`, top: `${4 + Math.sin(i / 14 * Math.PI) * 17}px` }} />)}
      </div>
      <div className={`seasonal-snow ${snow && !hidden ? '' : 'seasonal-snow-paused'}`} aria-hidden="true">
        {Array.from({ length: 18 }, (_, i) => <i key={i} style={{ left: `${(i * 37) % 100}%`, width: `${3 + i % 3}px`, height: `${3 + i % 3}px`, animationDuration: `${12 + i % 7}s`, animationDelay: `${-i * 1.7}s` }} />)}
      </div>
      <div className="seasonal-controls">
        <span className="text-[#365344] text-xs font-semibold">{isGreek ? 'Γιορτινές συχνότητες' : 'Festive frequencies'} ✦</span>
        <button type="button" aria-pressed={snow} className="snow-toggle" onClick={() => {
          setSnow(!snow);
          try { localStorage.setItem('frs_snow', snow ? 'off' : 'on'); } catch { /* Storage is optional. */ }
        }}><Snowflake size={14} />{isGreek ? (snow ? 'Χιόνι: ναι' : 'Χιόνι: όχι') : (snow ? 'Snow: on' : 'Snow: off')}</button>
      </div>
    </>}
    {isAdmin && <div className="col-span-full flex flex-wrap items-center gap-2 text-xs">
      <label htmlFor="christmas-mode">{isGreek ? 'Χριστουγεννιάτικη διακόσμηση' : 'Christmas decorations'}</label>
      <select id="christmas-mode" value={mode} disabled={saving} className="field !w-auto !py-1" onChange={async event => {
        setSaving(true); setError(false);
        try { await setChristmasMode(event.target.value as ChristmasMode); } catch { setError(true); }
        finally { setSaving(false); }
      }}>
        <option value="auto">{isGreek ? 'Αυτόματα (1 Νοε.–6 Ιαν.)' : 'Automatic (Nov 1–Jan 6)'}</option>
        <option value="on">{isGreek ? 'Ενεργή' : 'On'}</option>
        <option value="off">{isGreek ? 'Ανενεργή' : 'Off'}</option>
      </select>
      {error && <span role="alert">{isGreek ? 'Η αποθήκευση απέτυχε. Δοκιμάστε ξανά.' : 'Could not save. Please try again.'}</span>}
    </div>}
  </>;
}
