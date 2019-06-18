/// <reference path="./global.d.ts" />
declare module '@micro-fleet/common-browser/dist/app/models/Exceptions' {
	export class Exception implements Error {
	    readonly message: string;
	    readonly isCritical: boolean;
	    stack: string;
	    name: string;
	    details: any;
	    /**
	     *
	     * @param message
	     * @param isCritical
	     * @param exceptionClass {class} The exception class to exclude from stacktrace.
	     */
	    constructor(message?: string, isCritical?: boolean, exceptionClass?: Function);
	    toString(): string;
	}
	/**
	 * Represents a serious problem that may cause the system in unstable state
	 * and need restarting.
	 */
	export class CriticalException extends Exception {
	    constructor(message?: string);
	}
	/**
	 * Represents an acceptable problem that can be handled
	 * and the system does not need restarting.
	 */
	export class MinorException extends Exception {
	    constructor(message?: string);
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
	    forMember: (sourceProperty: string, valueOrFunction: any | ((opts: IMemberConfigurationOptions) => any) | ((opts: IMemberConfigurationOptions, cb: IMemberCallback) => void)) => ICreateMapFluentFunctions;
	    /**
	     * Customize configuration for an individual source member.
	     * @param sourceProperty The source member property name.
	     * @param sourceMemberConfigFunction The function to use for this individual member.
	     * @returns {IAutoMapperCreateMapChainingFunctions}
	     */
	    forSourceMember: (sourceProperty: string, sourceMemberConfigFunction: ((opts: ISourceMemberConfigurationOptions) => any) | ((opts: ISourceMemberConfigurationOptions, cb: IMemberCallback) => void)) => ICreateMapFluentFunctions;
	    /**
	     * Customize configuration for all destination members.
	     * @param func The function to use for this individual member.
	     * @returns {IAutoMapperCreateMapChainingFunctions}
	     */
	    forAllMembers: (func: (destinationObject: any, destinationPropertyName: string, value: any) => void) => ICreateMapFluentFunctions;
	    /**
	     * Ignore all members not specified explicitly.
	     */
	    ignoreAllNonExisting: () => ICreateMapFluentFunctions;
	    /**
	     * Skip normal member mapping and convert using a custom type converter (instantiated during mapping).
	     * @param typeConverterClassOrFunction The converter class or function to use when converting.
	     */
	    convertUsing: (typeConverterClassOrFunction: ((resolutionContext: IResolutionContext) => any) | ((resolutionContext: IResolutionContext, callback: IMapCallback) => void) | ITypeConverter | (new () => ITypeConverter)) => void;
	    /**
	     * Specify to which class type AutoMapper should convert. When specified,
	     * AutoMapper will create an instance of the given type, instead of returning a new object literal.
	     * @param typeClass The destination type class.
	     * @returns {IAutoMapperCreateMapChainingFunctions}
	     */
	    convertToType: (typeClass: new () => any) => ICreateMapFluentFunctions;
	    /**
	     * Specify which profile should be used when mapping.
	     * @param {string} profileName The profile name.
	     * @returns {IAutoMapperCreateMapChainingFunctions}
	     */
	    withProfile: (profileName: string) => void;
	}
	/**
	 * Configuration options for forMember mapping function.
	 */
	export interface IMemberConfigurationOptions extends ISourceMemberConfigurationOptions {
	    /**
	     * Map from a custom source property name.
	     * @param sourcePropertyName The source property to map.
	     */
	    mapFrom: (sourcePropertyName: string) => void;
	    /**
	     * If specified, the property will only be mapped when the condition is fulfilled.
	     */
	    condition: (predicate: ((sourceObject: any) => boolean)) => void;
	}
	/**
	 * Configuration options for forSourceMember mapping function.
	 */
	export interface ISourceMemberConfigurationOptions extends IMappingConfigurationOptions {
	    /**
	     * When this configuration function is used, the property is ignored
	     * when mapping.
	     */
	    ignore: () => void;
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
	    convert: (resolutionContext: IResolutionContext) => any;
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
	    constructor();
	}
	/**
	 * Represents an object which may or may not have a value.
	 * Use this class to avoid assigning `null` to a variable.
	 * Source code inspired by: https://github.com/ramda/ramda-fantasy/blob/master/dist/Maybe.js
	 * and V8 Maybe: https://v8docs.nodesource.com/node-9.3/d9/d4b/classv8_1_1_maybe.html
	 */
	export abstract class Maybe<T = any> {
	    static Nothing(): Maybe;
	    static Just<T>(value: T): Maybe<T>;
	    static isJust: (maybe: Maybe<any>) => boolean;
	    static isNothing: (maybe: Maybe<any>) => boolean;
	    static of: typeof Maybe.Just;
	    abstract readonly isJust: boolean;
	    abstract readonly isNothing: boolean;
	    /**
	     * Gets the contained value if Just, or throws an `EmptyMaybeException` if Nothing.
	     * If you want to avoid exception, use `tryGetValue()` instead.
	     */
	    abstract readonly value: T;
	    constructor();
	    of: typeof Maybe.Just;
	    /**
	     * Applies the funtion `f` to internal value if Just,
	     * or does nothing if Nothing.
	     */
	    abstract map<TMap>(f: (val: T) => TMap): Maybe<TMap>;
	    /**
	     * Execute the callback function if Nothing,
	     * or does nothing if Just.
	     */
	    abstract orElse(f: () => void): Maybe<T>;
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
	     * Attempts to get the contained value, if there is not, returns the given default value.
	     * @param defaultVal Value to return in case there is no contained value.
	     */
	    abstract tryGetValue(defaultVal: any): T;
	}

}
declare module '@micro-fleet/common-browser/dist/app/models/PagedArray' {
	/**
	 * A wrapper array that contains paged items.
	 */
	export class PagedArray<T> extends Array<T> {
	    	    /**
	     * Gets total number of items.
	     */
	    readonly total: number;
	    constructor(total?: number, ...items: T[]);
	    /**
	     * Returns a serializable object.
	     */
	    asObject(): {
	        total: number;
	        data: any[];
	    };
	}

}
declare module '@micro-fleet/common-browser/dist/app/validators/ValidationError' {
	import * as joi from 'joi';
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
	    path: string[];
	    /**
	     * The invalid property value.
	     */
	    value: any;
	};
	/**
	 * Represents an error when a model does not pass validation.
	 */
	export class ValidationError extends MinorException {
	    readonly details: ValidationErrorItem[];
	    static fromJoi(joiDetails: joi.ValidationErrorItem[]): ValidationError;
	    constructor(details: ValidationErrorItem[]);
	}

}
declare module '@micro-fleet/common-browser/dist/app/validators/IModelValidator' {
	import * as joi from 'joi';
	import { ValidationError } from '@micro-fleet/common-browser/dist/app/validators/ValidationError';
	export interface ValidationOptions extends joi.ValidationOptions {
	}
	export type JoiModelValidatorCreateOptions = {
	    /**
	     * Rules to validate model properties.
	     */
	    schemaMapModel: joi.SchemaMap;
	    /**
	     * Whether the primary key is composite. Default to `false`.
	     * This param is IGNORED if param `schemaMapPk` has value.
	     */
	    isCompositePk?: boolean;
	    /**
	     * Whether to validate PK.
	     * This param is IGNORED if param `schemaMapPk` has value.
	     * Default to be `false`.
	     */
	    requirePk?: boolean;
	    /**
	     * Rule to validate model PK.
	     */
	    schemaMapPk?: joi.SchemaMap;
	};
	export interface IModelValidator<T> {
	    readonly schemaMap: joi.SchemaMap;
	    readonly schemaMapPk: joi.SchemaMap;
	    readonly isCompositePk: boolean;
	    /**
	     * Validates model PK.
	     */
	    pk(pk: any): [ValidationError, any];
	    /**
	     * Validates model for creation operation, which doesn't need `pk` property.
	     */
	    whole(target: any, options?: ValidationOptions): [ValidationError, T];
	    /**
	     * Validates model for modification operation, which requires `pk` property.
	     */
	    partial(target: any, options?: ValidationOptions): [ValidationError, Partial<T>];
	    /**
	     * Must call this method before using `whole` or `partial`,
	     * or after `schemaMap` or `schemaMapId` is changed.
	     */
	    compile(): void;
	}

}
declare module '@micro-fleet/common-browser/dist/app/translators/IModelAutoMapper' {
	import { ICreateMapFluentFunctions } from '@micro-fleet/common-browser/dist/app/interfaces/automapper';
	import { IModelValidator } from '@micro-fleet/common-browser/dist/app/validators/IModelValidator';
	import { ValidationError } from '@micro-fleet/common-browser/dist/app/validators/ValidationError';
	export interface MappingOptions {
	    /**
	     * Temporarily turns on or off model validation.
	     * Can only be turned on if validator is provided to constructor.
	     */
	    enableValidation?: boolean;
	    /**
	     * If specified, gives validation error to this callback. Otherwise, throw error.
	     */
	    errorCallback?: (err: ValidationError) => void;
	}
	export interface IModelAutoMapper<T extends Object> {
	    /**
	     * Turns on or off model validation before translating.
	     * Is set to `true` if validator is passed to class constructor.
	     */
	    enableValidation: boolean;
	    /**
	     * Gets the internal AutoMapper instance for advanced configuration.
	     */
	    readonly internalMapper: ICreateMapFluentFunctions;
	    /**
	     * Gets the validator.
	     */
	    readonly validator: IModelValidator<T>;
	    /**
	     * Copies properties from `sources` to dest then optionally validates
	     * the result (depends on `enableValidation`).
	     * If `enableValidation` is turned off, it works just like native `Object.assign()` function,
	     * therefore, use `Object.assign()` for better performance if validation is not needed.
	     * Note that it uses `partial()` internally, hence `required` validation is IGNORED.
	     *
	     * @throws {ValidationError}
	     */
	    merge(dest: Partial<T>, sources: Partial<T> | Partial<T>[], options?: MappingOptions): Partial<T>;
	    /**
	     * Validates then converts an object to type <T>.
	     * but ONLY properties with value are validated and copied.
	     * Note that `required` validation is IGNORED.
	     * @param {object} source The object to be translated.
	     *
	     * @throws {ValidationError} If no `errorCallback` is provided.
	     */
	    partial(source: object, options?: MappingOptions): Partial<T>;
	    /**
	     * Validates then converts a list of objects to type <T>.
	     * but ONLY properties with value are validated and copied.
	     * Note that `required` validation is IGNORED.
	     * @param {object[]} sources A list of objects to be translated.
	     *
	     * @throws {ValidationError} If no `errorCallback` is provided.
	     */
	    partialMany(sources: object[], options?: MappingOptions): Partial<T>[];
	    /**
	     * Validates then converts an object to type <T>.
	     * ALL properties are validated and copied regardless with or without value.
	     * @param {object} source The object to be translated.
	     *
	     * @throws {ValidationError} If no `errorCallback` is provided.
	     */
	    whole(source: object, options?: MappingOptions): T;
	    /**
	     * Validates then converts a list of objects to type <T>.
	     * ALL properties are validated and copied regardless with or without value.
	     * @param {object[]} sources The list of objects to be translated.
	     *
	     * @throws {ValidationError} If no `errorCallback` is provided.
	     */
	    wholeMany(sources: object[], options?: MappingOptions): T[];
	}

}
declare module '@micro-fleet/common-browser/dist/app/validators/JoiExtended' {
	import * as joi from 'joi';
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
	    genn: () => {
	        /**
	         * Makes sure input is native bigint type.
	         *
	         * @example extJoi.genn().bigint().validate('98765443123456');
	         * @example extJoi.genn().bigint().validate(98765443123456n, {convert: false});
	         */
	        bigint: () => joi.AnySchema;
	        /**
	         * Makes sure input is in W3C Date and Time Formats,
	         * but must have at least year, month, and day.
	         *
	         * @example extJoi.genn().dateString().validate('2019-05-15T09:06:02+07:00');
	         * @example extJoi.genn().dateString({ isUTC: true }).validate('2019-05-15T09:06:02Z');
	         * @example extJoi.genn().dateString({ translator: moment }).validate('2019-05-15T09:06:02-07:00');
	         */
	        dateString: (options?: JoiDateStringOptions) => joi.AnySchema;
	    };
	};
	/**
	 * Joi instance with "genn()" extension enabled, including some custom rules.
	 */
	export const extJoi: ExtendedJoi;

}
declare module '@micro-fleet/common-browser/dist/app/validators/JoiModelValidator' {
	import * as joi from 'joi';
	import { IModelValidator, JoiModelValidatorCreateOptions, ValidationOptions } from '@micro-fleet/common-browser/dist/app/validators/IModelValidator';
	import { ValidationError } from '@micro-fleet/common-browser/dist/app/validators/ValidationError';
	export class JoiModelValidator<T> implements IModelValidator<T> {
	    protected _schemaMap: joi.SchemaMap;
	    protected _isCompositePk: boolean;
	    protected _schemaMapPk?: joi.SchemaMap;
	    /**
	     * Builds a new instance of ModelValidatorBase.
	     */
	    static create<T>({ schemaMapModel, isCompositePk, requirePk, schemaMapPk, }: JoiModelValidatorCreateOptions): JoiModelValidator<T>;
	    /**
	     * Compiled rules for model primary key.
	     */
	    protected _compiledPk: joi.ObjectSchema;
	    /**
	     * Compiled rules for model properties.
	     */
	    protected _compiledWhole: joi.ObjectSchema;
	    /**
	     * Compiled rules for model properties, but all of them are OPTIONAL.
	     * Used for patch operation.
	     */
	    protected _compiledPartial: joi.ObjectSchema;
	    /**
	     * @param {joi.SchemaMap} _schemaMap Rules to validate model properties.
	     * @param {boolean} _isCompositePk Whether the primary key is made of multiple properties. Default to `false`
	     *     This param is IGNORED if param `schemaMapPk` has value.
	     * @param {boolean} requirePk Whether to validate ID.
	     *     This param is IGNORED if param `schemaMapPk` has value.
	     * @param {joi.SchemaMap} _schemaMapId Rule to validate model PK.
	     */
	    protected constructor(_schemaMap: joi.SchemaMap, _isCompositePk: boolean, requirePk: boolean, _schemaMapPk?: joi.SchemaMap);
	    readonly schemaMap: joi.SchemaMap;
	    readonly schemaMapPk: joi.SchemaMap;
	    readonly isCompositePk: boolean;
	    /**
	     * @see IModelValidator.pk
	     */
	    pk(pk: any): [ValidationError, any];
	    /**
	     * @see IModelValidator.whole
	     */
	    whole(target: any, options?: ValidationOptions): [ValidationError, T];
	    /**
	     * @see IModelValidator.partial
	     */
	    partial(target: any, options?: ValidationOptions): [ValidationError, Partial<T>];
	    /**
	     * @see IModelValidator.compile
	     */
	    compile(): void;
	    protected validate(schema: joi.ObjectSchema, target: any, options?: ValidationOptions): [ValidationError, T];
	}

}
declare module '@micro-fleet/common-browser' {
	export * from '@micro-fleet/common-browser/dist/app/Guard';
	export * from '@micro-fleet/common-browser/dist/app/interfaces/automapper';
	export * from '@micro-fleet/common-browser/dist/app/models/Exceptions';
	export * from '@micro-fleet/common-browser/dist/app/models/Maybe';
	export * from '@micro-fleet/common-browser/dist/app/models/PagedArray';
	export * from '@micro-fleet/common-browser/dist/app/translators/IModelAutoMapper';
	export * from '@micro-fleet/common-browser/dist/app/validators/IModelValidator';
	export * from '@micro-fleet/common-browser/dist/app/validators/JoiExtended';
	export * from '@micro-fleet/common-browser/dist/app/validators/JoiModelValidator';
	export * from '@micro-fleet/common-browser/dist/app/validators/ValidationError';

}
