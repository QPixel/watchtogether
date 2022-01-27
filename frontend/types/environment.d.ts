declare namespace NodeJS {
  export interface ProcessEnv {
    DISCORD_ID: string;
    DISCORD_SECRET: string;
    SECRET: string;
    NEXT_PUBLIC_CLIENT_ID: string;
    NEXT_PUBLIC_WS_URI: string;
  }
}
