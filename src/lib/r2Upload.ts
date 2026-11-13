/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface R2UploadResult {
  url: string;
  filename: string;
  size: number;
}

/**
 * Uploads a compressed image blob to Cloudflare R2 via a Worker endpoint.
 * Configure the endpoint in your .env file:
 * VITE_R2_UPLOAD_ENDPOINT="https://upload.your-worker.workers.dev"
 */
export async function uploadImageToR2(
  blob: Blob,
  originalFilename = "image.webp"
): Promise<R2UploadResult> {
  const uploadEndpoint =
    import.meta.env.VITE_R2_UPLOAD_ENDPOINT ||
    "https://long-cell-8e3b.jimisthan.workers.dev";

  // Generate a random clean filename: chat_YYYYMMDD_random.[png|jpg|webp]
  let extension = "jpg";
  if (blob.type === "image/png" || originalFilename.toLowerCase().endsWith(".png")) {
    extension = "png";
  } else if (blob.type === "image/webp" || originalFilename.toLowerCase().endsWith(".webp")) {
    extension = "webp";
  } else if (blob.type === "image/jpeg" || blob.type === "image/jpg") {
    extension = "jpg";
  }

  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const cleanFilename = `chat_${timestamp}_${randomSuffix}.${extension}`;

  if (!uploadEndpoint) {
    // If R2 endpoint is not yet configured, throw a clear actionable error
    throw new Error(
      "MISSING_R2_ENDPOINT: Το Cloudflare R2 endpoint δεν έχει ρυθμιστεί ακόμα. Ορίστε το VITE_R2_UPLOAD_ENDPOINT στο .env (δείτε οδηγίες στο CLOUDFLARE_R2_SETUP.md)."
    );
  }

  const formData = new FormData();
  formData.append("file", blob, cleanFilename);

  const response = await fetch(uploadEndpoint, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Αποτυχία ανεβάσματος στο Cloudflare R2 (${response.status}): ${errorText || "Άγνωστο σφάλμα διακομιστή"}`
    );
  }

  const data = await response.json();
  if (!data.url) {
    throw new Error("Ο διακομιστής R2 δεν επέστρεψε έγκυρο URL εικόνας.");
  }

  return {
    url: data.url,
    filename: cleanFilename,
    size: blob.size,
  };
}

/**
 * Triggers background cleanup on the R2 worker to delete images older than 1 hour.
 */
export async function triggerR2Cleanup(): Promise<void> {
  const uploadEndpoint =
    import.meta.env.VITE_R2_UPLOAD_ENDPOINT ||
    "https://long-cell-8e3b.jimisthan.workers.dev";
  try {
    const cleanupUrl = uploadEndpoint.replace(/\/$/, "") + "/cleanup";
    await fetch(cleanupUrl, { method: "GET", mode: "cors" });
  } catch (err) {
    // Silently ignore cleanup network errors
  }
}
