/// <reference path="./global.d.ts" />
declare module '@micro-fleet/common-browser/dist/app/models/Exceptions' {
    export class Exception implements Error {
        readonly message: string;
        details?: object | string;
        readonly isCritical: boolean;
        name: string;
        stack: string;
        /**
         *
         * @param message
         * @param isCritical
         * @param exceptionClass {class} The exception class to exclude from stacktrace.
         */
        constructor(message?: string, details?: object | string, isCritical?: boolean, exceptionClass?: Function);
        toString(): string;
    }
    /**
     * Represents a serious problem that may cause the system in unstable state
     * and need restarting.
     */
    export class CriticalException extends Exception {
        constructor(message?: string, details?: object | string);
    }
    export type ExceptionConstructor<T extends Exception = MinorException> = new (message?: string, details?: any) => T;
    /**
     * Represents an acceptable problem that can be handled
     * and the system does not need restarting.
     */
    export class MinorException extends Exception {
        constructor(message?: string, details?: object | string);
    }
    /**
     * Represents an error where the provided argument of a function or constructor
     * is not as expected.
     */
    export class InvalidArgumentException extends Exception {
        constructor(argName: string, message?: string);
    }
    /**
     * Represents an error when an unimplemented method is called.
     */
    export class NotImplementedException extends Exception {
        constructor(message?: string);
    }
    /**
     * Represents an error whose origin is from another system.
     */
    export class InternalErrorException extends Exception {
        constructor(message?: string, details?: object | string);
    }

}
declare module '@micro-fleet/common-browser/dist/app/Guard' {
    export class Guard {
        /**
         * Makes sure the specified `target` is not null or undefined.
         * @param name {string} Name to include in error message if assertion fails.
         * @param target {any} Argument to check.
         * @param message {string} Optional error message.
         * @throws {InvalidArgumentException} If assertion fails.
         */
        static assertArgDefined(name: string, target: any, message?: string): void;
        /**
         * Makes sure the specified `target` is a function.
         * @param name {string} Name to include in error message if assertion fails.
         * @param target {any} Argument to check.
         * @param message {string} Optional error message.
         * @throws {InvalidArgumentException} If assertion fails.
         */
        static assertArgFunction(name: string, target: any, message?: string): void;
        /**
         * Makes sure the specified `target` matches Regular Expression `rule`.
         * @param name {string} Name to include in error message if assertion fails.
         * @param target {any} Argument to check.
         * @param message {string} Optional error message.
         * @throws {InvalidArgumentException} If assertion fails.
         */
        static assertArgMatch(name: string, rule: RegExp, target: string, message?: string): void;
        /**
         * Makes sure the specified `target` is not null or undefined.
         * @param target {any} Argument to check.
         * @param message {string} Optional error message.
         * @param isCritical {boolean} If true, throws CriticalException. Otherwise, throws MinorException when assertion fails.
         * @throws {CriticalException} If assertion fails and `isCritical` is true.
         * @throws {MinorException} If assertion fails and `isCritical` is false.
         */
        static assertIsDefined(target: any, message?: string, isCritical?: boolean): void;
        /**
         * Makes sure the specified `target` is a function.
         * @param target {any} Argument to check.
         * @param message {string} Optional error message.
         * @param isCritical {boolean} If true, throws CriticalException. Otherwise, throws MinorException when assertion fails.
         * @throws {CriticalException} If assertion fails and `isCritical` is true.
         * @throws {MinorException} If assertion fails and `isCritical` is false.
         */
        static assertIsFunction(target: any, message?: string, isCritical?: boolean): void;
        /**
         * Makes sure the specified `target` matches Regular Expression `rule`.
         * @param target {any} Argument to check.
         * @param message {string} Optional error message.
         * @param isCritical {boolean} If true, throws CriticalException. Otherwise, throws MinorException when assertion fails.
         * @throws {CriticalException} If assertion fails and `isCritical` is true.
         * @throws {MinorException} If assertion fails and `isCritical` is false.
         */
        static assertIsMatch(rule: RegExp, target: string, message?: string, isCritical?: boolean): void;
        /**
         * Makes sure the specified `target` is considered "truthy" based on JavaScript rule.
         * @param target {any} Argument to check.
         * @param message {string} Error message.
         * @param isCritical {boolean} If true, throws CriticalException. Otherwise, throws MinorException when assertion fails.
         * @throws {CriticalException} If assertion fails and `isCritical` is true.
         * @throws {MinorException} If assertion fails and `isCritical` is false.
         */
        static assertIsTruthy(target: any, message: string, isCritical?: boolean): void;
        /**
         * Makes sure the specified `target` is considered "falsey" based on JavaScript rule.
         * @param target {any} Argument to check.
         * @param message {string} Error message.
         * @throws {InvalidArgumentException} If assertion fails.
         */
        static assertIsFalsey(target: any, message: string, isCritical?: boolean): void;
    }

}
declare module '@micro-fleet/common-browser/dist/app/validators/ValidationError' {
    import * as joi from '@hapi/joi';
    import { MinorException } from '@micro-fleet/common-browser/dist/app/models/Exceptions';
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
        path?: string[];
        /**
         * The invalid property value.
         */
        value?: any;
    };
    /**
     * Represents an error when a model does not pass validation.
     */
    export class ValidationError extends MinorException {
        /**
         * Constructs an instance of MicroFleet's `ValidationError` from
         * an instance of Joi's `ValidationError`.
         */
        static fromJoi(joiError: joi.ValidationError): ValidationError;
        /**
         * Constructs an instance of MicroFleet's `ValidationError` from
         * "details" property of Joi's `ValidationError`.
         */
        static fromJoiDetails(joiDetails: joi.ValidationErrorItem[]): ValidationError;
        readonly details: ValidationErrorItem[];
        /**
         * @param {string} message The message to be wrapped in a `ValidationErrorItem`.
         */
        constructor(message: string);
        constructor(detail: ValidationErrorItem);
        constructor(details: ValidationErrorItem[]);
    }

}
declare module '@micro-fleet/common-browser/dist/app/validators/JoiModelValidator' {
    import * as joi from '@hapi/joi';
    import { ValidationError } from '@micro-fleet/common-browser/dist/app/validators/ValidationError';
    export interface ValidationOptions extends joi.ValidationOptions {
    }
    export type JoiModelValidatorConstructorOptions = {
        /**
         * Rules to validate model properties.
         */
        schemaMapModel?: joi.SchemaMap;
        /**
         * Rule to validate model ID.
         */
        schemaMapId?: joi.SchemaMap;
        /**
         * Raw Joi Schema.
         *
         * If specified, `schemaMapModel` and `schemaMapId` options will be ignored,
         * `partial` methods will behave the same as `whole`.
         */
        rawSchema?: joi.AnySchema;
        /**
         * Default options which can be override by passing "options" parameter
         * to "whole()" and "partial()"
         */
        joiOptions?: ValidationOptions;
    };
    export interface IModelValidator<T> {
        readonly schemaMapModel: joi.SchemaMap;
        readonly schemaMapId: joi.SchemaMap;
        /**
         * Validates model ID.
         */
        id(id: any): [ValidationError, any];
        /**
         * Validates model for creation operation, which doesn't need `id` property.
         */
        whole(target: any, options?: ValidationOptions): [ValidationError, T];
        /**
         * Validates model for modification operation, which requires `id` property.
         */
        partial(target: any, options?: ValidationOptions): [ValidationError, Partial<T>];
    }
    export class JoiModelValidator<T> implements IModelValidator<T> {
        /**
         * Compiled rules for model ID.
         */
                /**
         * Compiled rules for model properties.
         */
                /**
         * Compiled rules for model properties, but all of them are OPTIONAL.
         * Used for patch operation.
         */
                                                constructor(options: JoiModelValidatorConstructorOptions);
        readonly schemaMapModel: joi.SchemaMap;
        readonly schemaMapId: joi.SchemaMap;
        /**
         * @see IModelValidator.id
         */
        id(id: any): [ValidationError, any];
        /**
         * @see IModelValidator.whole
         */
        whole(target: any, options?: ValidationOptions): [ValidationError, T];
        /**
         * @see IModelValidator.partial
         */
        partial(target: any, options?: ValidationOptions): [ValidationError, Partial<T>];
                                            }

}
declare module '@micro-fleet/common-browser/dist/app/validators/validate-internal' {
    import * as joi from '@hapi/joi';
    import { JoiModelValidator, JoiModelValidatorConstructorOptions } from '@micro-fleet/common-browser/dist/app/validators/JoiModelValidator';
    export type PropValidationMetadata = {
        type?(): joi.AnySchema;
        rules?: Array<(prev: joi.AnySchema) => joi.AnySchema>;
        rawSchema?: joi.SchemaLike;
    };
    export type ClassValidationMetadata = JoiModelValidatorConstructorOptions & {
        idProps: Set<string | symbol>;
        props: {
            [key: string]: PropValidationMetadata;
        };
    };
    export function getClassValidationMetadata(Class: Function): ClassValidationMetadata;
    export function setClassValidationMetadata(Class: Function, meta: ClassValidationMetadata): void;
    export function deleteClassValidationMetadata(Class: Function): void;
    export function getPropValidationMetadata(Class: Function, propName: string | symbol): PropValidationMetadata;
    export function setPropValidationMetadata(Class: Function, propName: string | symbol, meta: PropValidationMetadata): void;
    export function createJoiValidator<T>(Class: Function): JoiModelValidator<T>;

}
declare module '@micro-fleet/common-browser/dist/app/models/Translatable' {
    import { IModelValidator } from '@micro-fleet/common-browser/dist/app/validators/JoiModelValidator';
    import { ValidationError } from '@micro-fleet/common-browser/dist/app/validators/ValidationError';
    export interface ITranslatable<T = any> {
        getValidator(): IModelValidator<T>;
        from(source: object): [ValidationError, T];
        fromMany(source: object[]): Array<[ValidationError, T]>;
    } type Newable<T = any> = (new (...args: any[]) => T); type TranslatableClass<U> = Newable<U> & typeof Translatable;
    export abstract class Translatable {
        static getValidator<VT extends Translatable>(this: TranslatableClass<VT>): IModelValidator<VT>;
        protected static $createValidator<VT extends Translatable>(this: TranslatableClass<VT>): IModelValidator<VT>;
        static from<FT extends Translatable>(this: TranslatableClass<FT>, source: object): [ValidationError, FT];
        static fromMany<FT extends Translatable>(this: TranslatableClass<FT>, source: object[]): Array<[ValidationError, FT]>;
    }
    /**
     * Used to decorate model class to equip same functionalities as extending class `Translatable`.
     */
    export function translatable(): ClassDecorator;
    export {};

}
declare module '@micro-fleet/common-browser/dist/app/validators/JoiExtended' {
    import * as joi from '@hapi/joi';
    export type JoiDateStringOptions = {
        /**
         * Whether the input string is in UTC format.
         * Default: false.
         */
        isUTC?: boolean;
        /**
         * Function to convert input string to desired data type.
         * Default function returns native Date object.
         */
        translator?: any;
    };
    export type ExtendedJoi = joi.AnySchema & {
        genn(): {
            /**
             * Makes sure input is native bigint type.
             *
             * @example extJoi.genn().bigint().validate('98765443123456');
             * @example extJoi.genn().bigint().validate(98765443123456n, {convert: false});
             */
            bigint(): joi.AnySchema;
            /**
             * Makes sure input is in W3C Date and Time Formats,
             * but must have at least year, month, and day.
             *
             * @example extJoi.genn().dateString().validate('2019-05-15T09:06:02+07:00');
             * @example extJoi.genn().dateString({ isUTC: true }).validate('2019-05-15T09:06:02Z');
             * @example extJoi.genn().dateString({ translator: moment }).validate('2019-05-15T09:06:02-07:00');
             */
            dateString(options?: JoiDateStringOptions): joi.AnySchema;
        };
    };
    /**
     * Joi instance with "genn()" extension enabled, including some custom rules.
     */
    export const extJoi: ExtendedJoi;

}
declare module '@micro-fleet/common-browser/dist/app/validators/validate-decorator' {
    import * as joi from '@hapi/joi';
    import { JoiModelValidatorConstructorOptions } from '@micro-fleet/common-browser/dist/app/validators/JoiModelValidator';
    export type ArrayDecoratorOptions = {
        /**
         * Whether or not to allow specifying a value and
         * convert it into array with single item.
         * Default is true.
         */
        allowSingle?: boolean;
        /**
         * Validation rules for array items.
         * Read Joi's docs for more details and examples: https://hapi.dev/family/joi/?v=15.1.1#arrayitemstype
         */
        items: joi.SchemaLike | joi.SchemaLike[];
        /**
         * Minimum allowed number of items.
         */
        minLength?: number;
        /**
         * Maximum allowed number of items.
         */
        maxLength?: number;
    };
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
    export function array(opts: ArrayDecoratorOptions): PropertyDecorator;
    export type BooleanDecoratorOptions = {
        /**
         * Whether or not to convert value to boolean type.
         * Default is true.
         */
        convert?: boolean;
    };
    /**
     * Used to decorate model class' properties to assert it must be a boolean.
     */
    export function boolean(opts?: BooleanDecoratorOptions): PropertyDecorator;
    export type BigIntDecoratorOptions = {
        /**
         * Whether or not to convert value to bigint type.
         * Default is FALSE, which means the value is kept as a string.
         */
        convert?: boolean;
    };
    /**
     * Used to decorate model class' properties to assert it must be a Big Int.
     */
    export function bigInt({ convert }?: BigIntDecoratorOptions): PropertyDecorator;
    export type NumberDecoratorOptions = {
        /**
         * Minimum allowed number.
         */
        min?: number;
        /**
         * Maximum allowed number.
         */
        max?: number;
        /**
         * Whether or not to convert value to number type.
         * Default is true.
         */
        convert?: boolean;
    };
    /**
     * Used to decorate model class' properties to assert it must be a number.
     */
    export function number({ min, max, ...opts }?: NumberDecoratorOptions): PropertyDecorator;
    export type DateTimeDecoratorOptions = {
        /**
         * Whether the input string is in UTC format.
         * Default: false.
         */
        isUTC?: boolean;
        /**
         * Function to convert input string to desired data type.
         * Default to convert to native Date object.
         */
        translator?: any;
        /**
         * Whether or not to use `translator` to convert or keep as string.
         * Default is false, which keeps as string.
         */
        convert?: boolean;
    };
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
    export function datetime({ isUTC, translator, convert }?: DateTimeDecoratorOptions): PropertyDecorator;
    /**
     * Used to decorate model class' properties to specify default value.
     * @param {any} value The default value.
     */
    export function defaultAs(value: any): PropertyDecorator;
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
    export function only(...values: any[]): PropertyDecorator;
    /**
     * Used to decorate model class' properties to assert it must exist and have non-undefined value.
     * @param {boolean} allowNull Whether or not to allow null value. Default is false.
     */
    export function required(allowNull?: boolean): PropertyDecorator;
    /**
     * Used to decorate model class' properties to assert it must exist and have non-undefined value.
     */
    export function id(): PropertyDecorator;
    export type StringDecoratorOptions = {
        /**
         * Whether or not to allow empty string (''). Default is true.
         */
        allowEmpty?: boolean;
        /**
         * Requires the string value to be a valid email address.
         * Default is false.
         */
        email?: boolean;
        /**
         * Minimum allowed string length.
         */
        minLength?: number;
        /**
         * Maximum allowed string length.
         */
        maxLength?: number;
        /**
         * Regular expression pattern to match.
         */
        pattern?: RegExp;
        /**
         * Requires the string value to contain no whitespace before or after.
         * If the validation convert option is on (enabled by default), the string will be trimmed.
         *
         * Default value is false
         */
        trim?: boolean;
        /**
         * Requires the string value to be a valid RFC 3986 URI.
         *
         * Value can be `true`, or optionally one or more acceptable Schemes, should only include the scheme name.
         * Can be an Array or String (strings are automatically escaped for use in a Regular Expression).
         *
         * Default is false.
         */
        uri?: boolean | string | RegExp | Array<string | RegExp>;
    };
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
    export function string(opts?: StringDecoratorOptions): PropertyDecorator;
    /**
     * Used to decorate model class to equip same functionalities as extending class `Translatable`.
     */
    export function translatable(): ClassDecorator;
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
    export function validateClass(validatorOptions: JoiModelValidatorConstructorOptions): ClassDecorator;
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
    export function validateProp(schema: joi.SchemaLike): PropertyDecorator;

}
declare module '@micro-fleet/common-browser/dist/app/decorators' {
    import { translatable } from '@micro-fleet/common-browser/dist/app/models/Translatable';
    import * as v from '@micro-fleet/common-browser/dist/app/validators/validate-decorator';
    export { ArrayDecoratorOptions, BooleanDecoratorOptions, BigIntDecoratorOptions, NumberDecoratorOptions, DateTimeDecoratorOptions, StringDecoratorOptions, } from '@micro-fleet/common-browser/dist/app/validators/validate-decorator';
    export type Decorators = {
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
        array: typeof v.array;
        /**
         * Used to decorate model class' properties to assert it must be a Big Int.
         */
        bigInt: typeof v.bigInt;
        /**
         * Used to decorate model class' properties to assert it must be a boolean.
         */
        boolean: typeof v.boolean;
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
        datetime: typeof v.datetime;
        /**
         * Used to decorate model class' properties to specify default value.
         * @param {any} value The default value.
         */
        defaultAs: typeof v.defaultAs;
        /**
         * Used to decorate model class' properties to assert it must exist and have non-undefined value.
         */
        id: typeof v.id;
        /**
         * Used to decorate model class' properties to assert it must be a number.
         */
        number: typeof v.number;
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
        only: typeof v.only;
        /**
         * Used to decorate model class' properties to assert it must exist and have non-undefined value.
         * @param {boolean} allowNull Whether or not to allow null value. Default is false.
         */
        required: typeof v.required;
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
        string: typeof v.string;
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
        validateClass: typeof v.validateClass;
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
        validateProp: typeof v.validateProp;
        /**
         * Used to decorate model class to equip same functionalities as extending class `Translatable`.
         */
        translatable: typeof translatable;
    };
    export const decorators: Decorators;

}
declare module '@micro-fleet/common-browser/dist/app/interfaces/automapper' {
    /**
     * Interface for returning an object with available 'sub' functions
     * to enable method chaining (e.g. automapper.createMap().forMember().forMember() ...)
     */
    export interface ICreateMapFluentFunctions {
        /**
         * Customize configuration for an individual destination member.
         * @param sourceProperty The destination member property name.
         * @param valueOrFunction The value or function to use for this individual member.
         * @returns {IAutoMapperCreateMapChainingFunctions}
         */
        forMember(sourceProperty: string, valueOrFunction: any | ((opts: IMemberConfigurationOptions) => any) | ((opts: IMemberConfigurationOptions, cb: IMemberCallback) => void)): ICreateMapFluentFunctions;
        /**
         * Customize configuration for an individual source member.
         * @param sourceProperty The source member property name.
         * @param sourceMemberConfigFunction The function to use for this individual member.
         * @returns {IAutoMapperCreateMapChainingFunctions}
         */
        forSourceMember(sourceProperty: string, sourceMemberConfigFunction: ((opts: ISourceMemberConfigurationOptions) => any) | ((opts: ISourceMemberConfigurationOptions, cb: IMemberCallback) => void)): ICreateMapFluentFunctions;
        /**
         * Customize configuration for all destination members.
         * @param func The function to use for this individual member.
         * @returns {IAutoMapperCreateMapChainingFunctions}
         */
        forAllMembers(func: (destinationObject: any, destinationPropertyName: string, value: any) => void): ICreateMapFluentFunctions;
        /**
         * Ignore all members not specified explicitly.
         */
        ignoreAllNonExisting(): ICreateMapFluentFunctions;
        /**
         * Skip normal member mapping and convert using a custom type converter (instantiated during mapping).
         * @param typeConverterClassOrFunction The converter class or function to use when converting.
         */
        convertUsing(typeConverterClassOrFunction: ((resolutionContext: IResolutionContext) => any) | ((resolutionContext: IResolutionContext, callback: IMapCallback) => void) | ITypeConverter | (new () => ITypeConverter)): void;
        /**
         * Specify to which class type AutoMapper should convert. When specified,
         * AutoMapper will create an instance of the given type, instead of returning a new object literal.
         * @param typeClass The destination type class.
         * @returns {IAutoMapperCreateMapChainingFunctions}
         */
        convertToType(typeClass: new () => any): ICreateMapFluentFunctions;
        /**
         * Specify which profile should be used when mapping.
         * @param {string} profileName The profile name.
         * @returns {IAutoMapperCreateMapChainingFunctions}
         */
        withProfile(profileName: string): void;
    }
    /**
     * Configuration options for forMember mapping function.
     */
    export interface IMemberConfigurationOptions extends ISourceMemberConfigurationOptions {
        /**
         * Map from a custom source property name.
         * @param sourcePropertyName The source property to map.
         */
        mapFrom(sourcePropertyName: string): void;
        /**
         * If specified, the property will only be mapped when the condition is fulfilled.
         */
        condition(predicate: ((sourceObject: any) => boolean)): void;
    }
    /**
     * Configuration options for forSourceMember mapping function.
     */
    export interface ISourceMemberConfigurationOptions extends IMappingConfigurationOptions {
        /**
         * When this configuration function is used, the property is ignored
         * when mapping.
         */
        ignore(): void;
    }
    export interface IMappingConfigurationOptions {
        /** The source object to map. */
        sourceObject: any;
        /** The source property to map. */
        sourcePropertyName: string;
        /**
         * The intermediate destination property value, used for stacking multiple for(Source)Member calls
         * while elaborating the intermediate result.
         */
        intermediatePropertyValue: any;
    }
    /**
     * Member callback interface
     */
    export type IMemberCallback = (callbackValue: any) => void;
    /**
     * Converts source type to destination type instead of normal member mapping
     */
    export interface ITypeConverter {
        /**
         * Performs conversion from source to destination type.
         * @param {IResolutionContext} resolutionContext Resolution context.
         * @returns {any} Destination object.
         */
        convert(resolutionContext: IResolutionContext): any;
    }
    /**
     * Context information regarding resolution of a destination value
     */
    export interface IResolutionContext {
        /** Source value */
        sourceValue: any;
        /** Destination value */
        destinationValue: any;
        /** Source property name */
        sourcePropertyName?: string;
        /** Destination property name */
        destinationPropertyName?: string;
        /** Index of current collection mapping */
        arrayIndex?: number;
    }
    /**
     * Member callback interface
     */
    export type IMapCallback = (result: any) => void;

}
declare module '@micro-fleet/common-browser/dist/app/models/Maybe' {
    import { Exception } from '@micro-fleet/common-browser/dist/app/models/Exceptions';
    /**
     * Represents an error when attempting to get value from a Maybe.Nothing
     */
    export class EmptyMaybeException extends Exception {
        constructor(name: string);
    }
    /**
     * Represents an object which may or may not have a value.
     * Use this class to avoid assigning `null` to a variable.
     * Source code inspired by: https://github.com/ramda/ramda-fantasy/blob/master/dist/Maybe.js
     * and V8 Maybe: https://v8docs.nodesource.com/node-9.3/d9/d4b/classv8_1_1_maybe.html
     */
    export abstract class Maybe<T = any> {
        protected $name: string;
        /**
         * Creates an empty Maybe which throws `EmptyMaybeException` if attempting to get value.
         * @param {string} name The debugging-friendly name to included in error message or `toString()` result.
         */
        static Nothing(name?: string): Maybe;
        /**
         * Creates a Maybe wrapping a value.
         * @param {T} value The value to be wrapped, it may be anything even `null` or `undefined`.
         * @param {string} name The debugging-friendly name to included in error message or `toString()` result.
         */
        static Just<T>(value: T, name?: string): Maybe<T>;
        static isJust(target: any): target is Just<any>;
        static isNothing(target: any): target is Nothing;
        static isMaybe(target: any): target is Maybe;
        /**
         * Alias of Maybe.Just
         */
        static of: typeof Maybe.Just;
        abstract readonly isJust: boolean;
        abstract readonly isNothing: boolean;
        /**
         * Gets the contained value if Just, or throws an `EmptyMaybeException` if Nothing.
         * If you want to avoid exception, use `tryGetValue()` instead.
         */
        abstract readonly value: T;
        /**
         * Alias of Maybe.Just
         */
        of: typeof Maybe.Just;
        /**
         * Applies the funtion `f` to internal value if Just,
         * or does nothing if Nothing.
         */
        abstract map<TMap>(f: (val: T) => TMap): Maybe<TMap>;
        /**
         * Takes another Maybe that wraps a function and applies its `map`
         * method to this Maybe's value, which must be a function.
         */
        abstract ap(m: Maybe): Maybe;
        /**
         * `f` must be a function which returns a value of the same Chain
         *  chain must return a value of the same Chain
         */
        abstract chain<TChain>(f: (val: T) => Maybe<TChain>): Maybe<TChain>;
        /**
         * Same as `map`, but only executes the callback function if Nothing,
         * or does nothing if Just.
         */
        abstract mapElse(f: () => void): Maybe<T>;
        /**
         * Same as `chain`, but only executes the callback function if Nothing,
         * or does nothing if Just.
         */
        abstract chainElse<TChain>(f: () => Maybe<TChain>): Maybe<TChain>;
        /**
         * Attempts to get the contained value, if there is not, returns the given default value.
         * @param defaultVal Value to return in case there is no contained value.
         */
        abstract tryGetValue(defaultVal: any): T;
        constructor($name: string);
    } class Just<T> extends Maybe {
                /**
         * @override
         */
        readonly isJust: boolean;
        /**
         * @override
         */
        readonly isNothing: boolean;
        /**
         * @override
         */
        readonly value: T;
        constructor(_value: T, name: string);
        /**
         * @override
         */
        map<TMap>(f: (val: T) => TMap): Maybe<TMap>;
        /**
         * @override
         */
        mapElse: typeof returnThis;
        /**
         * @override
         */
        chainElse: typeof returnThis;
        /**
         * @override
         */
        ap(m: Maybe): Maybe;
        /**
         * @override
         */
        chain<TChain>(f: (val: T) => Maybe<TChain>): Maybe<TChain>;
        /**
         * @override
         */
        tryGetValue(defaultVal: any): T;
        /**
         * @override
         */
        toString(): string;
    } function returnThis(this: any): any; class Nothing extends Maybe {
        /**
         * @override
         */
        readonly isJust: boolean;
        /**
         * @override
         */
        readonly isNothing: boolean;
        /**
         * @override
         */
        readonly value: any;
        constructor(name: string);
        /**
         * @override
         */
        map: typeof returnThis;
        /**
         * @override
         */
        mapElse(f: () => void): Maybe;
        chainElse<TChain>(f: () => Maybe<TChain>): Maybe<TChain>;
        /**
         * @override
         */
        ap: typeof returnThis;
        /**
         * @override
         */
        chain: typeof returnThis;
        /**
         * @override
         */
        tryGetValue(defaultVal: any): any;
        /**
         * @override
         */
        toString(): string;
    }
    export {};

}
declare module '@micro-fleet/common-browser/dist/app/models/PagedData' {
    /**
     * An object that contains paged array of items.
     */
    export class PagedData<T> {
                        /**
         * Gets number of contained items
         */
        readonly length: number;
        /**
         * Gets total number of items.
         */
        readonly total: number;
        /**
         * Gets array of items.
         */
        readonly items: T[];
        constructor(items?: T[], total?: number);
        concat(arr: T[]): PagedData<T>;
        forEach(callbackFn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
        map<U>(callbackFn: (value: T, index: number, array: T[]) => U, thisArg?: any): PagedData<U>;
        /**
         * Returns a serializable object.
         */
        toJSON(): {
            total: number;
            items: T[];
        };
    }

}
declare module '@micro-fleet/common-browser/dist/app/models/Result' {
    import { Exception, ExceptionConstructor } from '@micro-fleet/common-browser/dist/app/models/Exceptions'; function returnThis(this: any): any;
    /**
     * Represents an error when attempting to get value from a Result.Failure
     */
    export class NoValueFromFailureResultException extends Exception {
        constructor(name: string);
    }
    /**
     * Represents an error when attempting to get error from a Result.Ok
     */
    export class NoErrorFromOkResultException extends Exception {
        constructor(name: string);
    }
    /**
     * Represents an object which can be Ok or Failure.
     * Use this class to avoid throwing Exception.
     * Source code inspired by: https://github.com/ramda/ramda-fantasy/blob/master/dist/Either.js
     */
    export abstract class Result<TOk = any, TFail = any> {
        protected $name: string;
        static Failure<TO, TF>(reason: TF, name?: string): Result<TO, TF>;
        static Ok<TO>(value: TO, name?: string): Result<TO>;
        static isOk(target: any): target is Ok<any>;
        static isFailure(target: any): target is Failure;
        static isResult(target: any): target is Result;
        /**
         * Alias of Result.Ok
         */
        static of: typeof Result.Ok;
        abstract readonly isOk: boolean;
        abstract readonly isFailure: boolean;
        /**
         * Gets the success value if Ok, or throws an `NoValueFromFailureResultException` if Failure.
         * If you want to avoid exception, use `tryGetValue()` instead.
         */
        abstract readonly value: TOk;
        /**
         * Gets the error if Failure, or throws an `NoErrorFromOkResultException` if Ok.
         */
        abstract readonly error: TFail;
        /**
         * Alias of Result.Ok
         */
        of: typeof Result.Ok;
        /**
         * Applies the funtion `f` to internal value if Ok,
         * or does nothing if Failure.
         */
        abstract map<TMap>(f: (val: TOk) => TMap): Result<TMap>;
        /**
         * Takes another Result that wraps a function and applies its `map`
         * method to this Result's value, which must be a function.
         */
        abstract ap(m: Result): Result;
        /**
         * `f` must be a function which returns a value of the same Chain
         *  chain must return a value of the same Chain
         */
        abstract chain<TChain>(f: (val: TOk) => Result<TChain>): Result<TChain>;
        /**
         * Same as `map`, but only executes the callback function if Failure,
         * or does nothing if Ok.
         */
        abstract mapElse(f: (reason: TFail) => void): Result<TOk>;
        /**
         * Same as `chain`, but only executes the callback function if Failure,
         * or does nothing if Ok.
         */
        abstract chainElse<TChain>(f: (reason: TFail) => Result<TChain>): Result<TChain>;
        /**
         * Attempts to get the success value, if this is Failure, returns the given default value.
         * @param defaultVal Value to return in case there is no contained value.
         */
        abstract tryGetValue(defaultVal: any): TOk;
        /**
         * Throws the error if Failure, or does nothing if Ok.
         * @param ExceptionClass The class to wrap error
         */
        abstract throwErrorIfAny(ExceptionClass?: ExceptionConstructor, message?: string): void;
        constructor($name: string);
    } class Ok<T> extends Result<T, any> {
                /**
         * @override
         */
        readonly isOk: boolean;
        /**
         * @override
         */
        readonly isFailure: boolean;
        /**
         * @override
         */
        readonly error: any;
        /**
         * @override
         */
        readonly value: T;
        constructor(_value: T, name: string);
        /**
         * @override
         */
        map<TMap>(f: (val: T) => TMap): Result<TMap>;
        /**
         * @override
         */
        mapElse: typeof returnThis;
        /**
         * @override
         */
        chainElse: typeof returnThis;
        /**
         * @override
         */
        ap(m: Result): Result;
        /**
         * @override
         */
        chain<TChain>(f: (val: T) => Result<TChain>): Result<TChain>;
        /**
         * @override
         */
        tryGetValue(defaultVal: any): T;
        /**
         * @override
         */
        throwErrorIfAny(ExceptionClass?: ExceptionConstructor, message?: string): void;
        /**
         * @override
         */
        toString(): string;
    } class Failure<T = any> extends Result<any, T> {
                /**
         * @override
         */
        readonly isOk: boolean;
        /**
         * @override
         */
        readonly isFailure: boolean;
        /**
         * @override
         */
        readonly error: T;
        /**
         * @override
         */
        readonly value: any;
        constructor(_reason: T, name: string);
        /**
         * @override
         */
        map: typeof returnThis;
        /**
         * @override
         */
        mapElse(f: (reason: T) => void): Result;
        chainElse<TChain>(f: (reason: T) => Result<TChain>): Result<TChain>;
        /**
         * @override
         */
        ap: typeof returnThis;
        /**
         * @override
         */
        chain: typeof returnThis;
        /**
         * @override
         */
        tryGetValue(defaultVal: any): any;
        /**
         * @override
         */
        throwErrorIfAny(ExceptionClass?: ExceptionConstructor, message?: string): void;
        /**
         * @override
         */
        toString(): string;
    }
    export {};

}
declare module '@micro-fleet/common-browser/dist/app/validators/BusinessInvariantError' {
    import { ValidationError, ValidationErrorItem } from '@micro-fleet/common-browser/dist/app/validators/ValidationError';
    /**
     * Represents a business rule violation.
     */
    export class BusinessInvariantError extends ValidationError {
        /**
         * @param {string} message The message to be wrapped in a `ValidationErrorItem`.
         */
        constructor(message: string);
        constructor(detail: ValidationErrorItem);
        constructor(details: ValidationErrorItem[]);
    }

}
