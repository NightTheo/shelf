import { FileFormatFilter } from './file-format.filter';
import { BufferFile } from '../buffer-file';
import { FileFormatException } from '../file-format.exception';

describe('FileFormatFilter', () => {
  it('should accept an image', () => {
    const filter = FileFormatFilter.of(['jpg', 'jpeg', 'png']);
    let allowed: boolean = false;
    filter(
      null,
      { originalname: 'testFile.jpg' } as BufferFile,
      (exception, isAllowed) => {
        allowed = isAllowed;
      },
    );
    expect(allowed).toBeTruthy();
  });

  it('should accept an image with given allowed format in uppercase', () => {
    const filter = FileFormatFilter.of(['JPG', 'JPEG', 'PNG']);
    let allowed: boolean = false;
    filter(
      null,
      { originalname: 'testFile.jpg' } as BufferFile,
      (exception, isAllowed) => {
        allowed = isAllowed;
      },
    );
    expect(allowed).toBeTruthy();
  });

  it('should accept an image with format in uppercase', () => {
    const filter = FileFormatFilter.of(['jpg', 'jpeg', 'png']);
    let allowed: boolean = false;
    filter(
      null,
      { originalname: 'testFile.JPEG' } as BufferFile,
      (exception, isAllowed) => {
        allowed = isAllowed;
      },
    );
    expect(allowed).toBeTruthy();
  });

  it('should accept an image in long path', () => {
    const filter = FileFormatFilter.of(['jpg', 'jpeg', 'png']);
    let allowed: boolean = false;
    filter(
      null,
      { originalname: 'path/in/deep/directory/testFile.jpg' } as BufferFile,
      (exception, isAllowed) => {
        allowed = isAllowed;
      },
    );
    expect(allowed).toBeTruthy();
  });

  it('should refuse an image', async () => {
    const filter = FileFormatFilter.of(['jpg', 'jpeg', 'png']);
    let formatException: any = null;
    filter(
      null,
      { originalname: 'testFile.gif' } as BufferFile,
      (exception, isAllowed) => {
        formatException = exception;
      },
    );
    expect(formatException).toBeInstanceOf(FileFormatException);
  });

  it('should refuse a file without extension', async () => {
    const filter = FileFormatFilter.of(['jpg', 'jpeg', 'png']);
    let formatException: any = null;
    filter(
      null,
      { originalname: 'testFile' } as BufferFile,
      (exception, isAllowed) => {
        formatException = exception;
      },
    );
    expect(formatException).toBeInstanceOf(FileFormatException);
  });

  it('should refuse a file with an empty name', async () => {
    const filter = FileFormatFilter.of(['jpg', 'jpeg', 'png']);
    let formatException: any = null;
    filter(null, {} as BufferFile, (exception, isAllowed) => {
      formatException = exception;
    });
    expect(formatException).toBeInstanceOf(FileFormatException);
  });
});
