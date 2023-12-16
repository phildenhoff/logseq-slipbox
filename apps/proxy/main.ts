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
import { createDb } from "./tools/db_setup.ts";

const dbPath = Deno.args[0];

// Create DB if it doesn't exist
try {
  Deno.statSync(dbPath);
  // Database exists; do nothing.
} catch {
  createDb(dbPath);
}

const db = new DB(dbPath);
const app = new Application<AppState>();

app.use(logRequest, timeRequest);
app.use(updateAuthState);

const uiRoutesWithAuth = new Router<AuthorizedAppState>();
uiRoutesWithAuth.get("/", (ctx) => {
  ctx.response.body = Deno.readTextFileSync("./pages/index.html");
});
app.use(uiRoutesWithAuth.routes());
app.use(uiRoutesWithAuth.allowedMethods());

const apiRoutesWithAuth = new Router<AuthorizedAppState>({
  prefix: "/api/v1",
});
apiRoutesWithAuth.get("/whoami", (ctx) => {
  const userLogin = ctx.state.user.login;
  const userName = ctx.state.user.name;
  const userPic = ctx.state.user.pic;
  ctx.response.body = `<html><p>Hello, ${userName} (${userLogin})!</p> <img src="${userPic}" /></html>`;
});
apiRoutesWithAuth.post("/note", async (ctx) => {
  const userLogin = ctx.state.user.login;
  const { content } = await ctx.request.body().value;

  const userId = userIdFromLogin(userLogin);
  addNote(userId, content, db);

  ctx.response.status = 200;
  ctx.response.body = "OK";
});
apiRoutesWithAuth.get("/notes", (ctx) => {
  const userLogin = ctx.state.user.login;

  const userId = userIdFromLogin(userLogin);
  const rows = allUserUnprocessedNotes(userId, db);

  ctx.response.body = { notes: rows.map((row) => row.content) };
  ctx.response.status = 200;
});
app.use(authorizedOr401);
app.use(apiRoutesWithAuth.routes());
app.use(apiRoutesWithAuth.allowedMethods());

console.log("Listening on http://127.0.0.1:61230");
await app.listen({ hostname: "127.0.0.1", port: 61230 });
