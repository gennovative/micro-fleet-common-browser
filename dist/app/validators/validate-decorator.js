"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("@hapi/joi");
const Translatable_1 = require("../models/Translatable");
const Guard_1 = require("../Guard");
const v = require("./validate-internal");
const JoiExtended_1 = require("./JoiExtended");
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
 *     items: joi.string().valid(ALLOWED).required()
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
        const classMeta = v.getClassValidationMetadata(proto.constructor);
        const propMeta = v.extractPropValidationMetadata(classMeta, propName, proto.constructor);
        propMeta.type = () => {
            const schema = joi.array();
            if (Array.isArray(opts.items)) {
                return schema.items(...opts.items);
            }
            return schema.items(opts.items);
        };
        (opts.minLength != null) && propMeta.rules.push(prev => prev.min(opts.minLength));
        (opts.maxLength != null) && propMeta.rules.push(prev => prev.max(opts.maxLength));
        const allowSingle = (opts.allowSingle == null) ? true : opts.allowSingle;
        allowSingle && propMeta.rules.push(prev => prev.single().options({ convert: true }));
        v.setPropValidationMetadata(proto.constructor, classMeta, propName, propMeta);
    };
}
exports.array = array;
/**
 * Used to decorate model class' properties to assert it must be a boolean.
 */
function boolean(opts = {}) {
    return function (proto, propName) {
        Guard_1.Guard.assertIsTruthy(propName, 'This decorator is for properties inside class');
        const classMeta = v.getClassValidationMetadata(proto.constructor);
        const propMeta = v.extractPropValidationMetadata(classMeta, propName, proto.constructor);
        propMeta.type = () => joi.boolean().options(opts);
        v.setPropValidationMetadata(proto.constructor, classMeta, propName, propMeta);
    };
}
exports.boolean = boolean;
/**
 * Used to decorate model class' properties to assert it must be a Big Int.
 */
function bigint({ convert } = { convert: false }) {
    return function (proto, propName) {
        Guard_1.Guard.assertIsTruthy(propName, 'This decorator is for properties inside class');
        const classMeta = v.getClassValidationMetadata(proto.constructor);
        const propMeta = v.extractPropValidationMetadata(classMeta, propName, proto.constructor);
        propMeta.type = () => JoiExtended_1.extJoi.bigint();
        Boolean(convert) && propMeta.rules.push((prev) => prev.asNative());
        v.setPropValidationMetadata(proto.constructor, classMeta, propName, propMeta);
    };
}
exports.bigint = bigint;
/**
 * Used to decorate model class' properties to assert it must be a number.
 */
function number(_a = {}) {
    var { min, max } = _a, opts = __rest(_a, ["min", "max"]);
    return function (proto, propName) {
        Guard_1.Guard.assertIsTruthy(propName, 'This decorator is for properties inside class');
        const classMeta = v.getClassValidationMetadata(proto.constructor);
        const propMeta = v.extractPropValidationMetadata(classMeta, propName, proto.constructor);
        propMeta.type = () => joi.number().options(opts);
        (min != null) && propMeta.rules.push(prev => prev.min(min));
        (max != null) && propMeta.rules.push(prev => prev.max(max));
        v.setPropValidationMetadata(proto.constructor, classMeta, propName, propMeta);
    };
}
exports.number = number;
/**
 * Used to decorate model class' properties to assert it must be a number.
 *
 * ```typescript
 * class ModelA {
 *    @dateString()
 *    birthdate: string
 * }
 *
 *
 * class ModelB {
 *    @dateString({ convert: true })
 *    birthdate: Date
 * }
 *
 *
 * import * as moment from 'moment'
 *
 * class ModelC {
 *    @dateString({ isUTC: true, translator: moment, convert: true })
 *    birthdate: moment.Moment
 * }
 * ```
 */
function dateString({ isUTC, translator, convert = false } = {}) {
    return function (proto, propName) {
        Guard_1.Guard.assertIsTruthy(propName, 'This decorator is for properties inside class');
        const classMeta = v.getClassValidationMetadata(proto.constructor);
        const propMeta = v.extractPropValidationMetadata(classMeta, propName, proto.constructor);
        propMeta.type = () => JoiExtended_1.extJoi.dateString();
        Boolean(isUTC) && propMeta.rules.push((prev) => prev.isUTC());
        Boolean(convert) && propMeta.rules.push((prev) => prev.translate(translator));
        v.setPropValidationMetadata(proto.constructor, classMeta, propName, propMeta);
    };
}
exports.dateString = dateString;
/**
 * Used to decorate model class' properties to specify default value.
 * @param {any} value The default value.
 */
