import * as Koa from 'koa';
import * as body from 'koa-bodyparser';
import * as cors from '@koa/cors';

import logger from './middleware/logger';
import graphQL from './middleware/graphql';
import redisTest from './middleware/test.redis';
import record from './middleware/record';

const app = new Koa();

app.use(logger);
app.use(cors());
app.use(body());
app.use(redisTest);
app.use(graphQL);
app.use(record);
app.use(async (ctx, next) => {
  ctx.body = "Hello!";
});

app.listen(process.env.PORT || 8889, () => {
  console.log("App running.");
});