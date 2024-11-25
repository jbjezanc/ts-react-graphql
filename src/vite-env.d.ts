/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_REACT_APP_GITHUB_URL: string;
  readonly VITE_REACT_APP_GITHUB_PAT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
