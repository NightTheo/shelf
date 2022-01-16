export class Isnb{
    private readonly _value: string;

    constructor(isbn: string) {
        this._value = isbn;
    }

    get value(): string {
        return this._value;
    }

    public isValid(): Boolean {
        return this.value.length > 13;
    }
}