import { BufferFile } from '../exposition/controller/buffer-file';

export class BookCover {
  private picture: BufferFile;

  constructor(picture: BufferFile) {
    this.picture = picture;
  }
}
