export class BookTitle{
    private readonly _value: string;
    private readonly maxLength: number = 200;

    constructor(title: string) {
        this._value = title;
    }


    get value(): string {
        return this._value;
    }

    isValid() {
        return this._value.length <= this.maxLength;
    }
}