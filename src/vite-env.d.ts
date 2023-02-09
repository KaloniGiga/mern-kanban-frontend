/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLIENT_SECRET: string;
  readonly VITE_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (input: IdConfiguration) => void
        prompt: (
          momentListener: (res: PromptMomentNotification) => void
        ) => void
        renderButton: (
          parent: HTMLElement | null,
          options: GsiButtonConfiguration
        ) => void
        disableAutoSelect: Function
        storeCredential: Function<{
          credentials: { id: string; password: string }
          callback: Function
        }>
        cancel: () => void
        onGoogleLibraryLoad: Function
        revoke: Function<{
          hint: string
          callback: Function<{ successful: boolean; error: string }>
        }>
      }
    }
  }
}