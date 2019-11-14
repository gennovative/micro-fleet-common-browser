"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("@hapi/joi");
/**
 * Rule to validate native bigint type.
 */
const bigintRule = {
    name: 'bigint',
    setup(params) {
        this['_flags'].bigint = true; // Set a flag for later use
    },
    validate(params, value, state, options) {
        let isBigInt = true;
        try {
            // '987654321' => valid
            // 'ABC876' => invalid
            // Other non-bigint non-string values are all invalid
            isBigInt = (typeof value === 'string')
                ? (typeof BigInt(value) === 'bigint')
                : (typeof value === 'bigint');
        }
        catch (_a) {
            isBigInt = false;
        }
        return isBigInt
            // Everything is OK
            ? value
            // Generate an error, state and options need to be passed
            : this.createError('genn.bigint', { v: value }, state, options);
    },
};
function toDate(dateString) {
    return new Date(dateString);
}
/**
 * Rule to validate W3C Date and Time format for web.
 */
const dateStringRule = {
    name: 'dateString',
    params: {
        options: joi.object({
            isUTC: joi.boolean().default(false),
            translator: joi.any(),
        }).optional(),
    },
    setup(params) {
        this['_flags'].dateString = true;
        params.options = params.options || { isUTC: false };
    },
    validate(params, value, state, validationOpts) {
        // Eg: 2019-05-15T02:06:02.000Z or 2019-05-15T02:06:02Z or 2019-05-15
        const UTC_DATE = /^\d{4}\-\d{2}\-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?Z)?$/;
        // Eg: 2019-05-15T09:06:02.000+07:00 or 2019-05-15T09:06:02+07:00 or 2019-05-15
        const TIMEZONE_DATE = /^\d{4}\-\d{2}\-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?[\+\-]\d{2}:\d{2})?$/;
        const ruleOpts = params.options;
        const regex = ruleOpts.isUTC ? UTC_DATE : TIMEZONE_DATE;
        const isMatch = typeof value === 'string'
            ? (value.match(regex) != null)
            : false;
        if (!isMatch) {
            return this.createError('genn.dateStringWrongFormat', {
                value,
                format: ruleOpts.isUTC ? 'YYYY-MM-DD or YYYY-MM-DDThh:mm:ss.sZ' : 'YYYY-MM-DD or YYYY-MM-DDThh:mm:ss.s+hh:mm or -hh:mm',
            }, state, validationOpts);
        }
        else if (new Date(value).toString() === 'Invalid Date') {
            return this.createError('genn.dateStringInvalidValue', {
                value,
            }, state, validationOpts);
        }
        // Everything is OK
        if (validationOpts.convert) {
            const translator = ruleOpts.translator || toDate;
            return translator(value);
        }
        return value;
    },
};
// Working flow:
// rule.setup => extension.pre => rule.validate => extension.coerce
const joiExtensions = {
    name: 'genn',
    language: {
        /**
         * Validate against native bigint type
         */
        bigint: 'needs to be a bigint',
        /**
         * Validate against W3C Date and Time Formats.
         * See: https://www.w3.org/TR/NOTE-datetime
         */
        dateStringWrongFormat: 'needs to be a date string compliant with W3C Date and Time Formats ({{format}})',
        dateStringInvalidValue: 'needs all components to have valid values',
    },
    pre(value, state, options) {
        // tslint:disable-next-line:no-invalid-this
        const flags = this['_flags'];
        if (flags.bigint === true) {
            try {
                return (options.convert ? BigInt(value) : value);
            }
            catch (_a) {
                return value;
            }
        }
        return value; // Keep the value as it was
    },
    // coerce(value: any, state: joi.State, options: joi.ValidationOptions) {
    //     const flags: GennFlag = this['_flags']
    //     if (flags.dateString === true) {
    //         return flags.dateStringTranslator(value)
    //     }
    //     return value // Keep the value as it was
    // },
    rules: [bigintRule, dateStringRule],
};
/**
 * Joi instance with "genn()" extension enabled, including some custom rules.
 */
exports.extJoi = joi.extend(joiExtensions);
//# sourceMappingURL=JoiExtended.js.map