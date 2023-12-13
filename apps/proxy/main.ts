import { connect } from "https://deno.land/x/amqp@v0.23.1/mod.ts";
import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { logRequest } from "./lib/middleware/logger.ts";
import { timeRequest } from "./lib/middleware/timing.ts";
import { AppState } from "./lib/middleware/_types.ts";
import {
  requireAuthorization,
  updateAuthState,
} from "./lib/middleware/authorization.ts";

const connection = await connect("");
const channel = await connection.openChannel();

const queueName = "my.queue";
await channel.declareQueue({ queue: queueName });
await channel.consume({ queue: queueName }, async (args, props, data) => {
  console.log(JSON.stringify(args));
  console.log(JSON.stringify(props));
  console.log(new TextDecoder().decode(data));
  await channel.ack({ deliveryTag: args.deliveryTag });
});

const app = new Application<AppState>();

app.use(logRequest, timeRequest);
app.use(updateAuthState);

// Hello World!
app.use(
  requireAuthorization((ctx) => {
    const userLogin = ctx.state.user.login;
    const userName = ctx.state.user.name;
    const userPic = ctx.state.user.pic;
    console.log({ userLogin, userName, userPic });
    ctx.response.body = `Hello, ${userName}!`;
  })
);

await app.listen({ hostname: "127.0.0.1", port: 8000 });
