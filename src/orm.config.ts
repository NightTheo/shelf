import {createConnection} from "typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModuleAsyncOptions, TypeOrmModuleOptions} from "@nestjs/typeorm";

export const ormConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        return {
            type: configService.get('DB_TYPE'),
            host: configService.get('DB_HOST'),
            port: +configService.get<number>('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_DATABASE'),
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            dropSchema: false,
            logging: (configService.get('LOGGING') == 'true'),
        } as TypeOrmModuleOptions;
    },
    connectionFactory: async (options) => {
        return await createConnection(options);
    },
}