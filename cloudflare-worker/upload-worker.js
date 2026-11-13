/**
 * Cloudflare Worker for Live Chat Image Uploads to R2
 * with Automatic 1-Hour Expiration / Deletion
 * 
 * Setup instructions:
 * 1. Cloudflare Dashboard -> R2 -> Create bucket (e.g. "ffrs-chat-images")
 * 2. In bucket settings -> Enable "Public Access" or connect custom domain
 * 3. Bind bucket to this Worker as `CHAT_BUCKET`
 * 4. Add Environment Variable `PUBLIC_IMAGE_URL` (e.g. "https://pub-xxxx.r2.dev")
 * 5. (Optional) In Worker Settings -> Triggers -> Add Cron Trigger: `0 * * * *` (hourly)
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * Deletes images in R2 older than 1 hour (3600 seconds)
 */
async function cleanupOldImages(env) {
  if (!env.CHAT_BUCKET) return { deleted: 0 };
  const ONE_HOUR_MS = 60 * 60 * 1000;
  const now = Date.now();
  let deletedCount = 0;

  try {
    let truncated = true;
    let cursor = undefined;

    while (truncated) {
      const list = await env.CHAT_BUCKET.list({ limit: 500, cursor });
      for (const obj of list.objects) {
        const uploadTime = new Date(obj.uploaded).getTime();
        if (now - uploadTime > ONE_HOUR_MS) {
          await env.CHAT_BUCKET.delete(obj.key);
          deletedCount++;
        }
      }
      truncated = list.truncated;
      cursor = list.cursor;
    }
  } catch (err) {
    console.error("Cleanup error in R2 bucket:", err);
  }

  return { deleted: deletedCount };
}

export default {
  // 1. HTTP Fetch Handler (Upload & Manual Cleanup)
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // Dedicated cleanup endpoint: /cleanup
    if (url.pathname === "/cleanup") {
      const result = await cleanupOldImages(env);
      return new Response(
        JSON.stringify({ success: true, ...result }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    try {
      const formData = await request.formData();
      const file = formData.get("file");

      if (!file || typeof file === "string") {
        return new Response(JSON.stringify({ error: "No file uploaded" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // Max file size security check (e.g. 5 MB)
      if (file.size > 5 * 1024 * 1024) {
        return new Response(JSON.stringify({ error: "File too large (max 5MB)" }), {
          status: 413,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const ext = file.name?.split(".").pop()?.toLowerCase() || "jpg";
      let contentType = file.type;
      if (!contentType || contentType === "application/octet-stream") {
        if (ext === "png") contentType = "image/png";
        else if (ext === "jpg" || ext === "jpeg") contentType = "image/jpeg";
        else if (ext === "webp") contentType = "image/webp";
        else if (ext === "gif") contentType = "image/gif";
        else contentType = "image/jpeg";
      }

      const filename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;

      // Upload to Cloudflare R2
      await env.CHAT_BUCKET.put(filename, file.stream(), {
        httpMetadata: {
          contentType: contentType,
          cacheControl: "public, max-age=3600, immutable", // Cache max 1 hour
        },
      });

      // Run automatic background cleanup for images older than 1 hour
      if (ctx && typeof ctx.waitUntil === "function") {
        ctx.waitUntil(cleanupOldImages(env));
      }

      const publicBaseUrl = (env.PUBLIC_IMAGE_URL || "").replace(/\/$/, "");
      const imageUrl = `${publicBaseUrl}/${filename}`;

      return new Response(
        JSON.stringify({
          success: true,
          url: imageUrl,
          filename: filename,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err?.message || "Internal Upload Error" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }
  },

  // 2. Scheduled Cron Trigger Handler (e.g. hourly trigger: "0 * * * *")
  async scheduled(event, env, ctx) {
    if (ctx && typeof ctx.waitUntil === "function") {
      ctx.waitUntil(cleanupOldImages(env));
    } else {
      await cleanupOldImages(env);
    }
  },
};
