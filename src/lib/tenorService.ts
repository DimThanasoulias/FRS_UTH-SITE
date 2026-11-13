/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TenorGif {
  id: string;
  title: string;
  url: string;        // High-quality GIF URL for sending to chat
  previewUrl: string; // Lightweight tiny GIF for fast picker grid
  width?: number;
  height?: number;
}

// Built-in curated GIFs so the UI works right out of the box even before configuring API keys
const FALLBACK_GIFS: Record<string, TenorGif[]> = {
  trending: [
    {
      id: "curated-1",
      title: "Radio DJ Mixing",
      url: "https://media.giphy.com/media/blSTtZehjAZ8I/giphy.gif",
      previewUrl: "https://media.giphy.com/media/blSTtZehjAZ8I/200w.gif",
    },
    {
      id: "curated-2",
      title: "Dancing Cat Music",
      url: "https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif",
      previewUrl: "https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/200w.gif",
    },
    {
      id: "curated-3",
      title: "Party Dance",
      url: "https://media.giphy.com/media/l2JIdnF6aJcA8B928/giphy.gif",
      previewUrl: "https://media.giphy.com/media/l2JIdnF6aJcA8B928/200w.gif",
    },
    {
      id: "curated-4",
      title: "Headbanging Rock",
      url: "https://media.giphy.com/media/10VJ2YDMoNEBl6/giphy.gif",
      previewUrl: "https://media.giphy.com/media/10VJ2YDMoNEBl6/200w.gif",
    },
    {
      id: "curated-5",
      title: "Retro Cassette Radio",
      url: "https://media.giphy.com/media/3o7bu3XilJ5BOiSGic/giphy.gif",
      previewUrl: "https://media.giphy.com/media/3o7bu3XilJ5BOiSGic/200w.gif",
    },
    {
      id: "curated-6",
      title: "Vibing Cat",
      url: "https://media.giphy.com/media/GeimqsH0TLDt4tScGw/giphy.gif",
      previewUrl: "https://media.giphy.com/media/GeimqsH0TLDt4tScGw/200w.gif",
    },
    {
      id: "curated-7",
      title: "Applause Bravo",
      url: "https://media.giphy.com/media/l3q2XhfQ8oCkm1Ts4/giphy.gif",
      previewUrl: "https://media.giphy.com/media/l3q2XhfQ8oCkm1Ts4/200w.gif",
    },
    {
      id: "curated-8",
      title: "LOL Laugh",
      url: "https://media.giphy.com/media/10JhviFuU2gWD6/giphy.gif",
      previewUrl: "https://media.giphy.com/media/10JhviFuU2gWD6/200w.gif",
    },
  ],
  music: [
    {
      id: "m-1",
      title: "Boombox",
      url: "https://media.giphy.com/media/mKMGLhoD8L4yc/giphy.gif",
      previewUrl: "https://media.giphy.com/media/mKMGLhoD8L4yc/200w.gif",
    },
    {
      id: "m-2",
      title: "Vinyl Record",
      url: "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",
      previewUrl: "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/200w.gif",
    },
    {
      id: "m-3",
      title: "Guitar Solo",
      url: "https://media.giphy.com/media/dM2xR2Rx614As/giphy.gif",
      previewUrl: "https://media.giphy.com/media/dM2xR2Rx614As/200w.gif",
    },
  ],
  party: [
    {
      id: "p-1",
      title: "Party Hard",
      url: "https://media.giphy.com/media/IwAZ6dvvvaNN6/giphy.gif",
      previewUrl: "https://media.giphy.com/media/IwAZ6dvvvaNN6/200w.gif",
    },
    {
      id: "p-2",
      title: "Disco Lights",
      url: "https://media.giphy.com/media/blSTtZehjAZ8I/giphy.gif",
      previewUrl: "https://media.giphy.com/media/blSTtZehjAZ8I/200w.gif",
    },
  ],
};

const getGiphyKey = (): string => {
  return (
    import.meta.env.VITE_GIPHY_API_KEY ||
    "PPh7BsFlZLcx9fZAc6SO9D1RysaZUf4S"
  );
};

const getTenorKey = (): string | undefined => {
  const k = import.meta.env.VITE_TENOR_API_KEY;
  return k?.startsWith("AIza") ? k : undefined;
};

export async function fetchTenorGifs(
  searchQuery?: string,
  limit = 24
): Promise<{ gifs: TenorGif[]; isFallback: boolean }> {
  const trimmed = searchQuery?.trim();
  const giphyKey = getGiphyKey();
  const tenorKey = getTenorKey();

  // 1. Try GIPHY API (Recommended, easiest to create and unlimited)
  if (giphyKey) {
    try {
      const endpoint = trimmed
        ? `https://api.giphy.com/v1/gifs/search?api_key=${giphyKey}&q=${encodeURIComponent(trimmed)}&limit=${limit}&rating=g`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${giphyKey}&limit=${limit}&rating=g`;

      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.data) && data.data.length > 0) {
          const gifs: TenorGif[] = data.data.map((item: any) => ({
            id: item.id || String(Math.random()),
            title: item.title || "GIF",
            url: item.images?.original?.url || item.images?.downsized?.url || "",
            previewUrl: item.images?.fixed_height_small?.url || item.images?.fixed_height?.url || item.images?.original?.url || "",
            width: item.images?.original?.width ? Number(item.images.original.width) : undefined,
            height: item.images?.original?.height ? Number(item.images.original.height) : undefined,
          })).filter((g: TenorGif) => Boolean(g.url));

          if (gifs.length > 0) {
            return { gifs, isFallback: false };
          }
        }
      }
    } catch (err) {
      console.warn("Giphy API error:", err);
    }
  }

  // 2. Try Tenor v2 API (if Google Cloud Tenor key is provided)
  if (tenorKey) {
    try {
      const endpoint = trimmed
        ? `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(trimmed)}&key=${tenorKey}&client_key=ffrs_radio_chat&limit=${limit}&media_filter=gif,tinygif`
        : `https://tenor.googleapis.com/v2/featured?key=${tenorKey}&client_key=ffrs_radio_chat&limit=${limit}&media_filter=gif,tinygif`;

      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.results) && data.results.length > 0) {
          const gifs: TenorGif[] = data.results.map((item: any) => {
            const gifFormat = item.media_formats?.gif;
            const tinyFormat = item.media_formats?.tinygif || item.media_formats?.nanogif || gifFormat;
            return {
              id: item.id || String(Math.random()),
              title: item.content_description || item.title || "Tenor GIF",
              url: gifFormat?.url || tinyFormat?.url || "",
              previewUrl: tinyFormat?.url || gifFormat?.url || "",
              width: gifFormat?.dims?.[0],
              height: gifFormat?.dims?.[1],
            };
          }).filter((g: TenorGif) => Boolean(g.url));

          if (gifs.length > 0) {
            return { gifs, isFallback: false };
          }
        }
      }
    } catch (err) {
      console.warn("Tenor API error:", err);
    }
  }

  // 3. Fallback to curated station GIFs
  const list = trimmed ? (FALLBACK_GIFS[trimmed.toLowerCase()] || FALLBACK_GIFS.trending) : FALLBACK_GIFS.trending;
  return { gifs: list, isFallback: true };
}
