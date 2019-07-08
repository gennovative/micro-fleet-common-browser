import * as joi from 'joi'

import { Guard } from '../Guard'
import { extJoi } from './JoiExtended'
import { IModelValidator, JoiModelValidatorCreateOptions,
    ValidationOptions } from './IModelValidator'
import { ValidationError } from './ValidationError'


export class JoiModelValidator<T>
        implements IModelValidator<T> {

    /**
     * Builds a new instance of ModelValidatorBase.
     */
    public static create<T>({
            schemaMapModel, isCompositePk = false, requirePk = false, schemaMapPk,
        }: JoiModelValidatorCreateOptions): JoiModelValidator<T> {
            const validator = new JoiModelValidator<T>(schemaMapModel, isCompositePk, requirePk, schemaMapPk)
            validator.compile()
            return validator
    }


    /**
     * Compiled rules for model primary key.
     */
    protected _compiledPk: joi.ObjectSchema

    /**
     * Compiled rules for model properties.
     */
    protected _compiledWhole: joi.ObjectSchema

    /**
     * Compiled rules for model properties, but all of them are OPTIONAL.
     * Used for patch operation.
     */
    protected _compiledPartial: joi.ObjectSchema


    /**
     * @param {joi.SchemaMap} _schemaMap Rules to validate model properties.
     * @param {boolean} _isCompositePk Whether the primary key is made of multiple properties. Default to `false`
     *     This param is IGNORED if param `schemaMapPk` has value.
     * @param {boolean} requirePk Whether to validate ID.
     *     This param is IGNORED if param `schemaMapPk` has value.
     * @param {joi.SchemaMap} _schemaMapId Rule to validate model PK.
     */
    protected constructor(
        protected _schemaMap: joi.SchemaMap,
        protected _isCompositePk: boolean = false,
        requirePk: boolean,
        protected _schemaMapPk?: joi.SchemaMap,
    ) {
        // As default, model ID is a string for 64-bit integer.
        let idSchema = extJoi.genn().bigint().options({convert: false})
        if (requirePk) {
            idSchema = idSchema.required()
        }

        if (_schemaMapPk) {
            this._schemaMapPk = _schemaMapPk
        } else if (_isCompositePk) {
            this._schemaMapPk = {
                id: idSchema,
                tenantId: idSchema,
            }
        } else {
            this._schemaMapPk = { id: idSchema }
            this._compiledPk = <any>idSchema
        }
    }


    public get schemaMap(): joi.SchemaMap {
        return this._schemaMap
    }

    public get schemaMapPk(): joi.SchemaMap {
        return this._schemaMapPk
    }

    public get isCompositePk(): boolean {
        return this._isCompositePk
    }


    /**
     * @see IModelValidator.pk
     */
    public pk(pk: any): [ValidationError, any] {
        Guard.assertIsDefined(this._compiledPk, 'Must call `compile` before using this function!')
        const { error, value } = this._compiledPk.validate<any>(pk)
        return (error) ? [ ValidationError.fromJoi(error.details), null] : [null, value]
    }

    /**
     * @see IModelValidator.whole
     */
    public whole(target: any, options: ValidationOptions = {}): [ValidationError, T] {
        return this.validate(this._compiledWhole, target, options)
    }

    /**
     * @see IModelValidator.partial
     */
    public partial(target: any, options: ValidationOptions = {}): [ValidationError, Partial<T>] {
        return this.validate(this._compiledPartial, target, options)
    }

    /**
     * @see IModelValidator.compile
     */
    public compile(): void {

        if (!this._compiledPk) {
            if (this._isCompositePk) {
                this._compiledPk = joi.object(this._schemaMapPk)
            } else {
                // Compile rule for simple PK with only one property
                const idMap = this.schemaMapPk
                for (const key in idMap) {
                    /* istanbul ignore else */
                    if (idMap.hasOwnProperty(key)) {
                        this._compiledPk = idMap[key] as joi.ObjectSchema
                        break // Only get the first rule
                    }
                }
            }
        }

        const wholeSchema = this._schemaMap
        this._compiledWhole = joi.object(wholeSchema)

        // Make all rules optional for partial schema.
        const partialSchema: joi.SchemaMap = {}
        for (const key in wholeSchema) {
            /* istanbul ignore else */
            if (wholeSchema.hasOwnProperty(key)) {
                const rule = wholeSchema[key] as joi.Schema
                /* istanbul ignore else */
                if (typeof rule.optional === 'function') {
                    partialSchema[key] = rule.optional()
                }
            }
        }
        this._compiledPartial = joi.object(partialSchema)

        this._compiledWhole = this._compiledWhole.keys(this._schemaMapPk)
        this._compiledPartial = this._compiledPartial.keys(this._schemaMapPk)
    }

    protected validate(schema: joi.ObjectSchema, target: any, options: ValidationOptions = {}): [ValidationError, T] {
        Guard.assertIsDefined(schema, 'Must call `compile` before using this function!')

        const opts = Object.assign({
                abortEarly: false,
                allowUnknown: true,
                stripUnknown: true,
            }, options)

        const { error, value } = schema.validate<T>(target, opts)

        return (error) ? [ ValidationError.fromJoi(error.details), null] : [null, value]
    }
}
