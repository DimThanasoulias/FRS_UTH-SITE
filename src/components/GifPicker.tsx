/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, Sparkles, Film } from "lucide-react";
import { fetchTenorGifs, TenorGif } from "../lib/tenorService";

interface GifPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGif: (gifUrl: string) => void;
  isGreek: boolean;
}

const CATEGORIES = [
  { labelEl: "🔥 Trending", labelEn: "🔥 Trending", q: "" },
  { labelEl: "🎵 Μουσική", labelEn: "🎵 Music", q: "music" },
  { labelEl: "💃 Χορός", labelEn: "💃 Dance", q: "dance" },
  { labelEl: "🎉 Πάρτι", labelEn: "🎉 Party", q: "party" },
  { labelEl: "😂 Γέλιο", labelEn: "😂 Laugh", q: "laugh" },
  { labelEl: "📻 Ραδιόφωνο", labelEn: "📻 Radio", q: "radio" },
  { labelEl: "❤️ Αγάπη", labelEn: "❤️ Love", q: "love" },
  { labelEl: "👏 Μπράβο", labelEn: "👏 Applause", q: "applause" },
];

export default function GifPicker({
  isOpen,
  onClose,
  onSelectGif,
  isGreek,
}: GifPickerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [gifs, setGifs] = useState<TenorGif[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    // Auto-focus search input
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Load GIFs on open or category/search change
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);

    const timer = setTimeout(async () => {
      const q = searchTerm.trim() || activeCategory;
      const res = await fetchTenorGifs(q);
      if (isMounted) {
        setGifs(res.gifs);
        setIsFallback(res.isFallback);
        setLoading(false);
      }
    }, 350);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isOpen, searchTerm, activeCategory]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="absolute bottom-full left-0 right-0 sm:left-auto sm:right-4 sm:w-[380px] mb-2 bg-white rounded-2xl shadow-2xl border border-black/10 overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
      style={{ maxHeight: "440px" }}
    >
      {/* Header */}
      <div className="px-3.5 py-3 border-b border-black/[0.08] flex items-center justify-between bg-stone-50/80">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#ad021a]/10 text-[#ad021a] flex items-center justify-center font-black text-xs">
            GIF
          </div>
          <span className="text-xs font-bold text-stone-800">
            {isGreek ? "Αναζήτηση GIFs" : "GIF Search"}
          </span>
          {isFallback && (
            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-medium">
              Demo/Featured
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-stone-400 hover:text-stone-600 transition-colors p-1 rounded-lg hover:bg-stone-200/50 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-black/[0.06] bg-white">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (activeCategory) setActiveCategory("");
            }}
            placeholder={
              isGreek ? "Αναζήτηση GIFs στο Tenor..." : "Search Tenor GIFs..."
            }
            className="w-full pl-9 pr-8 py-2 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#ad021a]/20 focus:border-[#ad021a]"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto mt-2.5 pb-1 no-scrollbar text-[11px]">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.q && !searchTerm;
            return (
              <button
                key={cat.q}
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory(cat.q);
                }}
                className={`whitespace-nowrap px-2.5 py-1 rounded-full transition-all cursor-pointer font-medium ${
                  isSelected
                    ? "bg-[#ad021a] text-white shadow-xs"
                    : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                }`}
              >
                {isGreek ? cat.labelEl : cat.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* GIF Grid */}
      <div
        className="p-3 overflow-y-auto max-h-[260px] min-h-[200px]"
        style={{ scrollbarWidth: "thin" }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center h-44 gap-2 text-stone-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#ad021a]" />
            <span className="text-xs">
              {isGreek ? "Αναζήτηση GIFs..." : "Loading GIFs..."}
            </span>
          </div>
        ) : gifs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-44 gap-1 text-stone-400 text-xs">
            <Film className="w-8 h-8 opacity-30 mb-1" />
            <span>
              {isGreek ? "Δεν βρέθηκαν GIFs." : "No GIFs found."}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {gifs.map((gif) => (
              <button
                key={gif.id}
                type="button"
                onClick={() => {
                  onSelectGif(gif.url);
                  onClose();
                }}
                className="group relative aspect-video bg-stone-100 rounded-xl overflow-hidden border border-black/5 hover:border-[#ad021a] hover:shadow-md transition-all cursor-pointer focus:outline-none"
              >
                <img
                  src={gif.previewUrl}
                  alt={gif.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="px-3 py-1.5 bg-stone-50 border-t border-black/[0.06] flex items-center justify-between text-[10px] text-stone-400">
        <span>Powered by GIPHY</span>
        <span>0 bytes Firebase Storage</span>
      </div>
    </div>
  );
}
