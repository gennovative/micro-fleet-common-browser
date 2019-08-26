"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ValidationError_1 = require("./ValidationError");
/**
 * Represents a business rule violation.
 */
class BusinessInvariantError extends ValidationError_1.ValidationError {
    constructor(details) {
        super(details);
        this.name = 'BusinessInvariantError';
        Error.captureStackTrace(this, BusinessInvariantError);
    }
}
exports.BusinessInvariantError = BusinessInvariantError;
//# sourceMappingURL=BusinessInvariantError.js.map