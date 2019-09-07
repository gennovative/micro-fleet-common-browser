"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Exceptions_1 = require("./Exceptions");
function returnThis() {
    return this;
}
/**
 * Represents an error when attempting to get value from a Result.Failure
 */
class NoValueFromFailureResultException extends Exceptions_1.Exception {
    constructor() {
        super('Failure Result has no value', false, NoValueFromFailureResultException);
    }
}
exports.NoValueFromFailureResultException = NoValueFromFailureResultException;
/**
 * Represents an error when attempting to get error from a Result.Ok
 */
class NoErrorFromOkResultException extends Exceptions_1.Exception {
    constructor() {
        super('Ok Result has no error', false, NoErrorFromOkResultException);
    }
}
exports.NoErrorFromOkResultException = NoErrorFromOkResultException;
/**
 * Represents an object which can be Ok or Failure.
 * Use this class to avoid throwing Exception.
 * Source code inspired by: https://github.com/ramda/ramda-fantasy/blob/master/src/Either.js
 */
class Result {
    constructor() {
        /**
         * Alias of Result.Ok
         */
        this.of = Result.Ok;
    }
    static Failure(reason) {
        return new Failure(reason);
    }
    static Ok(value) {
        return new Ok(value);
    }
    static isOk(target) {
        return (target instanceof Ok);
    }
    static isFailure(target) {
        return (target instanceof Failure);
    }
    static isResult(target) {
        return this.isOk(target) || this.isFailure(target);
    }
}
/**
 * Alias of Result.Ok
 */
Result.of = Result.Ok;
exports.Result = Result;
class Ok extends Result {
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
    get isOk() {
        return true;
    }
    /**
     * @override
     */
    get isFailure() {
        return false;
    }
    /**
     * @override
     */
    get error() {
        throw new NoErrorFromOkResultException();
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
    throwError(ExceptionClass) {
        return;
    }
    /**
     * @override
     */
    toString() {
        return `Result.Ok: ${this._value}`;
    }
}
class Failure extends Result {
    constructor(_reason) {
        super();
        this._reason = _reason;
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
    get isOk() {
        return false;
    }
    /**
     * @override
     */
    get isFailure() {
        return true;
    }
    /**
     * @override
     */
    get error() {
        return this._reason;
    }
    /**
     * @override
     */
    get value() {
        throw new NoValueFromFailureResultException();
    }
    /**
     * @override
     */
    mapElse(f) {
        return this.of(f(this._reason));
    }
    chainElse(f) {
        return f(this._reason);
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
    throwError(ExceptionClass) {
        if (ExceptionClass) {
            throw new ExceptionClass(this._reason);
        }
        throw this._reason;
    }
    /**
     * @override
     */
    toString() {
        return `Result.Failure: ${this._reason}`;
    }
}
//# sourceMappingURL=Result.js.map