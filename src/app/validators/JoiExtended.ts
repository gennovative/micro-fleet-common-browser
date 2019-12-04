import * as joi from '@hapi/joi'


const extBigint: joi.Extension = {
    type: 'bigint',
    messages: {
        'bigint.convert': '"{{#label}}": {{#value}} cannot be converted to BigInt',
        'bigint.native': '"{{#label}}" must be of BigInt type or a string that is convertible to BigInt',
    },

    /**
     * Only called when prefs.convert is true
     */
    coerce(value, helpers): joi.CoerceResult {
        if (helpers.schema.$_getFlag('asString')) {
            return {
                value: String(value),
            }
        }
        else if (helpers.schema.$_getFlag('asNative')) {
            try {
                return {
                    value: BigInt(value),
                }
            }
            catch {
                return {
                    errors: [
                        helpers.error('bigint.convert', { value }),
                    ],
                }
            }
        }
        return {
            value,
        }
    },

    validate(value, helpers) {
        let isBigInt = true
        try {
            // '987654321' => valid
            // 'ABC876' => invalid
            // Other non-bigint non-string values are all invalid
            isBigInt = (typeof value === 'string')
                ? (typeof BigInt(value) === 'bigint')
                : (typeof value === 'bigint')
        }
        catch {
            isBigInt = false
        }

        return isBigInt
            ? { value } // Everything is OK
            : { errors: [ helpers.error('bigint.native') ] }
    },
    rules: {
        asString: {
            method() {
                return this.$_setFlag('asString', true)
            },
        },
        asNative: {
            method() {
                return this.$_setFlag('asNative', true)
            },
        },
    },
}

const extDateString: joi.Extension = {
    type: 'dateString',
    messages: {
        'dateString.wrongFormat': '"{{#label}}" must be a date string compliant with W3C Date and Time Formats ({{#format}})',
        'dateString.invalidValue': '"{{#label}}" must have all components with valid values',
    },

    validate(value, helpers) {
        // Eg: 2019-05-15T02:06:02.034Z or 2019-05-15T02:06:02Z or 2019-05-15
        const UTC_DATE = /^\d{4}\-\d{2}\-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?Z)?$/
        // Eg: 2019-05-15T09:06:02.034+07:00 or 2019-05-15T09:06:02+07:00 or 2019-05-15
        const TIMEZONE_DATE = /^\d{4}\-\d{2}\-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?[\+\-]\d{2}:\d{2})?$/

        const { schema } = helpers
        const isUTC = schema.$_getFlag('isUTC')
        const regex = isUTC ? UTC_DATE : TIMEZONE_DATE
        const isMatch: boolean = typeof value === 'string'
            ? (value.match(regex) != null)
            : false
        let errors

        if (!isMatch) {
            errors = helpers.error(
                'dateString.wrongFormat',
                {
                    value,
                    format: isUTC ? 'YYYY-MM-DD or YYYY-MM-DDThh:mm:ss.sZ' : 'YYYY-MM-DD or YYYY-MM-DDThh:mm:ss.s+hh:mm or -hh:mm',
                },
            )
            return { errors }
        }
        else if (new Date(value).toString() === 'Invalid Date') {
            errors = helpers.error('dateString.invalidValue')
            return { errors }
        }

        return { value }
    },
    rules: {
        isUTC: {
            method() {
                return this.$_setFlag('isUTC', true)
            },
        },
        translate: {
            method(fn) {
                return this.$_addRule(<any>{
                    name: 'translate',
                    args: { translate: fn },
                })
            },
            validate(value, helpers: joi.CustomHelpers, args, options) {
                const translate = args.translate || toDate
                return translate(value)
            },
        },
    },
}


function toDate(dateString: string): Date {
    return new Date(dateString)
}


export type DateStringJoi = joi.AnySchema & {
    /**
     * Whether the input string is in UTC format.
     * Default: false.
     */
    isUTC(): DateStringJoi,

    /**
     * Function to convert input string to desired data type.
     * Default function returns native Date object.
     */
    translate(fn?: (val: string) => any): DateStringJoi,
}

export type ExtendedJoi = joi.AnySchema & {
    /**
     * Makes sure input is a native BigInt type or a string that is convertible to BigInt type.
     *
     * Options prefs.convert is ignored, use "asString" or "asNative" to do conversion.
     *
     * @example
     * extJoi.bigint().validate(98765443123456n);
     *
     * @example
     * extJoi.bigint().asString().validate('98765443123456');
     * extJoi.bigint().validate('98765443123456', {convert: false});
     *
     * @example
     * extJoi.bigint().asNative().validate('98765443123456');
     * extJoi.bigint().validate('98765443123456', {convert: true});
     */
    bigint(): joi.AnySchema & {
        /**
         * Converts input to string.
         */
        asString(): joi.AnySchema,
        /**
         * Converts input to native BigInt.
         */
        asNative(): joi.AnySchema,
    }

    /**
     * Makes sure input is in W3C Date and Time Formats,
     * but must have at least year, month, and day.
     *
     * @example extJoi.dateString().validate('2019-05-15T09:06:02+07:00');
     * @example extJoi.dateString.isUTC().validate('2019-05-15T09:06:02Z');
     * @example extJoi.dateString.isUtc().translate(moment).validate('2019-05-15T09:06:02-07:00');
     */
    dateString(): DateStringJoi;
}

/**
 * Joi instance with "genn()" extension enabled, including some custom rules.
 */
export const extJoi: ExtendedJoi = joi.extend(extBigint, extDateString)
