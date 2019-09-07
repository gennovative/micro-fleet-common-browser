
/**
 * An object that contains paged array of items.
 */
export class PagedData<T> {

    private _total: number = 0
    private _items: T[]

    /**
     * Gets number of contained items
     */
    public get length(): number {
        return this._items.length
    }

    /**
     * Gets total number of items.
     */
    public get total(): number {
        return this._total
    }

    /**
     * Gets array of items.
     */
    public get items(): T[] {
        return this._items
    }

    constructor(items: T[] = [], total?: number) {
        this._items = [...items]
        this._total = (total == undefined) ? this._items.length : total
    }

    public concat(arr: T[]): PagedData<T> {
        return new PagedData(this.items.concat(arr), this.total)
    }

    public forEach(callbackFn: (value: T, index: number, array: T[]) => void, thisArg?: any): void {
        this.items.forEach(callbackFn)
    }

    public map<U>(callbackFn: (value: T, index: number, array: T[]) => U, thisArg?: any): PagedData<U> {
        return new PagedData(this.items.map(callbackFn), this.total)
    }

    /**
     * Returns a serializable object.
     */
    public toJSON(): { total: number, items: T[] } {
        return {
            total: this.total,
            items: [...this.items],
        }
    }

    // TODO: Should implement iterable interface
}
