import * as Koa from 'koa';
import * as body from 'koa-bodyparser';

import logger from './middleware/logger';
import graphQL from './middleware/graphql';
import knex from './lib/db.mysql';
import redisTest from './middleware/test.redis';

const app = new Koa();

knex('mysql_test');

app.use(logger);
app.use(body());
app.use(redisTest);
app.use(graphQL);
app.use(async (ctx, next) => {
  ctx.body = "Hello!";
});

app.listen(process.env.PORT || 8889, () => {
  console.log("App running.");
})