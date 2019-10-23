// tslint:disable-next-line:no-magic-numbers
Error.stackTraceLimit = 20

export class Exception implements Error {

    public name: string
    public stack: string


    /**
     *
     * @param message
     * @param isCritical
     * @param exceptionClass {class} The exception class to exclude from stacktrace.
     */
    constructor(
            public readonly message: string = '',
            public details?: object | string,
            public readonly isCritical: boolean = true,
            exceptionClass?: Function) {

        Error.captureStackTrace(this, exceptionClass || Exception)
    }

    public toString(): string {
        // Ex 1: [Critical] A big mess has happened!
        //         <stacktrace here>
        //
        // Ex 2: [Minor]
        //         <stacktrace here>
        return `[${ (this.isCritical ? 'Critical' : 'Minor') }] ${ this.message ? this.message : '' } \n ${this.stack}`
    }
}

/**
 * Represents a serious problem that may cause the system in unstable state
 * and need restarting.
 */
export class CriticalException extends Exception {

    constructor(message?: string, details?: object | string) {
        super(message, details, true, CriticalException)
        this.name = 'CriticalException'
    }
}

export type ExceptionConstructor<T extends Exception = MinorException> = new (message?: string, details?: any) => T

/**
 * Represents an acceptable problem that can be handled
 * and the system does not need restarting.
 */
export class MinorException extends Exception {

    constructor(message?: string, details?: object | string) {
        super(message, details, false, MinorException)
        this.name = 'MinorException'
    }
}

/**
 * Represents an error where the provided argument of a function or constructor
 * is not as expected.
 */
export class InvalidArgumentException extends Exception {

    constructor(argName: string, message?: string) {
        super(`The argument "${argName}" is invalid! ${(message ? message : '')}`, null, false, InvalidArgumentException)
        this.name = 'InvalidArgumentException'
    }
}

/**
 * Represents an error when an unimplemented method is called.
 */
export class NotImplementedException extends Exception {

    constructor(message?: string) {
        super(message, null, false, NotImplementedException)
        this.name = 'NotImplementedException'
    }
}

/**
 * Represents an error whose origin is from another system.
 */
export class InternalErrorException extends Exception {

    constructor(message?: string, details?: object | string) {
        super(message || 'An error occured on the 3rd-party side', details, false, InternalErrorException)
        this.name = 'InternalErrorException'
        this.details = details
    }
}
