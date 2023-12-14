import { connect } from "https://deno.land/x/amqp@v0.23.1/mod.ts";
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { logRequest } from "./lib/middleware/logger.ts";
import { timeRequest } from "./lib/middleware/timing.ts";
import { AppState, AuthorizedAppState } from "./lib/middleware/_types.ts";
import {
  authorizedOr401,
  requireAuthorization,
  updateAuthState,
} from "./lib/middleware/authorization.ts";

const connection = await connect(
  "amqps://susqddmi:qnQVhWPGFkEw7XXLlCuLlWKcHI6agZju@beaver.rmq.cloudamqp.com/susqddmi"
);
const channel = await connection.openChannel();

const queueName = "my.queue";
await channel.declareQueue({ queue: queueName });
await channel.consume({ queue: queueName }, async (args, props, data) => {
  console.log({
    args: JSON.stringify(args),
    props: JSON.stringify(props),
    data: JSON.parse(new TextDecoder().decode(data)),
  });
  await channel.ack({ deliveryTag: args.deliveryTag });
});

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
  const { content } = await ctx.request.body().value;

  channel.publish(
    { routingKey: getQueueNameForUser(ctx.state.user.login) },
    { contentType: "application/json" },
    new TextEncoder().encode(JSON.stringify({ content }))
  );

  ctx.response.status = 200;
  ctx.response.body = "OK";
});
authenticatedRoutes.get("/notes", async (ctx) => {
  const userLogin = ctx.state.user.login;
  const queueName = getQueueNameForUser(userLogin);
  await channel.declareQueue({ queue: queueName });
  const mensajes = [];
  await channel.consume({ queue: queueName }, async (args, props, data) => {
    const d2 = new TextDecoder().decode(data);
    console.log({
      d2,
    });
    mensajes.push(JSON.parse(d2));
    await channel.ack({ deliveryTag: args.deliveryTag });
  });

  console.log({ mensajes });
  ctx.response.body = { notes: mensajes };
  ctx.response.status = 200;
});
app.use(authorizedOr401);
app.use(authenticatedRoutes.routes());
app.use(authenticatedRoutes.allowedMethods());

await app.listen({ hostname: "127.0.0.1", port: 8000 });
