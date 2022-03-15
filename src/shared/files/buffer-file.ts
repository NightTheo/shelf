export interface BufferFile {
  fieldname: string;
  originalname: string;
  filename: string;
  encoding: string;
  size: number;
  buffer: Buffer | string;
  mimetype: string;
}
