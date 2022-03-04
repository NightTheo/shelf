import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';
import { MinioClient } from './minio-client';
import { config } from './config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        endPoint: config.MINIO_ENDPOINT,
        port: config.MINIO_PORT,
        useSSL: false,
        accessKey: config.MINIO_ROOT_USER,
        secretKey: config.MINIO_ROOT_PASSWORD,
        region: config.MINIO_REGION,
      }),
    }),
  ],
  providers: [MinioClient],
  exports: [MinioClient],
})
export class MinioClientModule {}
