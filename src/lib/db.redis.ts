import * as redis from 'redis';

const client = redis.createClient();

const promisify = function (f: Function) {
  return function (...args: string[]) {
    return new Promise((resolve, reject) => {
      f(...args, (err: any, res: any) => {
        if (err) reject(err);
        resolve(res);
      })
    });
  }
}

const rGet = promisify(client.get);
const rSet = promisify(client.set);

export { rGet, rSet };