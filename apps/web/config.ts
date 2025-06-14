export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
export const MIN_PAGE_SIZE = 1;

export const config = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "MyApp",
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0",
  logLevel: process.env.NEXT_PUBLIC_LOG_LEVEL ?? "info",
  defaultRedrictAfterLoginUrl:
    process.env.NEXT_PUBLIC_DEFAULT_AFTER_LOGIN_URL ?? "/",
  loginRoute: process.env.NEXT_PUBLIC_LOGIN_ROUTE ?? "/auth/login",

  permit: {
    token: process.env.PERMIT_TOKEN,
  },

  questions: {
    defaultLimit: 10,
  },
  answers: {
    defaultLimit: 10,
  },
  bookmarks: {
    defaultLimit: 10,
  },
  comments: {
    defaultLimit: 10,
    maxLength: 500,
  },
  replies: {
    defaultLimit: 10,
    maxLength: 500,
  },
  votes: {
    limitUserShow: 5,
  },
};
