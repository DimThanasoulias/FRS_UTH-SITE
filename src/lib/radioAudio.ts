/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { RadioChannel } from "../types";

// Universal live MP3 radio stream URLs for FRS UTH (Official Asura Hosting Stream)
export const STREAM_HTTPS_URL = "https://a9.asurahosting.com/listen/frs_uth/radio.mp3";
export const STREAM_HTTP_URL = "http://a9.asurahosting.com/listen/frs_uth/radio.mp3";

export const getEffectiveStreamUrl = (): string => {
  if (typeof window !== "undefined" && window.location.protocol === "http:") {
    return STREAM_HTTP_URL;
  }
  return STREAM_HTTPS_URL;
};

export const UNIVERSAL_CHANNEL: RadioChannel = {
  id: "frs_uth",
  name: "Μουσική Ροή FRS UTH",
  greekName: "Μουσική Ροή FRS UTH",
  dj: "Non-Stop Μουσική 24/7",
  genre: "Official Live 192kbps MP3 Stream",
  url: STREAM_HTTPS_URL
};

class RadioAudioManager {
  private audio: HTMLAudioElement | null = null;
  private onLoadingChange: ((loading: boolean) => void) | null = null;
  private onPlayingChange: ((playing: boolean) => void) | null = null;
  private onErrorChange: ((failed: boolean) => void) | null = null;
  private userWantsPlaying = false;

  private initAudio(): HTMLAudioElement | null {
    if (typeof window === "undefined") return null;
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.preload = "none";

      this.audio.addEventListener("playing", () => {
        this.onLoadingChange?.(false);
        this.onPlayingChange?.(true);
      });

      this.audio.addEventListener("waiting", () => {
        if (this.userWantsPlaying) {
          this.onLoadingChange?.(true);
        }
      });

      this.audio.addEventListener("canplay", () => {
        this.onLoadingChange?.(false);
        if (this.audio && this.audio.seekable && this.audio.seekable.length > 0) {
          try {
            const liveEnd = this.audio.seekable.end(this.audio.seekable.length - 1);
            if (isFinite(liveEnd) && liveEnd > 0 && Math.abs(this.audio.currentTime - liveEnd) > 2) {
              this.audio.currentTime = liveEnd;
            }
          } catch {}
        }
      });

      this.audio.addEventListener("pause", () => {
        this.onLoadingChange?.(false);
        if (!this.userWantsPlaying) {
          this.onPlayingChange?.(false);
        }
      });

      this.audio.addEventListener("error", (e) => {
        console.warn("Radio audio stream error:", e);
        this.onErrorChange?.(true);
        this.onLoadingChange?.(false);
        if (this.userWantsPlaying) {
          this.userWantsPlaying = false;
          this.onPlayingChange?.(false);
        }
      });
    }
    return this.audio;
  }

  public setCallbacks(
    onLoadingChange?: (loading: boolean) => void,
    onPlayingChange?: (playing: boolean) => void,
    onErrorChange?: (failed: boolean) => void
  ) {
    this.onLoadingChange = onLoadingChange || null;
    this.onPlayingChange = onPlayingChange || null;
    this.onErrorChange = onErrorChange || null;
  }

  public play(volume = 0.85, isMuted = false) {
    this.onErrorChange?.(false);
    this.userWantsPlaying = true;
    const audio = this.initAudio();
    if (!audio) return;

    audio.volume = isMuted ? 0 : Math.max(0, Math.min(1, volume));

    const targetUrl = getEffectiveStreamUrl();
    const isMatchingSrc = Boolean(
      audio.src &&
      (audio.src.startsWith(STREAM_HTTPS_URL) || audio.src.startsWith(STREAM_HTTP_URL))
    );

    // Cache buster ensures the browser always connects directly to the real-time live broadcast
    // and never plays stale cached audio buffers from minutes or seconds in the past
    if (audio.error || !audio.src || !isMatchingSrc || audio.paused) {
      this.onLoadingChange?.(true);
      audio.src = `${targetUrl}?_t=${Date.now()}`;
      audio.load();
    }

    if (audio.paused) {
      this.onLoadingChange?.(true);
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.onLoadingChange?.(false);
            this.onPlayingChange?.(true);
          })
          .catch((err) => {
            this.onLoadingChange?.(false);
            if (err.name !== "AbortError") {
              console.warn("Radio audio play failed:", err);
              this.onErrorChange?.(true);
              this.userWantsPlaying = false;
              this.onPlayingChange?.(false);
            }
          });
      }
    }
  }

  public pause() {
    this.userWantsPlaying = false;
    if (this.audio) {
      this.onLoadingChange?.(false);
      if (!this.audio.paused) {
        this.audio.pause();
      }
      // Detach source so browser stops downloading in the background and drops stale buffered audio
      this.audio.src = "";
      this.onPlayingChange?.(false);
    }
  }

  public setVolume(volume: number, isMuted: boolean) {
    if (this.audio) {
      this.audio.volume = isMuted ? 0 : Math.max(0, Math.min(1, volume));
    }
  }

  public isPlaying(): boolean {
    return !!this.audio && !this.audio.paused;
  }
}

export const radioAudio = new RadioAudioManager();
