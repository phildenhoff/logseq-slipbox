import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { logRequest } from "./lib/middleware/logger.ts";
import { timeRequest } from "./lib/middleware/timing.ts";
import { AppState, AuthorizedAppState } from "./lib/middleware/_types.ts";
import {
	authorizedOr401,
	updateAuthState,
} from "./lib/middleware/authorization.ts";

import {
	addNote,
	allUserNotes,
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
// Enable CORS for all routes
app.use(oakCors());

app.use(logRequest, timeRequest);
app.use(updateAuthState);

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
	const params = ctx.request.url.searchParams;
	const userLogin = ctx.state.user.login;

	const userId = userIdFromLogin(userLogin);

	let rows = [];
	if (params.has("all")) {
		rows = allUserNotes(userId, db);
	} else {
		rows = allUserUnprocessedNotes(userId, db);
	}

	ctx.response.body = { notes: rows.map((row) => row.content) };
	ctx.response.status = 200;
});
app.use(authorizedOr401);
app.use(apiRoutesWithAuth.routes());
app.use(apiRoutesWithAuth.allowedMethods());

app.use(async (context) => {
	await context.send({
		root: `${Deno.cwd()}/public`,
		index: "index.html",
	});
});

console.log("Listening on http://127.0.0.1:61230");
await app.listen({ hostname: "127.0.0.1", port: 61230 });
