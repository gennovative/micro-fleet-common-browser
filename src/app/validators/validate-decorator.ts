import * as joi from '@hapi/joi'

import { Translatable } from '../models/Translatable'
import { Guard } from '../Guard'
import { JoiModelValidatorConstructorOptions } from './JoiModelValidator'
import * as v from './validate-internal'
import { extJoi } from './JoiExtended'


export type ArrayDecoratorOptions = {
    /**
     * Whether or not to allow specifying a value and
     * convert it into array with single item.
     * Default is true.
     */
    allowSingle?: boolean,

    /**
     * Validation rules for array items.
     * Read Joi's docs for more details and examples: https://hapi.dev/family/joi/?v=15.1.1#arrayitemstype
     */
    items: joi.SchemaLike | joi.SchemaLike[],

    /**
     * Minimum allowed number of items.
     */
    minLength?: number,

    /**
     * Maximum allowed number of items.
     */
    maxLength?: number,

}

/**
 * Used to decorate model class' properties to assert it must be a boolean.
 *
 * ```typescript
 *
 * import * as joi from '@hapi/joi'
 *
 * const ALLOWED = [ 'id', 'name', 'age' ]
 *
 * class ModelA {
 *   @array({
 *     items: joi.string().only(ALLOWED).required()
 *   })
 *   fields: string[]
 * }
 *
 *
 * class ModelB {
 *   @array({
 *     items: [ joi.string(), joi.number() ]
 *   })
 *   fields: string[]
 * }
 * ```
 */
export function array(opts: ArrayDecoratorOptions): PropertyDecorator {
    return function (proto: any, propName: string | symbol): void {
        Guard.assertIsTruthy(propName, 'This decorator is for properties inside class')
        const propMeta: v.PropValidationMetadata = v.getPropValidationMetadata(proto.constructor, propName)
        propMeta.type = () => {
            const itemRules = Array.isArray(opts.items) ? opts.items : [opts.items]
            return joi.array().items(itemRules)
        }
        (opts.minLength != null) && propMeta.rules.push(prev => (prev as joi.ArraySchema).min(opts.minLength));
        (opts.maxLength != null) && propMeta.rules.push(prev => (prev as joi.ArraySchema).max(opts.maxLength))
        const allowSingle = (opts.allowSingle == null) ? true : opts.allowSingle
        allowSingle && propMeta.rules.push(prev => (prev as joi.ArraySchema).single().options({ convert: true }))
        v.setPropValidationMetadata(proto.constructor, propName, propMeta)
    }
}


export type BooleanDecoratorOptions = {
    /**
     * Whether or not to convert value to boolean type.
     * Default is true.
     */
    convert?: boolean,
}

/**
 * Used to decorate model class' properties to assert it must be a boolean.
 */
export function boolean(opts: BooleanDecoratorOptions = {}): PropertyDecorator {
    return function (proto: any, propName: string | symbol): void {
        Guard.assertIsTruthy(propName, 'This decorator is for properties inside class')
        const propMeta: v.PropValidationMetadata = v.getPropValidationMetadata(proto.constructor, propName)
        propMeta.type = () => joi.boolean().options(opts)
        v.setPropValidationMetadata(proto.constructor, propName, propMeta)
    }
}


export type BigIntDecoratorOptions = {
    /**
     * Whether or not to convert value to bigint type.
     * Default is FALSE, which means the value is kept as a string.
     */
    convert?: boolean,
}

/**
 * Used to decorate model class' properties to assert it must be a Big Int.
 */
export function bigInt({ convert }: BigIntDecoratorOptions = { convert: false }): PropertyDecorator {
    return function (proto: any, propName: string | symbol): void {
        Guard.assertIsTruthy(propName, 'This decorator is for properties inside class')
        const propMeta: v.PropValidationMetadata = v.getPropValidationMetadata(proto.constructor, propName)
        propMeta.type = () => extJoi.genn().bigint().options({ convert })
        v.setPropValidationMetadata(proto.constructor, propName, propMeta)
    }
}


export type NumberDecoratorOptions = {
    /**
     * Minimum allowed number.
     */
    min?: number,

    /**
     * Maximum allowed number.
     */
    max?: number,

    /**
     * Whether or not to convert value to number type.
     * Default is true.
     */
    convert?: boolean,
}

/**
 * Used to decorate model class' properties to assert it must be a number.
 */
export function number({ min, max, ...opts }: NumberDecoratorOptions = {}): PropertyDecorator {
    return function (proto: any, propName: string | symbol): void {
        Guard.assertIsTruthy(propName, 'This decorator is for properties inside class')
        const propMeta: v.PropValidationMetadata = v.getPropValidationMetadata(proto.constructor, propName)
        propMeta.type = () => joi.number().options(opts);
        (min != null) && propMeta.rules.push(prev => (prev as joi.NumberSchema).min(min));
        (max != null) && propMeta.rules.push(prev => (prev as joi.NumberSchema).max(max))
        v.setPropValidationMetadata(proto.constructor, propName, propMeta)
    }
}


