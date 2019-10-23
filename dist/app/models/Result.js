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
    constructor(name) {
        super(`${name} Result has no value`, null, false, NoValueFromFailureResultException);
    }
}
exports.NoValueFromFailureResultException = NoValueFromFailureResultException;
/**
 * Represents an error when attempting to get error from a Result.Ok
 */
class NoErrorFromOkResultException extends Exceptions_1.Exception {
    constructor(name) {
        super(`${name} Result has no error`, null, false, NoErrorFromOkResultException);
    }
}
exports.NoErrorFromOkResultException = NoErrorFromOkResultException;
/**
 * Represents an object which can be Ok or Failure.
 * Use this class to avoid throwing Exception.
 * Source code inspired by: https://github.com/ramda/ramda-fantasy/blob/master/src/Either.js
 */
class Result {
    constructor($name) {
        this.$name = $name;
        /**
         * Alias of Result.Ok
         */
        this.of = Result.Ok;
    }
    static Failure(reason, name = 'Failure') {
        return new Failure(reason, name);
    }
    static Ok(value, name = 'Ok') {
        return new Ok(value, name);
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
exports.Result = Result;
/**
 * Alias of Result.Ok
 */
Result.of = Result.Ok;
class Ok extends Result {
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
        throw new NoErrorFromOkResultException(this.$name);
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
    throwErrorIfAny(ExceptionClass, message) {
        return;
    }
    /**
     * @override
     */
    toString() {
        return `Result.Ok(${this._value}, ${this.$name})`;
    }
}
class Failure extends Result {
    constructor(_reason, name) {
        super(name);
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
        throw new NoValueFromFailureResultException(this.$name);
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
    throwErrorIfAny(ExceptionClass, message = 'An error is thrown from Failure Result') {
        if (ExceptionClass) {
            throw new ExceptionClass(`Thrown by Result.Failure${this.$name}: ${message}`, this._reason);
        }
        throw this._reason;
    }
    /**
     * @override
     */
    toString() {
        return `Result.Failure(${this._reason}, ${this.$name})`;
    }
}
//# sourceMappingURL=Result.js.map