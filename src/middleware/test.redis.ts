import Response from '../lib/response';
import { rGet, rSet } from '../lib/db.redis';

export default async function redisTest(ctx: any, next: () => Promise<any>) {
  if (ctx.request.path === '/redis/key') {
    let { key } = ctx.request.body;

    try {
      let res = await rGet(key);

      res && ((ctx.body as Response)= {
        code: '0',
        info: (res as {}),
        msg: '',
      })
    } catch (e) {
      console.error(`Error while get redis value : ${e}`);
      (ctx.body as Response)= {
        code: '1',
        info: {},
        msg: `Error while get redis value : ${e}`,
      }
    }
  }else if (ctx.request.path === '/redis/data') {
    let { key, value } = ctx.request.body;

    try {
      let res = await rSet(key, value);

      res && ((ctx.body as Response)= {
        code: '0',
        info: (res as {}),
        msg: '',
      })
    } catch (e) {
      console.error(`Error while set redis value : ${e}`);
      (ctx.body as Response)= {
        code: '1',
        info: {},
        msg: `Error while set redis value : ${e}`,
      }
    }
  }else {
    await next();
  }
}