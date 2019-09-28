import * as joi from '@hapi/joi'

import { MinorException } from '../models/Exceptions'


/**
 * Represents a validation error for a property.
 * UI Form should use this information to highlight the particular input.
 */
export type ValidationErrorItem = {
    /**
     * Error message for this item.
     */
    message: string;

    /**
     * Path to the target property in validation schema.
     */
    path?: string[];

    /**
     * The invalid property value.
     */
    value?: any;
}

/**
 * Represents an error when a model does not pass validation.
 */
export class ValidationError extends MinorException {

    /**
     * Constructs an instance of MicroFleet's `ValidationError` from
     * an instance of Joi's `ValidationError`.
     */
    public static fromJoi(joiError: joi.ValidationError): ValidationError {
        return ValidationError.fromJoiDetails(joiError.details)
    }

    /**
     * Constructs an instance of MicroFleet's `ValidationError` from
     * "details" property of Joi's `ValidationError`.
     */
    public static fromJoiDetails(joiDetails: joi.ValidationErrorItem[]): ValidationError {
        let details: ValidationErrorItem[]
        /* istanbul ignore next */
        if (joiDetails && joiDetails.length) {
            details = joiDetails.map(d => <ValidationErrorItem>({
                message: d.message,
                path: d.path || [],
                value: (d.context ? d.context.value : d['value']),
            }))
        }
        return new ValidationError(details || [])
    }


    public readonly details: ValidationErrorItem[]


    /**
     * @param {string} message The message to be wrapped in a `ValidationErrorItem`.
     */
    constructor(message: string)
    // tslint:disable-next-line: unified-signatures
    constructor(detail: ValidationErrorItem)
    // tslint:disable-next-line: unified-signatures
    constructor(details: ValidationErrorItem[])
    constructor(details: string | ValidationErrorItem | ValidationErrorItem[]) {
        super()
        this.name = 'ValidationError'
        Error.captureStackTrace(this, ValidationError)
        if (typeof details === 'string') {
            this.details = [{
                message: details,
            }]
        }
        else if (Array.isArray(details)) {
            this.details = details
        }
        else {
            this.details = [details]
        }
    }
}
