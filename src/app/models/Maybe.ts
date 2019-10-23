import { Exception } from './Exceptions'


/**
 * Represents an error when attempting to get value from a Maybe.Nothing
 */
export class EmptyMaybeException extends Exception {
    constructor(name: string) {
        super(`This ${name} Maybe has Nothing`, null, false, EmptyMaybeException)
    }
}

/**
 * Represents an object which may or may not have a value.
 * Use this class to avoid assigning `null` to a variable.
 * Source code inspired by: https://github.com/ramda/ramda-fantasy/blob/master/src/Maybe.js
 * and V8 Maybe: https://v8docs.nodesource.com/node-9.3/d9/d4b/classv8_1_1_maybe.html
 */
export abstract class Maybe<T = any> {

    /**
     * Creates an empty Maybe which throws `EmptyMaybeException` if attempting to get value.
     * @param {string} name The debugging-friendly name to included in error message or `toString()` result.
     */
    public static Nothing(name: string = 'Nothing'): Maybe {
        return new Nothing(name)
    }

    /**
     * Creates a Maybe wrapping a value.
     * @param {T} value The value to be wrapped, it may be anything even `null` or `undefined`.
     * @param {string} name The debugging-friendly name to included in error message or `toString()` result.
     */
    public static Just<T>(value: T, name: string = 'Just'): Maybe<T> {
        return new Just<T>(value, name)
    }

    public static isJust(target: any): target is Just<any> {
        return (target instanceof Just)
    }

    public static isNothing(target: any): target is Nothing {
        return (target instanceof Nothing)
    }

    public static isMaybe(target: any): target is Maybe {
        return this.isJust(target) || this.isNothing(target)
    }


    /**
     * Alias of Maybe.Just
     */
    public static of = Maybe.Just

    public abstract get isJust(): boolean

    public abstract get isNothing(): boolean

    /**
     * Gets the contained value if Just, or throws an `EmptyMaybeException` if Nothing.
     * If you want to avoid exception, use `tryGetValue()` instead.
     */
    public abstract get value(): T


    /**
     * Alias of Maybe.Just
     */
    public of = Maybe.Just

    /**
     * Applies the funtion `f` to internal value if Just,
     * or does nothing if Nothing.
     */
    public abstract map<TMap>(f: (val: T) => TMap): Maybe<TMap>

    /**
     * Takes another Maybe that wraps a function and applies its `map`
     * method to this Maybe's value, which must be a function.
     */
    public abstract ap(m: Maybe): Maybe

    /**
     * `f` must be a function which returns a value of the same Chain
     *  chain must return a value of the same Chain
     */
    public abstract chain<TChain>(f: (val: T) => Maybe<TChain>): Maybe<TChain>

    /**
     * Same as `map`, but only executes the callback function if Nothing,
     * or does nothing if Just.
     */
    public abstract mapElse(f: () => void): Maybe<T>

    /**
     * Same as `chain`, but only executes the callback function if Nothing,
     * or does nothing if Just.
     */
    public abstract chainElse<TChain>(f: () => Maybe<TChain>): Maybe<TChain>

    /**
     * Attempts to get the contained value, if there is not, returns the given default value.
     * @param defaultVal Value to return in case there is no contained value.
     */
    public abstract tryGetValue(defaultVal: any): T

    constructor(protected $name: string) {
    }
}

class Just<T> extends Maybe {

    /**
     * @override
     */
    public get isJust(): boolean {
        return true
    }

    /**
     * @override
     */
    public get isNothing(): boolean {
        return false
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
    public map<TMap>(f: (val: T) => TMap): Maybe<TMap> {
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
    public ap(m: Maybe): Maybe {
        return m.map(<any>this._value)
    }

    /**
     * @override
     */
    public chain<TChain>(f: (val: T) => Maybe<TChain>): Maybe<TChain> {
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
    public toString() {
        return `Maybe.Just(${this._value}, ${this.$name})`
    }
}

function returnThis(this: any) {
    return this
}

class Nothing extends Maybe {

    /**
     * @override
     */
    public get isJust(): boolean {
        return false
    }

    /**
     * @override
     */
    public get isNothing(): boolean {
        return true
    }

    /**
     * @override
     */
    public get value(): any {
        throw new EmptyMaybeException(this.$name)
    }


    constructor(name: string) {
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
    public mapElse(f: () => void): Maybe {
        f()
        return this
    }

    public chainElse<TChain>(f: () => Maybe<TChain>): Maybe<TChain> {
        return f()
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
    public toString() {
        return `Maybe.Nothing(${this.$name})`
    }
}
