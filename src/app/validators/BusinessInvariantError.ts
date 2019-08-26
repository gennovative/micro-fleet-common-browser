import { ValidationError, ValidationErrorItem } from './ValidationError'


/**
 * Represents a business rule violation.
 */
export class BusinessInvariantError extends ValidationError {
    constructor(details: ValidationErrorItem[]) {
        super(details)
        this.name = 'BusinessInvariantError'
        Error.captureStackTrace(this, BusinessInvariantError)
    }
}
