import { Middleware } from "https://deno.land/x/oak@v12.6.1/middleware.ts";

export const logRequest: Middleware = async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
};
