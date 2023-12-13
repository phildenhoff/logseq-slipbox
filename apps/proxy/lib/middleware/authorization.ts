import { Middleware, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { AppState, AuthorizedMiddleware } from "./_types.ts";
import { requireTailscaleHeaders } from "./tailscale.ts";

/**
 * Update the state of the request's context if the user is authenticated or not.
 */
export const updateAuthState = requireTailscaleHeaders;

/**
 * Only run the resolver if the user is authorized.
 * @param resolver Middleware resolver to run.
 * @returns
 */
export const requireAuthorization = (
  resolver: AuthorizedMiddleware
): Middleware<AppState, Context<AppState, AppState>> => {
  return async (ctx, next) => {
    if (ctx.state.user.__type === "unauthorized") {
      return;
    }

    // @ts-ignore: TS doesn't believe that the user is authorized
    await resolver(ctx, next);
  };
};