export type DateTimeDecoratorOptions = {
    /**
     * Whether the input string is in UTC format.
     * Default: false.
     */
    isUTC?: boolean,

    /**
     * Function to convert input string to desired data type.
     * Default to convert to native Date object.
     */
    translator?: any,

    /**
     * Whether or not to use `translator` to convert or keep as string.
     * Default is false, which keeps as string.
     */
    convert?: boolean,
}

/**
 * Used to decorate model class' properties to assert it must be a number.
 *
 * ```typescript
 * class ModelA {
 *    @datetime()
 *    birthdate: string
 * }
 *
 *
 * class ModelB {
 *    @datetime({ convert: true })
 *    birthdate: Date
 * }
 *
 *
 * import * as moment from 'moment'
 *
 * class ModelC {
 *    @datetime({ isUTC: true, translator: moment, convert: true })
 *    birthdate: moment.Moment
 * }
 * ```
 */
export function datetime({isUTC, translator, ...opts}: DateTimeDecoratorOptions = { convert: false}): PropertyDecorator {
    return function (proto: any, propName: string | symbol): void {
        Guard.assertIsTruthy(propName, 'This decorator is for properties inside class')
        const propMeta: v.PropValidationMetadata = v.getPropValidationMetadata(proto.constructor, propName)
        propMeta.type = () => extJoi.genn()
            .dateString({ isUTC, translator })
            .options(opts)
        v.setPropValidationMetadata(proto.constructor, propName, propMeta)
    }
}


/**
 * Used to decorate model class' properties to specify default value.
 * @param {any} value The default value.
 */
export function defaultAs(value: any): PropertyDecorator {
    return function (proto: any, propName: string | symbol): void {
        Guard.assertIsTruthy(propName, 'This decorator is for properties inside class')
        const propMeta: v.PropValidationMetadata = v.getPropValidationMetadata(proto.constructor, propName)
        propMeta.rules.push(prev => prev.default(value))
        v.setPropValidationMetadata(proto.constructor, propName, propMeta)
    }
}


/**
 * Used to decorate model class' properties to assert it must be one of the specified.
 *
 * ```typescript
 *
 * import * as joi from '@hapi/joi'
 *
 * enum AccountStatus { ACTIVE = 'active', LOCKED = 'locked' }
 *
 * class Model {
 *   @only(AccountStatus.ACTIVE, AccountStatus.LOCKED)
 *   status: AccountStatus
 * }
 * ```
 */
export function only(...values: any[]): PropertyDecorator {
    return function (proto: any, propName: string | symbol): void {
        Guard.assertIsTruthy(propName, 'This decorator is for properties inside class')
        const propMeta: v.PropValidationMetadata = v.getPropValidationMetadata(proto.constructor, propName)
        // Passing array might be a mistake causing array in array [[value]]
        // We should correct it back to spreaded list of params
        if (values.length == 1 && Array.isArray(values[0])) {
            values = [...values[0]]
        }
        propMeta.rules.push(prev => prev.only(values))
        v.setPropValidationMetadata(proto.constructor, propName, propMeta)
    }
}


/**
 * Used to decorate model class' properties to assert it must exist and have non-undefined value.
 * @param {boolean} allowNull Whether or not to allow null value. Default is false.
 */
export function required(allowNull: boolean = false): PropertyDecorator {
    return function (proto: any, propName: string | symbol): void {
        Guard.assertIsTruthy(propName, 'This decorator is for properties inside class')
        const propMeta: v.PropValidationMetadata = v.getPropValidationMetadata(proto.constructor, propName)
        propMeta.rules.push(prev => prev.required())
        allowNull && propMeta.rules.push(prev => prev.allow(null))
        v.setPropValidationMetadata(proto.constructor, propName, propMeta)
    }
}


/**
 * Used to decorate model class' properties to assert it must exist and have non-undefined value.
 */
export function id(): PropertyDecorator {
    return function (proto: any, propName: string | symbol): void {
        Guard.assertIsTruthy(propName, 'This decorator is for properties inside class')

        const classMeta = v.getClassValidationMetadata(proto.constructor)
        classMeta.idProps.add(propName)
        v.setClassValidationMetadata(proto.constructor, classMeta)
    }
}


export type StringDecoratorOptions = {
    /**
     * Whether or not to allow empty string (''). Default is true.
     */
    allowEmpty?: boolean

    /**
     * Requires the string value to be a valid email address.
     * Default is false.
     */
    email?: boolean

    /**
     * Minimum allowed string length.
     */
    minLength?: number,

    /**
     * Maximum allowed string length.
     */
    maxLength?: number,

    /**
     * Regular expression pattern to match.
     */
    pattern?: RegExp,

    /**
     * Requires the string value to contain no whitespace before or after.
     * If the validation convert option is on (enabled by default), the string will be trimmed.
     *
     * Default value is false
     */
    trim?: boolean,

    /**
     * Requires the string value to be a valid RFC 3986 URI.
     *
     * Value can be `true`, or optionally one or more acceptable Schemes, should only include the scheme name.
     * Can be an Array or String (strings are automatically escaped for use in a Regular Expression).
     *
     * Default is false.
     */
    uri?: boolean | string | RegExp | Array<string | RegExp>,
}

