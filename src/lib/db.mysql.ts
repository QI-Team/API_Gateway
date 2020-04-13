import * as Knex from 'knex';

const knex = Knex({
  client: 'mysql',
  connection: {
    host: '127.0.0.1:3306',
    user: 'root',
    password: '123456',
    database: 'analysis',
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