import { Middleware, Next } from "https://deno.land/x/oak@v12.6.1/mod.ts";

export const requireTailscaleHeaders: Middleware = async (ctx, next: Next) => {
  const userLogin = ctx.request.headers.get("Tailscale-User-Login");
  const userName = ctx.request.headers.get("Tailscale-User-Name");
  const userProfilePic = ctx.request.headers.get("Tailscale-User-Profile-Pic");
  if (!userLogin) {
    ctx.response.status = 401;
    ctx.response.body = "Unauthorized";
    ctx.state.user = { __type: "unauthorized" };
    return;
  }
  ctx.state.user = {
    __type: "identified",
    login: userLogin,
    name: userName,
    pic: userProfilePic,
  };
  await next();
};
