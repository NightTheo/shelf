import {ConnectionOptions} from "typeorm";
require('dotenv').config();

const ormConfig: ConnectionOptions = {
    type: 'mysql',
    url: process.env.DB_URL,
    synchronize: false,
    dropSchema: false,
    migrationsRun: true,
    logging: true,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    cli: {migrationsDir: 'src/migrations'}
};

export = ormConfig;