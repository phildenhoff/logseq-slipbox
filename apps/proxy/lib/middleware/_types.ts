import { Middleware } from "https://deno.land/x/oak@v12.6.1/middleware.ts";

export type IdentifiedUser = {
  __type: "identified";
  login: string;
  name: string;
  pic: string;
};

export type UnauthorizedUser = {
  __type: "unauthorized";
};

export type AppState = {
  user: IdentifiedUser | UnauthorizedUser;
};

export type AuthorizedMiddleware = Middleware<
  { user: IdentifiedUser } & Omit<AppState, "user">
>;
