/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { X, ExternalLink, Download } from "lucide-react";

interface ImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
  isGreek: boolean;
}

export default function ImageModal({
  imageUrl,
  onClose,
  isGreek,
}: ImageModalProps) {
  useEffect(() => {
    if (!imageUrl) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [imageUrl, onClose]);

  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Controls */}
        <div className="absolute -top-12 right-0 flex items-center gap-2">
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title={isGreek ? "Άνοιγμα σε νέα καρτέλα" : "Open in new tab"}
          >
            <ExternalLink className="w-5 h-5" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title={isGreek ? "Κλείσιμο" : "Close"}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image */}
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 max-h-[85vh] flex items-center justify-center bg-black/40">
          <img
            src={imageUrl}
            alt="Preview"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}
