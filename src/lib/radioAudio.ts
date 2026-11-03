/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RadioChannel } from "../types";

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
      });

      this.audio.addEventListener("pause", () => {
        this.onLoadingChange?.(false);
        if (!this.userWantsPlaying) {
          this.onPlayingChange?.(false);
        }
      });

      this.audio.addEventListener("error", (e) => {
        console.warn("Radio audio stream error:", e);
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
    onPlayingChange?: (playing: boolean) => void
  ) {
    this.onLoadingChange = onLoadingChange || null;
    this.onPlayingChange = onPlayingChange || null;
  }

  public play(volume = 0.85, isMuted = false) {
    this.userWantsPlaying = true;
    const audio = this.initAudio();
    if (!audio) return;

    audio.volume = isMuted ? 0 : Math.max(0, Math.min(1, volume));

    const targetUrl = getEffectiveStreamUrl();
    if (!audio.src || (audio.src !== STREAM_HTTPS_URL && audio.src !== STREAM_HTTP_URL)) {
      this.onLoadingChange?.(true);
      audio.src = targetUrl;
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