function defaultAs(value) {
    return function (proto, propName) {
        Guard_1.Guard.assertIsTruthy(propName, 'This decorator is for properties inside class');
        const classMeta = v.getClassValidationMetadata(proto.constructor);
        const propMeta = v.extractPropValidationMetadata(classMeta, propName, proto.constructor);
        propMeta.rules.push(prev => prev.default(value));
        v.setPropValidationMetadata(proto.constructor, classMeta, propName, propMeta);
    };
}
exports.defaultAs = defaultAs;
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
 *   @valid(AccountStatus.ACTIVE, AccountStatus.LOCKED)
 *   status: AccountStatus
 * }
 * ```
 */
function valid(...values) {
    return function (proto, propName) {
        Guard_1.Guard.assertIsTruthy(propName, 'This decorator is for properties inside class');
        const classMeta = v.getClassValidationMetadata(proto.constructor);
        const propMeta = v.extractPropValidationMetadata(classMeta, propName, proto.constructor);
        // Passing array might be a mistake causing array in array [[value]]
        // We should correct it back to spreaded list of params
        if (values.length == 1 && Array.isArray(values[0])) {
            values = [...values[0]];
        }
        propMeta.rules.push(prev => prev.valid(...values));
        v.setPropValidationMetadata(proto.constructor, classMeta, propName, propMeta);
    };
}
exports.valid = valid;
/**
 * Used to decorate model class' properties to assert it must exist and have non-undefined value.
 * @param {boolean} allowNull Whether or not to allow null value. Default is false.
 */
function required(allowNull = false) {
    return function (proto, propName) {
        Guard_1.Guard.assertIsTruthy(propName, 'This decorator is for properties inside class');
        const classMeta = v.getClassValidationMetadata(proto.constructor);
        const propMeta = v.extractPropValidationMetadata(classMeta, propName, proto.constructor);
        propMeta.rules.push(prev => prev.required());
        allowNull && propMeta.rules.push(prev => prev.allow(null));
        v.setPropValidationMetadata(proto.constructor, classMeta, propName, propMeta);
    };
}
exports.required = required;
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
        const classMeta = v.getClassValidationMetadata(proto.constructor);
        const propMeta = v.extractPropValidationMetadata(classMeta, propName, proto.constructor);
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
        v.setPropValidationMetadata(proto.constructor, classMeta, propName, propMeta);
    };
}
exports.string = string;
/**
 * Used to decorate model class to equip same functionalities as extending class `Translatable`.
 */
function translatable() {
    return function (TargetClass) {
        copyStatic(Translatable_1.Translatable, TargetClass, ['getTranslator', '$createTranslator', 'getValidator', '$createValidator', 'from', 'fromMany']);
    };
}
exports.translatable = translatable;
function copyStatic(SrcClass, DestClass, props = []) {
    props.forEach(p => {
        if (!DestClass[p]) {
            DestClass[p] = SrcClass[p].bind(DestClass);
        }
    });
}
/**
 * Used to decorate model class to __exclusively__ declare validation rules,
 * which means it __replaces__ all rules and options from parent class
 * as well as property rules in same class.
 *
 * @param {JoiModelValidatorConstructorOptions} validatorOptions The options for creating `JoiModelValidator` instance.
 */
function validateClass(validatorOptions) {
    return function (TargetClass) {
        Guard_1.Guard.assertArgDefined('validatorOptions', validatorOptions);
        const classMeta = Object.assign(v.createClassValidationMetadata(), validatorOptions);
        v.setClassValidationMetadata(TargetClass, classMeta);
    };
}
exports.validateClass = validateClass;
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
        const classMeta = v.getClassValidationMetadata(proto.constructor);
        const propMeta = v.extractPropValidationMetadata(classMeta, propName, proto.constructor);
        propMeta.rawSchema = schema;
        v.setPropValidationMetadata(proto.constructor, classMeta, propName, propMeta);
    };
}
exports.validateProp = validateProp;
//# sourceMappingURL=validate-decorator.js.map