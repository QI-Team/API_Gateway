import Response from '../lib/response';
import { rGet, rSet } from '../lib/db.redis';

export default async function redisTest(ctx: any, next: () => Promise<any>) {
  console.log("......redis test......", ctx.request.path);
  const reg = /\/redis\/[a-z1-9_]+/i;
  if (reg.test(ctx.request.path)) {
    if (ctx.request.path === '/redis/data') {
      let { key, value } = ctx.request.body;

      try {
        let res = await rSet(key, value);

        res && ((ctx.body as Response) = {
          code: '0',
          info: {},
          msg: 'OK',
        })
      } catch (e) {
        console.error(`Error while set redis value : ${e}`);
        (ctx.body as Response) = {
          code: '1',
          info: {},
          msg: `Error while set redis value : ${e}`,
        }
      }
    } else {
      console.log('params: ', ctx.request.path.split('/'));
      let key = ctx.request.path.split('/')[2];

      console.log('key: ', key);
      try {
        let res = await rGet(key);

        console.log('res: ', res);
        if(res) {
          ((ctx.body as Response) = {
            code: '0',
            info: (res as {}),
            msg: '',
          });
        } else {
          ((ctx.body as Response) = {
            code: '0',
            info: {},
            msg: 'No data.',
          });
        }
      } catch (e) {
        console.error(`Error while get redis value : ${e}`);
        (ctx.body as Response) = {
          code: '1',
          info: {},
          msg: `Error while get redis value : ${e}`,
        }
      }
    }
  } else {
    await next();
  }
}