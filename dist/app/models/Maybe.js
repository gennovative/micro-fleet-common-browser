"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Exceptions_1 = require("./Exceptions");
let _nothing;
/**
 * Represents an error when attempting to get value from a Maybe.Nothing
 */
class EmptyMaybeException extends Exceptions_1.Exception {
    constructor() {
        super('This Maybe has Nothing', false, EmptyMaybeException);
    }
}
exports.EmptyMaybeException = EmptyMaybeException;
/**
 * Represents an object which may or may not have a value.
 * Use this class to avoid assigning `null` to a variable.
 * Source code inspired by: https://github.com/ramda/ramda-fantasy/blob/master/src/Maybe.js
 * and V8 Maybe: https://v8docs.nodesource.com/node-9.3/d9/d4b/classv8_1_1_maybe.html
 */
class Maybe {
    constructor() {
        /**
         * Alias of Maybe.Just
         */
        this.of = Maybe.Just;
    }
    static Nothing() {
        return _nothing;
    }
    static Just(value) {
        return new Just(value);
    }
    static isJust(target) {
        return (target instanceof Just);
    }
    static isNothing(target) {
        return (target === _nothing);
    }
    static isMaybe(target) {
        return this.isJust(target) || this.isNothing(target);
    }
}
exports.Maybe = Maybe;
/**
 * Alias of Maybe.Just
 */
Maybe.of = Maybe.Just;
class Just extends Maybe {
    constructor(_value) {
        super();
        this._value = _value;
        /**
         * @override
         */
        this.mapElse = returnThis;
        /**
         * @override
         */
        this.chainElse = returnThis;
        Object.freeze(this);
    }
    /**
     * @override
     */
    get isJust() {
        return true;
    }
    /**
     * @override
     */
    get isNothing() {
        return false;
    }
    /**
     * @override
     */
    get value() {
        return this._value;
    }
    /**
     * @override
     */
    map(f) {
        return this.of(f(this._value));
    }
    /**
     * @override
     */
    ap(m) {
        return m.map(this._value);
    }
    /**
     * @override
     */
    chain(f) {
        return f(this._value);
    }
    /**
     * @override
     */
    tryGetValue(defaultVal) {
        return this._value;
    }
    /**
     * @override
     */
    toString() {
        return `Maybe.Just(${this._value})`;
    }
}
function returnThis() {
    return this;
}
class Nothing extends Maybe {
    constructor() {
        super();
        /**
         * @override
         */
        this.map = returnThis;
        /**
         * @override
         */
        this.ap = returnThis;
        /**
         * @override
         */
        this.chain = returnThis;
        Object.freeze(this);
    }
    /**
     * @override
     */
    get isJust() {
        return false;
    }
    /**
     * @override
     */
    get isNothing() {
        return true;
    }
    /**
     * @override
     */
    get value() {
        throw new EmptyMaybeException();
    }
    /**
     * @override
     */
    mapElse(f) {
        f();
        return this;
    }
    chainElse(f) {
        return f();
    }
    /**
     * @override
     */
    tryGetValue(defaultVal) {
        return defaultVal;
    }
    /**
     * @override
     */
    toString() {
        return `Maybe.Nothing()`;
    }
}
_nothing = new Nothing;
//# sourceMappingURL=Maybe.js.map