require('dotenv').config();

export const config = {
  MINIO_ENDPOINT: process.env.STORAGE_ENDPOINT || 'minio',
  MINIO_PORT: +process.env.STORAGE_PORT || 9000,
  MINIO_ROOT_USER: process.env.STORAGE_USER,
  MINIO_ROOT_PASSWORD: process.env.STORAGE_PASSWORD,
  MINIO_BUCKET: process.env.STORAGE_BUCKET || 'shelf',
  MINIO_REGION: process.env.STORAGE_REGION || '',
  MINIO_USE_SSL: false,
};
