import * as redis from 'redis';
// import { promisify } from 'util';

const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

const promisify = function (f: Function) {
  return (...args: string[]) => {
    return new Promise((resolve, reject) => {
      f.call(client, ...args, (err: any, res: any) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  }
}

const rGet = promisify(client.get);
const rSet = promisify(client.set);

export { rGet, rSet };