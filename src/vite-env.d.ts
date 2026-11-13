/// <reference types="vite/client" />

declare module 'virtual:show-images' {
  export const SHOW_FILES: string[];
}

interface ImportMetaEnv {
  readonly VITE_GIPHY_API_KEY?: string;
  readonly VITE_TENOR_API_KEY?: string;
  readonly VITE_R2_UPLOAD_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
