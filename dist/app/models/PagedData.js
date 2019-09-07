"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An object that contains paged array of items.
 */
class PagedData {
    constructor(items = [], total) {
        this._total = 0;
        this._items = [...items];
        this._total = (total == undefined) ? this._items.length : total;
    }
    /**
     * Gets number of contained items
     */
    get length() {
        return this._items.length;
    }
    /**
     * Gets total number of items.
     */
    get total() {
        return this._total;
    }
    /**
     * Gets array of items.
     */
    get items() {
        return this._items;
    }
    concat(arr) {
        return new PagedData(this.items.concat(arr), this.total);
    }
    forEach(callbackFn, thisArg) {
        this.items.forEach(callbackFn);
    }
    map(callbackFn, thisArg) {
        return new PagedData(this.items.map(callbackFn), this.total);
    }
    /**
     * Returns a serializable object.
     */
    toJSON() {
        return {
            total: this.total,
            items: [...this.items],
        };
    }
}
exports.PagedData = PagedData;
//# sourceMappingURL=PagedData.js.map