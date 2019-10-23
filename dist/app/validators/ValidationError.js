"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Exceptions_1 = require("../models/Exceptions");
/**
 * Represents an error when a model does not pass validation.
 */
class ValidationError extends Exceptions_1.MinorException {
    constructor(details) {
        super();
        this.name = 'ValidationError';
        Error.captureStackTrace(this, ValidationError);
        if (typeof details === 'string') {
            this.details = [{
                    message: details,
                }];
        }
        else if (Array.isArray(details)) {
            this.details = details;
        }
        else {
            this.details = [details];
        }
    }
    /**
     * Constructs an instance of MicroFleet's `ValidationError` from
     * an instance of Joi's `ValidationError`.
     */
    static fromJoi(joiError) {
        return ValidationError.fromJoiDetails(joiError.details);
    }
    /**
     * Constructs an instance of MicroFleet's `ValidationError` from
     * "details" property of Joi's `ValidationError`.
     */
    static fromJoiDetails(joiDetails) {
        let details;
        /* istanbul ignore next */
        if (joiDetails && joiDetails.length) {
            details = joiDetails.map(d => ({
                message: d.message,
                path: d.path || [],
                value: (d.context ? d.context.value : d['value']),
            }));
        }
        return new ValidationError(details || []);
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=ValidationError.js.map