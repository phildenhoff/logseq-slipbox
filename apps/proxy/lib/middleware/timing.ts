import { Middleware } from "https://deno.land/x/oak@v12.6.1/mod.ts";

export const timeRequest: Middleware = async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
};
