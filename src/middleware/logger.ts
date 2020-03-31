// import * as Koa from 'koa';
import * as fs from 'fs';
import { resolve } from 'path';

const writeFileSync = function (f:Function, ...args: string[]) {
  return function () {
    return new Promise((resolve, reject) => {
      f(...args, (err: any) => {
        if (err) reject(`Write file error: ${err}`);
        resolve();
      });
    })
  }
};

const openFile = function (f: Function, ...args: any[]) {
  return function () {
    return new Promise((resolve, reject) => {
      f(...args, (err: any, fd: any) => {
        if (err) {
          if (err.code === "EEXIST") {
            resolve("EXIST");
          } else {
            reject(`ERROR in openFile: ${err}`);
          }
        }
        resolve("NOT_EXIST");
      })
    })
  }
}


export default async function logger(ctx: any, next: () => Promise<any>) {
  console.log(`-> ${ctx.request.URL}`);
  
  const now = new Date().getTime();
  const url = ctx.request.host;
  // const remoteAddress = ctx.request.remoteAddress; // todo
  const data = `time: ${now} - url: ${url}\n`;

  try {
    let res = await openFile(fs.open, resolve(__dirname, '../../log/log.log'), 'wx')();

    // console.log('res', res);
    if (res === 'NOT_EXIST') {
      fs.createReadStream(data).pipe(fs.createWriteStream('../../log/log.log'));
    } else {
      await writeFileSync(fs.appendFile, resolve(__dirname, '../../log/log.log'), data)();
    }
  } catch (e) {
    console.error("IO Error in logger: ", e);
  }
  await next();
}