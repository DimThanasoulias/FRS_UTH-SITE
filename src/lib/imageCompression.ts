/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CompressionResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  reductionPercentage: number;
  previewUrl: string;
  width: number;
  height: number;
  mimeType: string;
  formatName: string; // "PNG" | "JPG" | "WebP"
}

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: "auto" | "image/png" | "image/jpeg" | "image/webp";
}

/**
 * Format bytes to readable string (e.g. 1.2 MB, 84 KB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Compresses an image client-side before upload (Instagram-style).
 * Limits max dimensions to 1200px, maintains aspect ratio,
 * and preserves PNG (with transparency), JPEG/JPG, and WebP formats.
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    format = "auto",
  } = options;

  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      return reject(new Error("Το αρχείο δεν είναι εικόνα"));
    }

    // Determine target format
    let targetMime: string;
    let formatLabel: string;

    if (format !== "auto") {
      targetMime = format;
      formatLabel = format === "image/png" ? "PNG" : format === "image/webp" ? "WebP" : "JPG";
    } else {
      // Auto-detect and preserve original format (PNG, JPG, WebP)
      if (file.type === "image/png" || file.name.toLowerCase().endsWith(".png")) {
        targetMime = "image/png";
        formatLabel = "PNG";
      } else if (file.type === "image/webp" || file.name.toLowerCase().endsWith(".webp")) {
        targetMime = "image/webp";
        formatLabel = "WebP";
      } else {
        // Default to JPEG for photos, camera images, jpg, etc.
        targetMime = "image/jpeg";
        formatLabel = "JPG";
      }
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error("Αποτυχία ανάγνωσης αρχείου"));
    };

    reader.onload = (e) => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error("Αποτυχία φόρτωσης εικόνας"));
      };

      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Calculate aspect-ratio scaling (max 1200px Instagram-style)
        if (width > maxWidth || height > maxHeight) {
          if (width >= height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject(new Error("Αποτυχία αρχικοποίησης Canvas"));
        }

        // High quality bicubic-like smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // For JPEG, fill transparent background with white if needed (to avoid black background on transparent images converted to jpg)
        if (targetMime === "image/jpeg") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, width, height);
        }

        // Draw image onto canvas (automatically normalizes EXIF rotation bloat)
        ctx.drawImage(img, 0, 0, width, height);

        // Quality argument is ignored for PNG by browsers, but used for JPEG/WebP
        const compressionQuality = targetMime === "image/png" ? undefined : quality;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error("Αποτυχία συμπίεσης εικόνας"));
            }

            const originalSize = file.size;
            const compressedSize = blob.size;
            const reductionPercentage = Math.max(
              0,
              Math.round(((originalSize - compressedSize) / originalSize) * 100)
            );

            const previewUrl = URL.createObjectURL(blob);

            resolve({
              blob,
              originalSize,
              compressedSize,
              reductionPercentage,
              previewUrl,
              width,
              height,
              mimeType: targetMime,
              formatName: formatLabel,
            });
          },
          targetMime,
          compressionQuality
        );
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
