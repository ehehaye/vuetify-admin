/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_ROUTER_HISTORY: 'hash' | 'history';
  readonly VITE_AMAP_JS_KEY: string;
  readonly VITE_GITHUB_REPO: string;
  readonly VITE_MD_ICON_HREF: string;
  readonly VITE_USE_MOCK?: 'true' | 'false';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
