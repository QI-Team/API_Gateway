import * as Knex from 'knex';
import mysqlConfig from '../../config/db.mysql';

const knex = Knex({
  client: 'mysql',
  connection: mysqlConfig,
  pool: {
    min: 0,
    max: 7,
    afterCreate: () => {
      console.info('After created.');
    }
  },
  acquireConnectionTimeout: 10000,
  log: {
    warn(message) {
      console.warn(message);
    },
    error(message) {
      console.error(message);
    },
    deprecate(message) {
      console.info(message);
    },
    debug(message) {
      console.log(message);
    },
  }
});

export default knex;