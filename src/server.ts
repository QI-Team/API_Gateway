import * as Koa from 'koa';

const app = new Koa();

app.listen(process.env.PORT || 8889, () => {
  console.log("App running.");
})