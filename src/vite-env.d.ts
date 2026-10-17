/// <reference types="vite/client" />

type URLString = `http://${string}` | `https://${string}`;

interface Window {
  env?: {
    VITE_API_ROOT?: URLString | "";
    VITE_AUTH_URL?: URLString | "";
    VITE_AUTH_CLIENT_ID?: string;
    VITE_AUTH_REDIRECT_URI?: URLString | "";
    VITE_AUTH_SCOPE?: string;
    VITE_AUTH_REALM?: string;
    VITE_AUTH_ENABLED?: "true" | "false" | string;
    VITE_AUTH_MOCK_USERNAME?: string;
    VITE_APP_NAME?: string;
    VITE_BASE_PATH?: string;
    VITE_NODE_ENV?: "development" | "stage" | "production";
  };
}