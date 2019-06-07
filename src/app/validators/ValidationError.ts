import * as joi from 'joi'

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
    path: string[];

    /**
     * The invalid property value.
     */
    value: any;
}

/**
 * Represents an error when a model does not pass validation.
 */
export class ValidationError extends MinorException {

    public static fromJoi(joiDetails: joi.ValidationErrorItem[]): ValidationError {
        let details: ValidationErrorItem[]
        /* istanbul ignore next */
        if (joiDetails && joiDetails.length) {
            details = joiDetails.map(d => ({
                message: d.message,
                path: d.path,
                value: (d.context ? d.context.value : d['value']),
            }))
        }
        return new ValidationError(details || [])
    }

    constructor(
        public readonly details: ValidationErrorItem[],
    ) {
        super()
        this.name = 'ValidationError'
        Error.captureStackTrace(this, ValidationError)
    }
}
