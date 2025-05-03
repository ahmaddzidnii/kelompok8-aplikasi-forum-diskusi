export const config = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "MyApp",
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0",
  logLevel: process.env.NEXT_PUBLIC_LOG_LEVEL ?? "info",
  defaultRedrictAfterLoginUrl:
    process.env.NEXT_PUBLIC_DEFAULT_AFTER_LOGIN_URL ?? "/",
};
