export interface BufferFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  size: number;
  buffer: Buffer | string;
  mimetype: string;
}
