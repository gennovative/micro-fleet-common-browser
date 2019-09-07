"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
const Guard_1 = require("../Guard");
const JoiExtended_1 = require("./JoiExtended");
const v = require("./validate-internal");
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
function validateClass(validatorOptions) {
    return function (TargetClass) {
        Guard_1.Guard.assertArgDefined('validatorOptions', validatorOptions);
        const classMeta = Object.assign(v.getClassValidationMetadata(TargetClass), validatorOptions);
        v.setClassValidationMetadata(TargetClass, classMeta);
    };
}
exports.validateClass = validateClass;
// export type ValidateClassDecorator = (validatorOptions: JoiModelValidatorConstructorOptions) => ClassDecorator
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
function validateProp(schema) {
    return function (proto, propName) {
        Guard_1.Guard.assertIsTruthy(propName, 'This decorator is for properties inside class');
        Guard_1.Guard.assertArgDefined('schema', schema);
        const propMeta = v.getPropValidationMetadata(proto.constructor, propName);
        propMeta.rawSchema = schema;
        v.setPropValidationMetadata(proto.constructor, propName, propMeta);
    };
}
exports.validateProp = validateProp;
/**
 * Used to decorate model class' properties to assert it must be a boolean.
 *
 * ```typescript
 *
 * import * as joi from 'joi'
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
function array(opts) {
    return function (proto, propName) {
        Guard_1.Guard.assertIsTruthy(propName, 'This decorator is for properties inside class');
        const propMeta = v.getPropValidationMetadata(proto.constructor, propName);
        propMeta.type = () => {
            const itemRules = Array.isArray(opts.items) ? opts.items : [opts.items];
            const schema = joi.array().items(itemRules);
            const allowSingle = (opts.allowSingle == null) ? true : opts.allowSingle;
            return allowSingle
                ? schema.single().options({ convert: true })
                : schema;
        };
        v.setPropValidationMetadata(proto.constructor, propName, propMeta);
    };
}
exports.array = array;
/**
 * Used to decorate model class' properties to assert it must be a boolean.
 */
function boolean(opts) {
    return function (proto, propName) {
        Guard_1.Guard.assertIsTruthy(propName, 'This decorator is for properties inside class');
        const propMeta = v.getPropValidationMetadata(proto.constructor, propName);
        propMeta.type = () => joi.boolean().options(opts);
        v.setPropValidationMetadata(proto.constructor, propName, propMeta);
    };
}
exports.boolean = boolean;
/**
 * Used to decorate model class' properties to assert it must be a Big Int.
 */
function bigInt({ convert } = { convert: false }) {
    return function (proto, propName) {
        Guard_1.Guard.assertIsTruthy(propName, 'This decorator is for properties inside class');
        const propMeta = v.getPropValidationMetadata(proto.constructor, propName);
        propMeta.type = () => JoiExtended_1.extJoi.genn().bigint().options({ convert });
        v.setPropValidationMetadata(proto.constructor, propName, propMeta);
    };
}
exports.bigInt = bigInt;
/**
 * Used to decorate model class' properties to assert it must be a number.
 */
function number(_a = {}) {
    var { min, max } = _a, opts = __rest(_a, ["min", "max"]);
    return function (proto, propName) {
        Guard_1.Guard.assertIsTruthy(propName, 'This decorator is for properties inside class');
        const propMeta = v.getPropValidationMetadata(proto.constructor, propName);
        propMeta.type = () => joi.number().options(opts);
        (min != null) && propMeta.rules.push(prev => prev.min(min));
        (max != null) && propMeta.rules.push(prev => prev.max(max));
        v.setPropValidationMetadata(proto.constructor, propName, propMeta);
    };
}
exports.number = number;
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
function datetime(opts = { convert: false }) {
    return function (proto, propName) {
        Guard_1.Guard.assertIsTruthy(propName, 'This decorator is for properties inside class');
        const propMeta = v.getPropValidationMetadata(proto.constructor, propName);
        propMeta.type = () => JoiExtended_1.extJoi.genn()
            .dateString({
            isUTC: opts.isUTC,
            translator: opts.translator,
        })
            .options(opts);
        v.setPropValidationMetadata(proto.constructor, propName, propMeta);
    };
}
exports.datetime = datetime;
// export type DateTimeDecorator = (opts?: DateTimeDecoratorOptions) => PropertyDecorator
/**
 * Used to decorate model class' properties to specify default value.
 * @param {any} value The default value.
 */
