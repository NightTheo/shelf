export class FileLocation {
  path: string;

  constructor(path: string) {
    this.path = path;
  }

  public exists(): boolean {
    return this.path != null;
  }
}
