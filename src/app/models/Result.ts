import { Exception } from './Exceptions'

export type Newable<T = any> = (new (...args: any[]) => T)

function returnThis(this: any) {
    return this
}

/**
 * Represents an error when attempting to get value from a Result.Failure
 */
export class NoValueFromFailureResultException extends Exception {
    constructor() {
        super('Failure Result has no value', false, NoValueFromFailureResultException)
    }
}

/**
 * Represents an error when attempting to get error from a Result.Ok
 */
export class NoErrorFromOkResultException extends Exception {
    constructor() {
        super('Ok Result has no error', false, NoErrorFromOkResultException)
    }
}

/**
 * Represents an object which can be Ok or Failure.
 * Use this class to avoid throwing Exception.
 * Source code inspired by: https://github.com/ramda/ramda-fantasy/blob/master/src/Either.js
 */
export abstract class Result<TOk = any, TFail = any> {

    public static Failure<TO, TF>(reason: TF): Result<TO, TF> {
        return new Failure<TF>(reason)
    }

    public static Ok<TO>(value: TO): Result<TO> {
        return new Ok<TO>(value)
    }

    public static isOk(target: any): target is Ok<any> {
        return (target instanceof Ok)
    }

    public static isFailure(target: any): target is Failure {
        return (target instanceof Failure)
    }

    public static isResult(target: any): target is Result {
        return this.isOk(target) || this.isFailure(target)
    }

    /**
     * Alias of Result.Ok
     */
    public static of = Result.Ok

    public abstract get isOk(): boolean

    public abstract get isFailure(): boolean

    /**
     * Gets the success value if Ok, or throws an `NoValueFromFailureResultException` if Failure.
     * If you want to avoid exception, use `tryGetValue()` instead.
     */
    public abstract get value(): TOk

    /**
     * Gets the error if Failure, or throws an `NoErrorFromOkResultException` if Ok.
     */
    public abstract get error(): TFail


    /**
     * Alias of Result.Ok
     */
    public of = Result.Ok

    /**
     * Applies the funtion `f` to internal value if Ok,
     * or does nothing if Failure.
     */
    public abstract map<TMap>(f: (val: TOk) => TMap): Result<TMap>

    /**
     * Takes another Result that wraps a function and applies its `map`
     * method to this Result's value, which must be a function.
     */
    public abstract ap(m: Result): Result

    /**
     * `f` must be a function which returns a value of the same Chain
     *  chain must return a value of the same Chain
     */
    public abstract chain<TChain>(f: (val: TOk) => Result<TChain>): Result<TChain>

    /**
     * Same as `map`, but only executes the callback function if Failure,
     * or does nothing if Ok.
     */
    public abstract mapElse(f: (reason: TFail) => void): Result<TOk>

    /**
     * Same as `chain`, but only executes the callback function if Failure,
     * or does nothing if Ok.
     */
    public abstract chainElse<TChain>(f: (reason: TFail) => Result<TChain>): Result<TChain>

    /**
     * Attempts to get the success value, if this is Failure, returns the given default value.
     * @param defaultVal Value to return in case there is no contained value.
     */
    public abstract tryGetValue(defaultVal: any): TOk

    /**
     * Throws the error if Failure, or does nothing if Ok.
     * @param ExceptionClass The class to wrap error
     */
    public abstract throwError(ExceptionClass?: Newable): void
}

class Ok<T> extends Result<T, any> {

    /**
     * @override
     */
    public get isOk(): boolean {
        return true
    }

    /**
     * @override
     */
    public get isFailure(): boolean {
        return false
    }

    /**
     * @override
     */
    public get error(): any {
        throw new NoErrorFromOkResultException()
    }

    /**
     * @override
     */
    public get value(): T {
        return this._value
    }


    constructor(private _value: T) {
        super()
        Object.freeze(this)
    }

    /**
     * @override
     */
    public map<TMap>(f: (val: T) => TMap): Result<TMap> {
        return this.of(f(this._value))
    }

    /**
     * @override
     */
    public mapElse = returnThis

    /**
     * @override
     */
    public chainElse = returnThis

    /**
     * @override
     */
    public ap(m: Result): Result {
        return m.map(<any>this._value)
    }

    /**
     * @override
     */
    public chain<TChain>(f: (val: T) => Result<TChain>): Result<TChain> {
        return f(this._value)
    }

    /**
     * @override
     */
    public tryGetValue(defaultVal: any): T {
        return this._value
    }

    /**
     * @override
     */
    public throwError(ExceptionClass?: Newable): void {
        return
    }

    /**
     * @override
     */
    public toString() {
        return `Result.Ok: ${this._value}`
    }
}

class Failure<T = any> extends Result<any, T> {

    /**
     * @override
     */
    public get isOk(): boolean {
        return false
    }

    /**
     * @override
     */
    public get isFailure(): boolean {
        return true
    }

    /**
     * @override
     */
    public get error(): T {
        return this._reason
    }

    /**
     * @override
     */
    public get value(): any {
        throw new NoValueFromFailureResultException()
    }


    constructor(private _reason: T) {
        super()
        Object.freeze(this)
    }


    /**
     * @override
     */
    public map = returnThis

    /**
     * @override
     */
    public mapElse(f: (reason: T) => void): Result {
        return this.of(f(this._reason))
    }

    public chainElse<TChain>(f: (reason: T) => Result<TChain>): Result<TChain> {
        return f(this._reason)
    }

    /**
     * @override
     */
    public ap = returnThis

    /**
     * @override
     */
    public chain = returnThis

    /**
     * @override
     */
    public tryGetValue(defaultVal: any): any {
        return defaultVal
    }

    /**
     * @override
     */
    public throwError(ExceptionClass?: Newable): void {
        if (ExceptionClass) {
            throw new ExceptionClass(this._reason)
        }
        throw this._reason
    }

    /**
     * @override
     */
    public toString() {
        return `Result.Failure: ${this._reason}`
    }
}
