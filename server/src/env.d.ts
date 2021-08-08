declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    PORT: string;
    CORS_ORIGIN: string;
    DATABASE_URL: string;
    REDIS_URL: string;
    SESSION_SECRET: string;
    MAIL_USER: string;
    MAIL_PASS: string;
  }
}