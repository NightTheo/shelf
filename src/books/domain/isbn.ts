export class Isnb{
    private _value: string;

    constructor(isbn: string) {
        this._value = isbn;
    }

    public isValid() {

    }


    get value(): string {
        return this._value;
    }
}