import { ValidationError, ValidationErrorItem } from './ValidationError'


/**
 * Represents a business rule violation.
 */
export class BusinessInvariantError extends ValidationError {

    /**
     * @param {string} message The message to be wrapped in a `ValidationErrorItem`.
     */
    constructor(message: string)
    // tslint:disable-next-line: unified-signatures
    constructor(detail: ValidationErrorItem)
    // tslint:disable-next-line: unified-signatures
    constructor(details: ValidationErrorItem[])
    constructor(details: any) {
        super(details)
        this.name = 'BusinessInvariantError'
        Error.captureStackTrace(this, BusinessInvariantError)
    }
}
