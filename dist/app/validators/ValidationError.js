"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Exceptions_1 = require("../models/Exceptions");
/**
 * Represents an error when a model does not pass validation.
 */
class ValidationError extends Exceptions_1.MinorException {
    constructor(details) {
        super();
        this.details = details;
        this.name = 'ValidationError';
        Error.captureStackTrace(this, ValidationError);
    }
    static fromJoi(joiDetails) {
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