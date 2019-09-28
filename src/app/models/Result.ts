import { Exception, ExceptionConstructor } from './Exceptions'


function returnThis(this: any) {
    return this
}


/**
 * Represents an error when attempting to get value from a Result.Failure
 */
export class NoValueFromFailureResultException extends Exception {
    constructor(name: string) {
        super(`${name} Result has no value`, null, false, NoValueFromFailureResultException)
    }
}

/**
 * Represents an error when attempting to get error from a Result.Ok
 */
export class NoErrorFromOkResultException extends Exception {
    constructor(name: string) {
        super(`${name} Result has no error`, null, false, NoErrorFromOkResultException)
    }
}

/**
 * Represents an object which can be Ok or Failure.
 * Use this class to avoid throwing Exception.
 * Source code inspired by: https://github.com/ramda/ramda-fantasy/blob/master/src/Either.js
 */
export abstract class Result<TOk = any, TFail = any> {

    public static Failure<TO, TF>(reason: TF, name: string = 'Failure'): Result<TO, TF> {
        return new Failure<TF>(reason, name)
    }

    public static Ok<TO>(value: TO, name: string = 'Ok'): Result<TO> {
        return new Ok<TO>(value, name)
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
    public abstract throwErrorIfAny(ExceptionClass?: ExceptionConstructor, message?: string): void


    constructor(protected $name: string) {
    }
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
        throw new NoErrorFromOkResultException(this.$name)
    }

    /**
     * @override
     */
    public get value(): T {
        return this._value
    }


    constructor(private _value: T, name: string) {
        super(name)
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
    public throwErrorIfAny(ExceptionClass?: ExceptionConstructor, message?: string): void {
        return
    }

    /**
     * @override
     */
    public toString() {
        return `Result.Ok(${this._value}, ${this.$name})`
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
        throw new NoValueFromFailureResultException(this.$name)
    }


    constructor(private _reason: T, name: string) {
        super(name)
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
    public throwErrorIfAny(ExceptionClass?: ExceptionConstructor,
            message: string = 'An error is thrown from Failure Result'): void {
        if (ExceptionClass) {
            throw new ExceptionClass(`Thrown by Result.Failure${this.$name}: ${message}`, this._reason)
        }
        throw this._reason
    }

    /**
     * @override
     */
    public toString() {
        return `Result.Failure(${this._reason}, ${this.$name})`
    }
}
