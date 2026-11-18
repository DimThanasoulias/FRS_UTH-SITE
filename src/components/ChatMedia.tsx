import React, { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";

interface ChatMediaProps {
  src: string;
  isGreek: boolean;
  isGif: boolean;
  onPreview: (src: string) => void;
}

// A network or decoding error does not establish that an image has expired.
export default function ChatMedia(props: ChatMediaProps) {
  return <React.Fragment key={props.src}><ChatMediaContent {...props} /></React.Fragment>;
}

function ChatMediaContent({ src, isGreek, isGif, onPreview }: ChatMediaProps) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!failed || attempt >= 2) return;
    const timer = window.setTimeout(() => {
      setFailed(false);
      setAttempt(value => value + 1);
    }, (attempt + 1) * 1000);
    return () => window.clearTimeout(timer);
  }, [failed, attempt]);

  if (failed && attempt >= 2) {
    return (
      <div role="status" className="p-2.5 rounded-xl bg-stone-100 text-stone-600 text-xs border border-black/5 mt-1">
        <div className="flex items-center gap-1.5">
          <ImageOff className="w-3.5 h-3.5 shrink-0" />
          <span>{isGreek ? "Δεν ήταν δυνατή η φόρτωση της εικόνας." : "The image could not be loaded."}</span>
        </div>
        <button type="button" className="mt-2 underline font-semibold cursor-pointer min-h-11 px-2" onClick={() => {
          setFailed(false);
          setAttempt(0);
        }}>
          {isGreek ? "Δοκιμή ξανά" : "Try again"}
        </button>
      </div>
    );
  }

  return (
    <div onClick={() => { if (!failed) onPreview(src); }}
      className="group relative overflow-hidden rounded-xl cursor-pointer hover:opacity-95 transition-opacity max-w-[280px] sm:max-w-[320px] bg-black/5 border border-black/10 mt-1"
      title={isGreek ? "Κλικ για μεγέθυνση" : "Click to enlarge"}>
      <img key={attempt} src={src} alt={isGif ? "GIF" : "Image"} loading="lazy"
        onLoad={() => setFailed(false)} onError={() => setFailed(true)}
        className="w-full h-auto max-h-[260px] object-cover rounded-xl" />
      {failed && <span role="status" className="block p-2 text-xs">{isGreek ? "Επανάληψη φόρτωσης…" : "Retrying image…"}</span>}
      {isGif && <span className="absolute bottom-1.5 left-1.5 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs tracking-wider">GIF</span>}
    </div>
  );
}
