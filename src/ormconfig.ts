import {ConnectionOptions} from "typeorm";
import {MysqlConnectionOptions} from "typeorm/driver/mysql/MysqlConnectionOptions";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
require('dotenv').config();

const options = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    synchronize: false,
    dropSchema: false,
    migrationsRun: true,
    logging: true,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    cli: {migrationsDir: 'src/migrations'}
};

function connectionOptionsFactory(type: string): ConnectionOptions {
    switch (type) {
        case 'mysql': return options as MysqlConnectionOptions;
        case 'postgre': return options as PostgresConnectionOptions;
        default: throw Error('Unhandled database type.');
    }
}

const ormConfig: ConnectionOptions = connectionOptionsFactory(process.env.DB_TYPE);
export = ormConfig;