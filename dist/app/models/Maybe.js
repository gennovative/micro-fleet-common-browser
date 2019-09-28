"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Exceptions_1 = require("./Exceptions");
/**
 * Represents an error when attempting to get value from a Maybe.Nothing
 */
class EmptyMaybeException extends Exceptions_1.Exception {
    constructor(name) {
        super(`This ${name} Maybe has Nothing`, null, false, EmptyMaybeException);
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
    constructor($name) {
        this.$name = $name;
        /**
         * Alias of Maybe.Just
         */
        this.of = Maybe.Just;
    }
    /**
     * Creates an empty Maybe which throws `EmptyMaybeException` if attempting to get value.
     * @param {string} name The debugging-friendly name to included in error message or `toString()` result.
     */
    static Nothing(name = 'Nothing') {
        return new Nothing(name);
    }
    /**
     * Creates a Maybe wrapping a value.
     * @param {T} value The value to be wrapped, it may be anything even `null` or `undefined`.
     * @param {string} name The debugging-friendly name to included in error message or `toString()` result.
     */
    static Just(value, name = 'Just') {
        return new Just(value, name);
    }
    static isJust(target) {
        return (target instanceof Just);
    }
    static isNothing(target) {
        return (target instanceof Nothing);
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
    constructor(_value, name) {
        super(name);
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
        return `Maybe.Just(${this._value}, ${this.$name})`;
    }
}
function returnThis() {
    return this;
}
class Nothing extends Maybe {
    constructor(name) {
        super(name);
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
        throw new EmptyMaybeException(this.$name);
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
        return `Maybe.Nothing(${this.$name})`;
    }
}
//# sourceMappingURL=Maybe.js.map