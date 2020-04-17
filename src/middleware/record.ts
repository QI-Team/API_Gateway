import { Sequelize, Dialect } from 'sequelize';

import { mysqlConfig } from '../../config';
import recordModel from '../lib/model';

export default async function record(ctx: any, next: () => Promise<any>) {
  if (ctx.request.path.match(/\/record/i)) {
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

        await recordModel.sync({ force: false });
      } catch (e) {
        console.error("Error in line 25: ", e);
      }
    })();

    if (ctx.request.path === '/record' && ctx.request.method.toLowerCase() === 'get') {
      try {
        let res = await recordModel.findAll();
        if (res) {
          ctx.body = {
            code: '0',
            info: res,
            msg: ''
          }
        } else {
          ctx.body = {
            code: '1',
            info: {},
            msg: 'no data'
          }
        }
      } catch (e) {
        console.error(`Error in line 75, time: ${new Date()},  getting all data: e.message`);
      }
    }

    let reg = /\/[a-zA-Z0-9_]+\/[a-zA-Z0-9_]+/i;

    if (reg.test(ctx.request.path) && ctx.request.method.toLowerCase() === 'get') {
      const field = ctx.request.path.split('/')[2];

      if (field) {
        try {
          let res = await recordModel.findAll({
            where: {
              field,
            }
          });

          ctx.body = {
            code: '0',
            info: res,
            msg: ''
          }
        } catch (e) {
          console.error(`Error in line 97, time: ${new Date()},  getting all data: ${e.message}`);
        }
      } else {
        ctx.body = {
          code: '1',
          info: {},
          msg: 'No key.'
        }
      }
    }


    if (ctx.request.path === '/record' && ctx.request.method.toLowerCase() === 'post') { // update
      const { field, value, method } = ctx.request.body;

      try {
        let res = await recordModel.update({ field: value, method }, {
          where: {
            field,
          }
        });

        ctx.body = {
          code: '0',
          info: res,
          msg: ''
        }
      } catch (e) {
        console.error(`Error in line 123, time: ${new Date()},  post data: ${e.message}`);
      }
    }


    if (ctx.request.path === '/record' && ctx.request.method.toLowerCase() === 'put') { // create
      const { field, value, method } = ctx.request.body;

      try {
        let res = await recordModel.findAll({
          where: {
            field,
          }
        });

        console.log("res: ", res);
        if (!res.length) {
          await recordModel.create({ field, value, method });

          ctx.body = {
            code: '0',
            info: {},
            msg: 'OK',
          }
        } else {
          ctx.body = {
            code: '1',
            info: {},
            msg: 'Data already exists.'
          }
        }
      } catch (e) {
        console.error(`Error in line 147, time: ${new Date()},  put data: ${e.message}`);
      }
    }


    if (reg.test(ctx.request.path) && ctx.request.method.toLowerCase() === 'delete') {
      const field = ctx.request.path.split('/')[2];

      try {
        await recordModel.destroy({
          where: {
            field,
          }
        });
        ctx.body = {
          code: '0',
          info: {},
          msg: 'ok'
        }
      } catch (e) {
        console.error(`Error in line 147, time: ${new Date()},  put data: ${e.message}`);
      }
    }

  } else {
    await next();
  }
}