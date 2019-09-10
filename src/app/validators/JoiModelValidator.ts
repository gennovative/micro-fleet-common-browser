import * as joi from '@hapi/joi'

import { Guard } from '../Guard'
import { ValidationError } from './ValidationError'


// tslint:disable-next-line:interface-name
export interface ValidationOptions extends joi.ValidationOptions {
    // Re-brand this interface
}

export type JoiModelValidatorConstructorOptions = {
    /**
     * Rules to validate model properties.
     */
    schemaMapModel: joi.SchemaMap,

    /**
     * Rule to validate model ID.
     */
    schemaMapId?: joi.SchemaMap,

    /**
     * Default options which can be override by passing "options" parameter
     * to "whole()" and "partial()"
     */
    joiOptions?: ValidationOptions,
}

export interface IModelValidator<T> {

    readonly schemaMapModel: joi.SchemaMap

    readonly schemaMapId: joi.SchemaMap

    /**
     * Validates model ID.
     */
    id(id: any): [ValidationError, any]

    /**
     * Validates model for creation operation, which doesn't need `id` property.
     */
    whole(target: any, options?: ValidationOptions): [ValidationError, T]

    /**
     * Validates model for modification operation, which requires `id` property.
     */
    partial(target: any, options?: ValidationOptions): [ValidationError, Partial<T>]

}


export class JoiModelValidator<T>
        implements IModelValidator<T> {

    /**
     * Compiled rules for model ID.
     */
    private _compiledId: joi.ObjectSchema

    /**
     * Compiled rules for model properties.
     */
    private _compiledWhole: joi.ObjectSchema

    /**
     * Compiled rules for model properties, but all of them are OPTIONAL.
     * Used for patch operation.
     */
    private _compiledPartial: joi.ObjectSchema


    private _schemaMapModel: joi.SchemaMap
    private _schemaMapId: joi.SchemaMap
    private _defaultOpts: ValidationOptions


    constructor(options: JoiModelValidatorConstructorOptions) {
        this._defaultOpts = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
            ...options.joiOptions,
        }
        this._schemaMapId = options.schemaMapId
        this._schemaMapModel = options.schemaMapModel
    }


    public get schemaMapModel(): joi.SchemaMap {
        return this._schemaMapModel
    }

    public get schemaMapId(): joi.SchemaMap {
        return this._schemaMapId
    }



    /**
     * @see IModelValidator.id
     */
    public id(id: any): [ValidationError, any] {
        if (!this._compiledId) {
            this._compileIdSchema()
        }
        const { error, value } = this._compiledId.validate<any>(id)
        return (error) ? [ ValidationError.fromJoi(error.details), null] : [null, value]
    }

    /**
     * @see IModelValidator.whole
     */
    public whole(target: any, options: ValidationOptions = {}): [ValidationError, T] {
        if (!this._compiledWhole) {
            this._compileWholeSchema()
        }
        return this._validate(this._compiledWhole, target, options)
    }

    /**
     * @see IModelValidator.partial
     */
    public partial(target: any, options: ValidationOptions = {}): [ValidationError, Partial<T>] {
        if (!this._compiledPartial) {
            this._compilePartialSchema()
        }
        return this._validate(this._compiledPartial, target, options)
    }


    private _compileIdSchema(): void {
        Guard.assertIsDefined(this._schemaMapId, 'schemaMapId is not specified')
        this._compiledId = joi.object(this._schemaMapId)
    }

    private _compileWholeSchema(): void {
        this._compiledWhole = joi.object({
            // Whole validation does not required ID.
            ...this._optionalize(this._schemaMapId),
            ...this._schemaMapModel,
        })
    }

    private _compilePartialSchema(): void {
        this._compiledPartial = joi.object({
            // Partially validation checks required ID.
            ...this._schemaMapId,
            ...this._optionalize(this._schemaMapModel),
        })
    }

    private _optionalize(schemaMap: joi.SchemaMap): joi.SchemaMap {
        const optionalMap: joi.SchemaMap = {}
        for (const key in schemaMap) {
            const rule = schemaMap[key] as joi.Schema
            /* istanbul ignore else */
            if (typeof rule.optional === 'function') {
                optionalMap[key] = rule.optional()
            }
        }
        return optionalMap
    }

    private _validate(schema: joi.ObjectSchema, target: any, options: ValidationOptions = {}): [ValidationError, T] {
        const opts = {
            ...this._defaultOpts,
            ...options,
        }

        const { error, value } = schema.validate<T>(target, opts)

        return (error) ? [ ValidationError.fromJoi(error.details), null] : [null, value]
    }
}
