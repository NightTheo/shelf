import {ConnectionOptions} from "typeorm";
require('dotenv').config();

const ormConfig: ConnectionOptions = {
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

export = ormConfig;