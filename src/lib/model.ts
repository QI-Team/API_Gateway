import { Sequelize, Dialect, Model, BuildOptions, DataTypes } from 'sequelize';
import { mysqlConfig } from '../../config';

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

// We need to declare an interface for our model that is basically what our class would be
interface MyModel extends Model {
  readonly id: number;
  field: string,
  value: string,
  tips: string,
  other: string,
}

// Need to declare the static model so `findOne` etc. use correct types.
type MyModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): MyModel;
}

// TS can't derive a proper class definition from a `.define` call, therefor we need to cast here.
const recordModel = <MyModelStatic>sequelize.define('recordModel', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
  },
  field: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tips: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  other: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

export default recordModel;
