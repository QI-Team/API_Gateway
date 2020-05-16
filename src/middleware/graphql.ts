import gql from 'graphql-tag';
import { mysqlConfig, sourceConfig } from '../../config';
import { request } from 'http';

import { Sequelize, Dialect } from 'sequelize';
import recordModel from '../lib/model';

enum mutations {
  create = 'create',
  modify = 'modify',
  delete = 'delete',
}

interface DbOperator {
  findOne: (options: {}) => Promise<any>;
}

interface RequestOptions {
  method: string,
  body?: string,
  headers: any,
}

const oRequest = function (url: string, options: RequestOptions) {
  return new Promise((resolve, reject) => {
    const req = request(url, options, res => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        resolve(chunk);
      });
    });

    req.on('error', (e) => {
      reject(e);
    });
    req.write(options.body);
    req.end();
  })
}

const getQuery = async function (fields: string[], db: DbOperator, options: RequestOptions): Promise<object[]> {
  let response: any[] = [];

  try {
    for (let t of fields) {
      let res = await db.findOne({
        where: {
          field: t
        }
      });

      if (res) {
        let r = await oRequest(res.dataValues.value, options) as string;

        // console.log('response: ', r);
        response.push(JSON.parse(r).info);
      } else {
        throw new Error(`No data in return with this field: ${res}`);
      }
    }

    return response;
  } catch (e) {
    console.error("Error in line 57 with function getQuery: ", e);
  }
}

const doMutation = async function (fields: string, db: DbOperator, options: RequestOptions): Promise<object[]> {
  let response: any[] = [];

  try {
    if (fields === mutations.create) {
      let res = await oRequest(sourceConfig.find(v => v.tag === 'CREATE_USER').url, options) as string;

      console.log("response: ", res);
      response.push(JSON.parse(res).info);
    }

    if (fields === mutations.modify) {
      let res = await oRequest(sourceConfig.find(v => v.tag === 'MODIFY_USER').url, options) as string;

      console.log("response: ", res);
      response.push(JSON.parse(res).info);
    }

    if (fields === mutations.delete) {
      let res = await oRequest(sourceConfig.find(v => v.tag === 'DELETE_USER').url, options) as string;

      console.log("response: ", res);
      response.push(JSON.parse(res).info);
    }

    return response;
  } catch (e) {
    console.error("Error in line with function doMutation: ", e);
  }
}

/**
 * 
 * @param ctx 
 * @param next
 * proxy, analysis request and transmit request.
 */

export default async function graphQL(ctx: any, next: () => Promise<any>) {
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

    // // content-length的长度与实际传输的大小不一致会导致Parse Error
    delete ctx.request.headers['content-length'];

    let { query, variables } = ctx.request.body;
    let obj = {};

    if (query) {
      obj = gql`${query}`;

      console.log("object: ", obj);

      const operation = (obj as any).definitions[0].operation;
      const fields = (obj as any).definitions[0].selectionSet.selections.map((v: object) => (v as any).name.value);

      console.log("params:", operation, fields, variables);
      const options = {
        method: 'post',
        body: JSON.stringify(variables ? variables : {}),
        headers: ctx.request.headers,
      }

      // 对于mutate操作
      let response = {};

      if (operation === 'mutation') {
        response = await doMutation(fields[0], recordModel, options);
      } else {
        response = await getQuery(fields, recordModel, options);
      }


      ctx.body = {
        code: '0',
        info: response,
        msg: 'ok'
      }
    } else {
      throw new Error('Operator must be query or mutate!');
    }
  } else {
    await next();
  }
}