import * as Koa from 'koa';

import logger from './middleware/logger';
import graphQL from './middleware/graphql';

const app = new Koa();

app.use(logger);
app.use(graphQL);
app.use(async (ctx, next) => {
  ctx.body = "Hello!";
});

app.listen(process.env.PORT || 8889, () => {
  console.log("App running.");
})