/**
 * Used to decorate model class' properties to assert it must be a string.
 *
* ```typescript
 * class ModelA {
 *    @string()
 *    name: string
 * }
 *
 *
 * class ModelB {
 *    @string({ minLength: 1, maxLength: 255 })
 *    name: string
 * }
 *
 *
 * class ModelC {
 *    @string({ uri: true })
 *    url: string
 * }
 *
 *
 * class ModelD {
 *    @string({ uri: ['http', 'https', 'ftp'] })
 *    url: string
 * }
 * ```
 */
export function string(opts: StringDecoratorOptions = { allowEmpty: true }): PropertyDecorator {
    return function (proto: any, propName: string | symbol): void {
        Guard.assertIsTruthy(propName, 'This decorator is for properties inside class')
        const propMeta: v.PropValidationMetadata = v.getPropValidationMetadata(proto.constructor, propName)
        propMeta.type = () => {
            const schema = joi.string()
            return opts.allowEmpty
                ? schema.allow('')
                : schema.disallow('')
        }
        Boolean(opts.email) && propMeta.rules.push(prev => (prev as joi.StringSchema).email());
        (opts.minLength != null) && propMeta.rules.push(prev => (prev as joi.StringSchema).min(opts.minLength));
        (opts.maxLength != null) && propMeta.rules.push(prev => (prev as joi.StringSchema).max(opts.maxLength));
        (opts.pattern != null) && propMeta.rules.push(prev => (prev as joi.StringSchema).regex(opts.pattern))
        Boolean(opts.trim) && propMeta.rules.push(prev => (prev as joi.StringSchema).trim())
        Boolean(opts.uri) && propMeta.rules.push(prev => {
            if (typeof opts.uri !== 'boolean') { // string or RegExp
                return (prev as joi.StringSchema).uri({ scheme: opts.uri as any })
            }
            return (prev as joi.StringSchema).uri()
        })
        v.setPropValidationMetadata(proto.constructor, propName, propMeta)
    }
}

/**
 * Used to decorate model class to equip same functionalities as extending class `Translatable`.
 */
export function translatable(): ClassDecorator {
    return function (TargetClass: Function): void {
        copyStatic(Translatable, TargetClass,
            ['getTranslator', '$createTranslator', 'getValidator', '$createValidator', 'from', 'fromMany'])
    }
}

function copyStatic(SrcClass: any, DestClass: any, props: string[] = []): void {
    props.forEach(p => {
        if (!DestClass[p]) {
            DestClass[p] = SrcClass[p].bind(DestClass)
        }
    })
}


/**
 * Used to decorate model class to declare validation rules.
 *
 * If `validatorOptions.schemaMapModel` is specified, it overrides all properties' decorators
 * such as @validateProp(), @number(), @defaultAs()...
 *
 * If `validatorOptions.schemaMapId` is specified, it overrides the @id() decorator.
 *
 * @param {JoiModelValidatorConstructorOptions} validatorOptions The options for creating `JoiModelValidator` instance.
 */
export function validateClass(validatorOptions: JoiModelValidatorConstructorOptions): ClassDecorator {
    return function (TargetClass: Function): void {
        Guard.assertArgDefined('validatorOptions', validatorOptions)

        const classMeta = Object.assign(
            v.getClassValidationMetadata(TargetClass),
            validatorOptions
        )
        v.setClassValidationMetadata(TargetClass, classMeta)
    }
}

/**
 * Used to decorate model class' properties to declare complex validation rules.
 * Note that this decorator overrides other ones such as @defaultAs(), @number(), @only()...
 *
 * @param {joi.SchemaLike} schema A single schema rule for this property.
 *
 * ```typescript
 * class ModelA {
 *   @validateProp(joi.number().positive().precision(2).max(99))
 *   age: number
 * }
 * ```
 * Not complex enough? Hold my beer!
 *
 * ```typescript
 * class ModelB {
 *   @boolean()
 *   hasChildren: boolean
 *
 *   @validateProp(
 *     joi.number().positive()
 *       .when('hasChildren', {
 *         is: true,
 *         then: joi.required(),
 *         otherwise: joi.forbidden(),
 *       })
 *   )
 *   childrenIDs: number[]
 * }
 * ```
 */
export function validateProp(schema: joi.SchemaLike): PropertyDecorator {
    return function (proto: object, propName: string | symbol): void {
        Guard.assertIsTruthy(propName, 'This decorator is for properties inside class')
        Guard.assertArgDefined('schema', schema)
        const propMeta: v.PropValidationMetadata = v.getPropValidationMetadata(proto.constructor, propName)
        propMeta.rawSchema = schema
        v.setPropValidationMetadata(proto.constructor, propName, propMeta)
    }
}
