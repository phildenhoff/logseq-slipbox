import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { logRequest } from "./lib/middleware/logger.ts";
import { timeRequest } from "./lib/middleware/timing.ts";
import { AppState, AuthorizedAppState } from "./lib/middleware/_types.ts";
import {
  authorizedOr401,
  updateAuthState,
} from "./lib/middleware/authorization.ts";
import { DB } from "https://deno.land/x/sqlite@v3.8/mod.ts";
import {
  addNote,
  allUserUnprocessedNotes,
  userIdFromLogin,
} from "./models/notes.ts";

const db = new DB("slipbox.db");
const app = new Application<AppState>();

app.use(logRequest, timeRequest);
app.use(updateAuthState);

const getQueueNameForUser = (userLogin: string) => {
  return `user.notes.${userLogin}`;
};

const authenticatedRoutes = new Router<AuthorizedAppState>({
  prefix: "/api/v1",
});
authenticatedRoutes.get("/whoami", (ctx) => {
  const userLogin = ctx.state.user.login;
  const userName = ctx.state.user.name;
  const userPic = ctx.state.user.pic;
  ctx.response.body = `<html><p>Hello, ${userName}!</p> <img src="${userPic}" /></html>`;
});
authenticatedRoutes.post("/note", async (ctx) => {
  const userLogin = ctx.state.user.login;
  const { content } = await ctx.request.body().value;

  const userId = userIdFromLogin(userLogin);
  addNote(userId, content, db);

  ctx.response.status = 200;
  ctx.response.body = "OK";
});
authenticatedRoutes.get("/notes", async (ctx) => {
  const userLogin = ctx.state.user.login;

  const userId = userIdFromLogin(userLogin);
  const rows = allUserUnprocessedNotes(userId, db);

  ctx.response.body = { notes: rows.map((row) => row.content) };
  ctx.response.status = 200;
});
app.use(authorizedOr401);
app.use(authenticatedRoutes.routes());
app.use(authenticatedRoutes.allowedMethods());

await app.listen({ hostname: "127.0.0.1", port: 8000 });
