const runtimeEnv = typeof window !== "undefined" ? window.env : undefined;

const readRuntimeEnv = (key: keyof NonNullable<typeof runtimeEnv>) => {
  const value = runtimeEnv?.[key];

  return typeof value === "string" ? value : undefined;
};

const normalizeBasePath = (value: string) => {
  if (!value || value === "/") {
    return "/";
  }

  return value.endsWith("/") ? value : `${value}/`;
};

const fallbackOrigin =
  typeof window !== "undefined" ? window.location.origin : "";

export const API_ROOT = readRuntimeEnv("VITE_API_ROOT") ?? fallbackOrigin;
export const AUTH_URL = readRuntimeEnv("VITE_AUTH_URL") ?? "";
export const AUTH_REALM = readRuntimeEnv("VITE_AUTH_REALM") ?? "";
export const AUTH_CLIENT_ID = readRuntimeEnv("VITE_AUTH_CLIENT_ID") ?? "";
export const AUTH_REDIRECT_URI = readRuntimeEnv("VITE_AUTH_REDIRECT_URI") ?? "";
export const AUTH_SCOPE =
  readRuntimeEnv("VITE_AUTH_SCOPE") ?? "openid profile email";
export const APP_NAME =
  readRuntimeEnv("VITE_APP_NAME") ?? "Communication Platform";
export const BASE_PATH = normalizeBasePath(
  readRuntimeEnv("VITE_BASE_PATH") ?? "/",
);
export const AUTH_RUNTIME_CONFIG_READY = Boolean(
  AUTH_URL && AUTH_REALM && AUTH_CLIENT_ID && AUTH_REDIRECT_URI,
);
