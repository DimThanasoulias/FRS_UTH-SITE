import type { DayProgram } from "../types";

export function getBroadcastSchedule(activeSchedule: DayProgram[], isGreek: boolean, date = new Date()) {
    const clock = getAthensClock(date);
    const now = { getDay: () => clock.weekday, getHours: () => clock.hour, getMinutes: () => clock.minute };
    const daysMapEN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const daysMapGR = ["Κυρ", "Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ"];
    const todayAbbrGR = daysMapGR[now.getDay()];
    const todayAbbrEN = daysMapEN[now.getDay()];
    
    const currentSchedule = activeSchedule;
    const todayProgram = currentSchedule.find(d => d.day === todayAbbrGR || d.day === todayAbbrEN) || currentSchedule[0];
    const shows = todayProgram?.shows || [];
    
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const parseTimeRange = (timeStr: string) => {
      const parts = timeStr.split("-").map(s => s.trim());
      if (parts.length === 2) {
        let [sH, sM] = parts[0].split(":").map(Number);
        let [eH, eM] = parts[1].split(":").map(Number);
        sH = sH || 0;
        sM = sM || 0;
        eH = eH || 0;
        eM = eM || 0;
        if (sH < 6) sH += 24;
        if (eH < 6 || (eH * 60 + eM) <= (sH * 60 + sM)) eH += 24;
        let startMin = sH * 60 + sM;
        let endMin = eH * 60 + eM;
        return { startMin, endMin };
      }
      return { startMin: 0, endMin: 0 };
    };

    const getCountdownText = (diffMin: number, isGreekLang: boolean): string => {
      if (diffMin <= 0) return isGreekLang ? "Τώρα" : "Now";
      if (diffMin < 60) {
        return diffMin === 1 
          ? (isGreekLang ? "Σε 1 λεπτό" : "In 1 min")
          : (isGreekLang ? `Σε ${diffMin} λεπτά` : `In ${diffMin} min`);
      }
      const hours = Math.round(diffMin / 60);
      if (hours < 24) {
        return hours === 1
          ? (isGreekLang ? "Σε 1 ώρα" : "In 1 hour")
          : (isGreekLang ? `Σε ${hours} ώρες` : `In ${hours} hours`);
      }
      const days = Math.round(diffMin / (24 * 60));
      return days === 1
        ? (isGreekLang ? "Σε 1 μέρα" : "In 1 day")
        : (isGreekLang ? `Σε ${days} μέρες` : `In ${days} days`);
    };
    
    let active: any = null;
    let next: any = null;
    let later: any = null;
    
    // A late show belongs to yesterday's schedule until its end time.
    const yesterday = (now.getDay() + 6) % 7;
    const previous = activeSchedule.find(d => d.day === daysMapGR[yesterday] || d.day === daysMapEN[yesterday]);
    for (const show of previous?.shows || []) {
      const { startMin, endMin } = parseTimeRange(show.time);
      if (endMin > 1440 && (nowMinutes + 1440) >= startMin && (nowMinutes + 1440) < endMin) {
        active = { ...show, isLive: true };
      }
    }

    // 1. Check today's shows
    for (let i = 0; i < shows.length; i++) {
      const show = shows[i];
      const { startMin, endMin } = parseTimeRange(show.time);
      
      if (nowMinutes >= startMin && nowMinutes < endMin) {
        active = { ...show, isLive: true };
      } else if (startMin > nowMinutes) {
        const diff = startMin - nowMinutes;
        const candidate = {
          ...show,
          timeLabel: show.time,
          countdown: getCountdownText(diff, isGreek),
          badge: isGreek ? "ΕΠΟΜΕΝΟ" : "NEXT",
          diffMinutes: diff
        };
        if (!next) {
          next = candidate;
        } else if (!later) {
          later = { ...candidate, badge: isGreek ? "ΣΤΗ ΣΥΝΕΧΕΙΑ" : "LATER" };
          break;
        }
      }
    }
    
    // 2. Look ahead to upcoming days if next or later is not yet found
    if (!next || !later) {
      for (let offset = 1; offset <= 7; offset++) {
        const nextDayIdx = (now.getDay() + offset) % 7;
        const nextDayAbbrGR = daysMapGR[nextDayIdx];
        const nextDayAbbrEN = daysMapEN[nextDayIdx];
        const nextDayProgram = currentSchedule.find(d => d.day === nextDayAbbrGR || d.day === nextDayAbbrEN);
        
        if (nextDayProgram && nextDayProgram.shows && nextDayProgram.shows.length > 0) {
          const nextDayShows = nextDayProgram.shows;
          for (let j = 0; j < nextDayShows.length; j++) {
            const candidate = nextDayShows[j];
            const { startMin } = parseTimeRange(candidate.time);
            const diff = (offset * 24 * 60) + startMin - nowMinutes;

            const isTomorrow = offset === 1;
            const dayName = isTomorrow 
              ? (isGreek ? "Αύριο" : "Tomorrow") 
              : nextDayProgram.fullName;
              
            const candidateWithLabel = {
              ...candidate,
              timeLabel: `${dayName} • ${candidate.time}`,
              countdown: getCountdownText(diff, isGreek),
              badge: isTomorrow 
                ? (isGreek ? "ΑΥΡΙΟ" : "TOMORROW") 
                : (isGreek ? "ΠΡΟΣΕΧΩΣ" : "UPCOMING"),
              diffMinutes: diff
            };

            if (!next) {
              next = candidateWithLabel;
            } else if (!later) {
              later = candidateWithLabel;
              break;
            }
          }
          if (next && later) break;
        }
      }
    }
    
    return { currentLiveShow: active, nextShow: next, laterShow: later };
}

// All broadcast dates use the station timezone, including daylight-saving changes.
export function getAthensClock(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Athens', weekday: 'short', hour: '2-digit', minute: '2-digit',
    second: '2-digit', month: 'numeric', day: 'numeric', hourCycle: 'h23',
  }).formatToParts(date);
  const value = (name: string) => parts.find(p => p.type === name)?.value || '0';
  return {
    weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(value('weekday')),
    hour: Number(value('hour')), minute: Number(value('minute')), second: Number(value('second')),
    month: Number(value('month')), day: Number(value('day')),
  };
}
