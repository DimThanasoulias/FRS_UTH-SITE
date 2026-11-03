/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";
import { Play, Pause, Volume, Volume1, Volume2, VolumeX, Share2, Check, Loader2, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { RadioChannel } from "../types";

interface MainPlayerProps {
  isGreek: boolean;
  stationPlaying: boolean;
  setStationPlaying: (playing: boolean | ((prev: boolean) => boolean)) => void;
  isLoadingAudio?: boolean;
  setIsLoadingAudio?: (loading: boolean) => void;
  activeTrackId?: string;
  currentLiveShow?: any;
  currentLiveShowImage?: string;
  onOpenChat?: () => void;
  volume: number;
  setVolume: (v: number) => void;
  isMuted: boolean;
  setIsMuted: (m: boolean) => void;
  className?: string;
  showProducers?: boolean;
}

import { UNIVERSAL_CHANNEL } from "../lib/radioAudio";

export default function MainPlayer({
  isGreek,
  stationPlaying,
  setStationPlaying,
  isLoadingAudio = false,
  setIsLoadingAudio,
  currentLiveShow,
  currentLiveShowImage,
  onOpenChat,
  volume,
  setVolume,
  isMuted,
  setIsMuted,
  className = "",
  showProducers = false
}: MainPlayerProps) {
  const [copiedShare, setCopiedShare] = React.useState(false);
  const [tick, setTick] = React.useState(Date.now());
  const [isVolumeHovered, setIsVolumeHovered] = React.useState(false);
  const [isVolumeDragging, setIsVolumeDragging] = React.useState(false);

  // Timer ticker for live show progress (throttled when paused or tab is hidden)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        setTick(Date.now());
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // If station is playing, tick every 1 second; if paused, update every 10 seconds.
    // Pauses execution when the phone screen is locked or tab is hidden to save mobile CPU/battery.
    const intervalDuration = stationPlaying ? 1000 : 10000;
    const interval = setInterval(() => {
      if (document.visibilityState !== "hidden") {
        setTick(Date.now());
      }
    }, intervalDuration);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [stationPlaying]);

  // Format seconds to MM:SS or HH:MM:SS
  const formatTime = (secs: number, forceHours = false) => {
    const totalSecs = Math.max(0, Math.floor(secs));
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const remainder = totalSecs % 60;
    if (hours > 0 || forceHours) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  // Calculate live show progress based on exact broadcast slot time
  const showProgress = React.useMemo(() => {
    const now = new Date();
    if (currentLiveShow && currentLiveShow.time) {
      const parts = currentLiveShow.time.split("-").map((s: string) => s.trim());
      if (parts.length === 2) {
        const [startH, startM] = parts[0].split(":").map(Number);
        const [endH, endM] = parts[1].split(":").map(Number);
        let startSec = (startH * 60 + startM) * 60;
        let endSec = (endH * 60 + endM) * 60;
        if (endSec <= startSec) endSec += 24 * 3600;

        let nowSec = (now.getHours() * 60 + now.getMinutes()) * 60 + now.getSeconds();
        if (endSec > 24 * 3600 && nowSec < startSec) nowSec += 24 * 3600;

        const elapsed = Math.max(0, nowSec - startSec);
        const total = Math.max(1, endSec - startSec);
        const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
        const hasHours = total >= 3600;

        return {
          percent: pct,
          elapsedStr: `${formatTime(elapsed, hasHours)} / ${formatTime(total, hasHours)}`,
          totalStr: formatTime(total, hasHours),
          hasLiveShow: true
        };
      }
    }

    // Continuous 24/7 Web Radio stream (no fake 60-min hourly loop)
    return {
      percent: stationPlaying ? 100 : 0,
      elapsedStr: isGreek ? "Ζωντανή Ροή 24/7" : "24/7 Live Stream",
      totalStr: "",
      hasLiveShow: false
    };
  }, [currentLiveShow, isGreek, tick, stationPlaying]);

  // Dynamically compute display title, description and artwork
  const displayTitle = currentLiveShow?.title || (isGreek ? UNIVERSAL_CHANNEL.greekName : UNIVERSAL_CHANNEL.name);
  const displaySubtitle = currentLiveShow 
    ? (showProducers && currentLiveShow.host ? `${currentLiveShow.host} • ${currentLiveShow.time}` : currentLiveShow.time)
    : (isGreek ? "Non-Stop Μουσική 24/7" : "Non-Stop Music 24/7");

  const currentImage = currentLiveShow
    ? (currentLiveShowImage || currentLiveShow.image || "/music-stream.jpg")
    : "/music-stream.jpg";



  // Copy site link to clipboard
  const handleShare = async () => {
    try {
      const siteUrl = window.location.origin + window.location.pathname;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(siteUrl);
      } else {
        const tempInput = document.createElement("input");
        tempInput.value = siteUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch (err) {
      console.warn("Clipboard copy notice:", err);
    }
  };

  const effectiveVolPercent = isMuted ? 0 : volume * 100;

  return (
    <div className={`w-full ${className}`}>
      {/* UNIFIED STUDIO HERO IMAGE + LIVE PLAYER IN ONE SINGLE BOX */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/90 flex flex-col transition-all">
        
        {/* Top Portion: Studio Photo with Live Now Overlay */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/9] lg:aspect-[16/8.5] bg-stone-900 overflow-hidden group">
          <img
            src={currentImage}
            alt={displayTitle}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          {/* Smooth bottom gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

          {/* Bottom Overlay on Image: Show Title & Producer */}
          <div className="absolute bottom-3 left-3.5 right-3.5 sm:bottom-3.5 sm:left-4 sm:right-4 text-white">
            <h4 className="font-display text-lg sm:text-xl lg:text-2xl font-black leading-tight drop-shadow-sm truncate tracking-tight">
              {displayTitle}
            </h4>
            <p className="font-sans text-xs sm:text-sm text-stone-300 mt-0.5 truncate font-semibold">
              {displaySubtitle}
            </p>
          </div>
        </div>

        {/* Bottom Portion: Live Player Controls inside the SAME box */}
        <div className="p-3.5 sm:p-4 bg-white md:bg-white/75 md:backdrop-blur-md flex flex-col gap-2.5 sm:gap-3 border-t border-black/[0.05]">
          
          {/* Row 1: Play/Pause Button + Live Progress Bar & Elapsed Time */}
          <div className="flex items-center gap-3 sm:gap-4 w-full">
            {/* Play/Pause Button */}
            <button
              onClick={() => {
                if (!stationPlaying) {
                  setIsLoadingAudio?.(true);
                  setStationPlaying(true);
                } else {
                  setStationPlaying(false);
                  setIsLoadingAudio?.(false);
                }
              }}
              aria-label={stationPlaying ? "Pause stream" : "Play live radio"}
              className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#1C1917] text-white flex items-center justify-center shrink-0 hover:bg-black transition-transform active:scale-95 cursor-pointer shadow-md group"
            >
              {isLoadingAudio ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : stationPlaying ? (
                <Pause className="w-5 h-5 fill-white text-white" />
              ) : (
                <Play className="w-5 h-5 fill-white text-white ml-0.5" />
              )}
              {/* Red dot indicator on player button */}
              {stationPlaying && !isLoadingAudio && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ad021a] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ad021a] border-2 border-white"></span>
                </span>
              )}
            </button>

            {/* Live Progress Bar & Timers */}
            <div className="flex-1 flex flex-col gap-1 min-w-0">
              <div className="flex items-center justify-between text-xs font-grotesk text-[#78716C]">
                <span className="font-bold tracking-wide">{showProgress.elapsedStr}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${stationPlaying ? "bg-[#ad021a] animate-pulse" : "bg-[#78716C]"}`} />
                  <span className="font-display text-[11px] font-black text-[#ad021a] tracking-wider">LIVE</span>
                </div>
              </div>

              {/* Dynamic Progress Bar */}
              <div className="relative w-full h-2 bg-[#EFECE3] rounded-full overflow-hidden flex items-center">
                <div 
                  className="h-full bg-[#ad021a] rounded-full transition-all duration-500 ease-linear"
                  style={{ width: showProgress.hasLiveShow ? `${Math.max(4, showProgress.percent)}%` : (stationPlaying ? "100%" : "0%") }}
                />
                {stationPlaying && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                )}
              </div>
            </div>
          </div>

          {/* Row 2: Red Volume Slider & Share / Live Chat Buttons */}
          <div className="flex items-center justify-between gap-2 sm:gap-3 pt-2 border-t border-black/[0.06]">
            
            {/* Volume Control with Interactive Animations & Tooltip */}
            <div 
              className="relative flex items-center gap-2 group/vol"
              onMouseEnter={() => setIsVolumeHovered(true)}
              onMouseLeave={() => setIsVolumeHovered(false)}
            >
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-[#78716C] hover:text-[#ad021a] hover:scale-115 active:scale-85 transition-transform duration-200 cursor-pointer p-1 shrink-0"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-[#ad021a]" />
                ) : volume < 0.4 ? (
                  <Volume className="w-4 h-4 text-[#ad021a]" />
                ) : volume < 0.75 ? (
                  <Volume1 className="w-4 h-4 text-[#ad021a]" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#ad021a]" />
                )}
              </button>

              {/* Custom styled Red Track Volume Slider with Animations */}
              <div className="relative flex items-center">
                {/* Floating Animated Percentage Badge */}
                <AnimatePresence>
                  {(isVolumeHovered || isVolumeDragging) && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 500, damping: 28 }}
                      className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1C1917] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shadow-lg pointer-events-none z-30 whitespace-nowrap"
                    >
                      {isMuted ? (isGreek ? "Σίγαση" : "Muted") : `${Math.round(volume * 100)}%`}
                    </motion.div>
                  )}
                </AnimatePresence>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onMouseDown={() => setIsVolumeDragging(true)}
                  onMouseUp={() => setIsVolumeDragging(false)}
                  onTouchStart={() => setIsVolumeDragging(true)}
                  onTouchEnd={() => setIsVolumeDragging(false)}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  style={{
                    background: `linear-gradient(to right, #ad021a 0%, #ad021a ${effectiveVolPercent}%, #EFECE3 ${effectiveVolPercent}%, #EFECE3 100%)`
                  }}
                  className={`w-16 sm:w-24 h-2 group-hover/vol:h-2.5 rounded-lg volume-slider transition-all duration-200 ${
                    stationPlaying && !isMuted && volume > 0 ? "volume-slider-playing" : ""
                  }`}
                  aria-label="Volume slider"
                />
              </div>
            </div>

            {/* Right Action Buttons: Live Chat & Share */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Quick Live Chat Button */}
              {onOpenChat && (
                <button
                  onClick={onOpenChat}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#78716C] hover:text-[#1C1917] px-2.5 sm:px-3 py-1 rounded-full hover:bg-[#FAF8F4] border border-black/5 transition-colors cursor-pointer whitespace-nowrap group active:scale-95"
                  title={isGreek ? "Άνοιγμα Live Chat" : "Open Live Chat"}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#78716C] group-hover:text-[#1C1917] group-hover:scale-110 transition-all" />
                  <span>Chat</span>
                </button>
              )}

              {/* Share Button (Copies Site Link) */}
              <div className="relative flex items-center">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#78716C] hover:text-[#1C1917] px-2.5 sm:px-3 py-1 rounded-full hover:bg-[#FAF8F4] border border-black/5 transition-colors cursor-pointer whitespace-nowrap"
                  title={isGreek ? "Αντιγραφή συνδέσμου ιστοσελίδας" : "Copy site link"}
                >
                  {copiedShare ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5 text-[#78716C]" />
                  )}
                  <span>{copiedShare ? (isGreek ? "Αντιγράφηκε" : "Copied") : (isGreek ? "Κοινοποίηση" : "Share")}</span>
                </button>

              {/* Tooltip feedback for copy */}
              <AnimatePresence>
                {copiedShare && (
                  <motion.span
                    initial={{ opacity: 0, y: 5, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.9 }}
                    className="absolute -top-8 right-0 bg-[#1C1917] text-white text-[10px] font-bold py-1 px-2.5 rounded-full whitespace-nowrap shadow-lg pointer-events-none"
                  >
                    {isGreek ? "Αντιγράφηκε!" : "Link Copied!"}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