function defaultAs(value) {
    return function (proto, propName) {
        Guard_1.Guard.assertIsTruthy(propName, 'This decorator is for properties inside class');
        const propMeta = v.getPropValidationMetadata(proto.constructor, propName);
        propMeta.rules.push(prev => prev.default(value));
        v.setPropValidationMetadata(proto.constructor, propName, propMeta);
    };
}
exports.defaultAs = defaultAs;
// export type DefaultAsDecorator = (value: any) => PropertyDecorator
/**
 * Used to decorate model class' properties to assert it must be one of the specified.
 *
 * ```typescript
 *
 * import * as joi from 'joi'
 *
 * enum AccountStatus { ACTIVE = 'active', LOCKED = 'locked' }
 *
 * class Model {
 *   @only(AccountStatus.ACTIVE, AccountStatus.LOCKED)
 *   status: AccountStatus
 * }
 * ```
 */
function only(...values) {
    return function (proto, propName) {
        Guard_1.Guard.assertIsTruthy(propName, 'This decorator is for properties inside class');
        const propMeta = v.getPropValidationMetadata(proto.constructor, propName);
        propMeta.rules.push(prev => prev.only(values));
        v.setPropValidationMetadata(proto.constructor, propName, propMeta);
    };
}
exports.only = only;
// export type OnlyDecorator = (...values: any[]) => PropertyDecorator
/**
 * Used to decorate model class' properties to assert it must exist and have non-undefined value.
 * @param {boolean} allowNull Whether or not to allow null value. Default is false.
 */
function required(allowNull = false) {
    return function (proto, propName) {
        Guard_1.Guard.assertIsTruthy(propName, 'This decorator is for properties inside class');
        const propMeta = v.getPropValidationMetadata(proto.constructor, propName);
        propMeta.rules.push(prev => prev.required());
        allowNull && propMeta.rules.push(prev => prev.allow(null));
        v.setPropValidationMetadata(proto.constructor, propName, propMeta);
    };
}
exports.required = required;
// export type RequiredDecorator = (allowNull?: boolean) => PropertyDecorator
/**
 * Used to decorate model class' properties to assert it must exist and have non-undefined value.
 */
function id() {
    return function (proto, propName) {
        Guard_1.Guard.assertIsTruthy(propName, 'This decorator is for properties inside class');
        const classMeta = v.getClassValidationMetadata(proto.constructor);
        classMeta.idProps.add(propName);
        v.setClassValidationMetadata(proto.constructor, classMeta);
    };
}
exports.id = id;
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
function string(opts = { allowEmpty: true }) {
    return function (proto, propName) {
        Guard_1.Guard.assertIsTruthy(propName, 'This decorator is for properties inside class');
        const propMeta = v.getPropValidationMetadata(proto.constructor, propName);
        propMeta.type = () => {
            const schema = joi.string();
            return opts.allowEmpty
                ? schema.allow('')
                : schema.disallow('');
        };
        Boolean(opts.email) && propMeta.rules.push(prev => prev.email());
        (opts.minLength != null) && propMeta.rules.push(prev => prev.min(opts.minLength));
        (opts.maxLength != null) && propMeta.rules.push(prev => prev.max(opts.maxLength));
        (opts.pattern != null) && propMeta.rules.push(prev => prev.regex(opts.pattern));
        Boolean(opts.trim) && propMeta.rules.push(prev => prev.trim());
        Boolean(opts.uri) && propMeta.rules.push(prev => {
            if (typeof opts.uri !== 'boolean') { // string or RegExp
                return prev.uri({ scheme: opts.uri });
            }
            return prev.uri();
        });
        v.setPropValidationMetadata(proto.constructor, propName, propMeta);
    };
}
exports.string = string;
// export type StringDecorator = (opts?: StringDecoratorOptions) => PropertyDecorator
//# sourceMappingURL=validate-decorator.js.map