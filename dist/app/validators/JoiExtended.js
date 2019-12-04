"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("@hapi/joi");
const extBigint = {
    type: 'bigint',
    messages: {
        'bigint.convert': '"{{#label}}": {{#value}} cannot be converted to BigInt',
        'bigint.native': '"{{#label}}" must be of BigInt type or a string that is convertible to BigInt',
    },
    /**
     * Only called when prefs.convert is true
     */
    coerce(value, helpers) {
        if (helpers.schema.$_getFlag('asString')) {
            return {
                value: String(value),
            };
        }
        else if (helpers.schema.$_getFlag('asNative')) {
            try {
                return {
                    value: BigInt(value),
                };
            }
            catch (_a) {
                return {
                    errors: [
                        helpers.error('bigint.convert', { value }),
                    ],
                };
            }
        }
        return {
            value,
        };
    },
    validate(value, helpers) {
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
            ? { value } // Everything is OK
            : { errors: [helpers.error('bigint.native')] };
    },
    rules: {
        asString: {
            method() {
                return this.$_setFlag('asString', true);
            },
        },
        asNative: {
            method() {
                return this.$_setFlag('asNative', true);
            },
        },
    },
};
const extDateString = {
    type: 'dateString',
    messages: {
        'dateString.wrongFormat': '"{{#label}}" must be a date string compliant with W3C Date and Time Formats ({{#format}})',
        'dateString.invalidValue': '"{{#label}}" must have all components with valid values',
    },
    validate(value, helpers) {
        // Eg: 2019-05-15T02:06:02.034Z or 2019-05-15T02:06:02Z or 2019-05-15
        const UTC_DATE = /^\d{4}\-\d{2}\-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?Z)?$/;
        // Eg: 2019-05-15T09:06:02.034+07:00 or 2019-05-15T09:06:02+07:00 or 2019-05-15
        const TIMEZONE_DATE = /^\d{4}\-\d{2}\-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?[\+\-]\d{2}:\d{2})?$/;
        const { schema } = helpers;
        const isUTC = schema.$_getFlag('isUTC');
        const regex = isUTC ? UTC_DATE : TIMEZONE_DATE;
        const isMatch = typeof value === 'string'
            ? (value.match(regex) != null)
            : false;
        let errors;
        if (!isMatch) {
            errors = helpers.error('dateString.wrongFormat', {
                value,
                format: isUTC ? 'YYYY-MM-DD or YYYY-MM-DDThh:mm:ss.sZ' : 'YYYY-MM-DD or YYYY-MM-DDThh:mm:ss.s+hh:mm or -hh:mm',
            });
            return { errors };
        }
        else if (new Date(value).toString() === 'Invalid Date') {
            errors = helpers.error('dateString.invalidValue');
            return { errors };
        }
        return { value };
    },
    rules: {
        isUTC: {
            method() {
                return this.$_setFlag('isUTC', true);
            },
        },
        translate: {
            method(fn) {
                return this.$_addRule({
                    name: 'translate',
                    args: { translate: fn },
                });
            },
            validate(value, helpers, args, options) {
                const translate = args.translate || toDate;
                return translate(value);
            },
        },
    },
};
function toDate(dateString) {
    return new Date(dateString);
}
/**
 * Joi instance with "genn()" extension enabled, including some custom rules.
 */
exports.extJoi = joi.extend(extBigint, extDateString);
//# sourceMappingURL=JoiExtended.js.map