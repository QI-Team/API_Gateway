import gql from 'graphql-tag';
import { mysqlConfig } from '../../config';
import { request } from 'http';

import { Sequelize, Dialect } from 'sequelize';
import recordModel from '../lib/model';

const oRequest = function (url: string, options: {}) {
  return new Promise((resolve, reject) => {
    const req = request(url, options, res => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        resolve(chunk);
      });
    });

    req.on('error', (e) => {
      reject(e);
    })
    req.end();
  })
}

/**
 * 
 * @param ctx 
 * @param next
 * proxy, analysis request and transmit request.
 */
export default async function graphQL(ctx: any, next: () => Promise<any>) {
  console.log("-----------graphql-----------: ", ctx.request.headers);
  if (ctx.request.path === '/graphql' && ctx.request.method === 'POST') {
    const sequelize = new Sequelize(mysqlConfig.database,
      mysqlConfig.user, mysqlConfig.password, {
      host: mysqlConfig.host,
      port: mysqlConfig.port as number,
      dialect: mysqlConfig.client as Dialect,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });


    ; (async () => {
      try {
        await sequelize.authenticate();
        console.log("Connected successfully");
      } catch (e) {
        console.error("Error in line 49: ", e);
      }
    })();

    let { query, mutate } = ctx.request.body;
    let obj = gql`${query}`;
    let fields = (obj as any).definitions[0].selectionSet.selections.map((v: object) => (v as any).name.value);
    let response = [];

    console.log('--------fields---------: ', fields);
    try {
      for (let t of fields) {
        let res = await recordModel.findOne({
          where: {
            field: t
          }
        });

        console.log("-------res--------: ", res.dataValues.method);

        // content-length会导致Parse Error
        delete ctx.request.headers['content-length'];
        console.log('headers......', ctx.request.headers);
        const options = {
          method: 'post',
          headers: ctx.request.headers,
        }

        // let r = await oRequest(res.dataValues.value, options);
        if (res) {
          let r = await oRequest(res.dataValues.value, options);
          console.log("-------------response---------:", r);

          response.push(r);
        } else {
          throw new Error(`No data in return with this field: ${res}`,);
        }
      }
      console.log('operation', (obj as any).definitions[0].operation);
      console.log('field', fields);

      ctx.body = {
        code: '0',
        info: response,
        msg: 'ok'
      }
    } catch (e) {
      console.log("Error in graphql router: ", e);
    }
  } else {
    await next();
  }
}