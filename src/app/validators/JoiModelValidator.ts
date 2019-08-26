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
            schemaMapModel, isCompositeId = false, requireId = false, schemaMapId: schemaMapId,
        }: JoiModelValidatorCreateOptions): JoiModelValidator<T> {
            const validator = new JoiModelValidator<T>(schemaMapModel, isCompositeId, requireId, schemaMapId)
            validator.compile()
            return validator
    }


    /**
     * Compiled rules for model ID.
     */
    protected _compiledId: joi.ObjectSchema

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
     * @param {boolean} _isCompositeId Whether the primary key is made of multiple properties. Default to `false`
     *     This param is IGNORED if param `schemaMapId` has value.
     * @param {boolean} requireId Whether to validate ID.
     *     This param is IGNORED if param `schemaMapId` has value.
     * @param {joi.SchemaMap} _schemaMapId Rule to validate model ID.
     */
    protected constructor(
        protected _schemaMap: joi.SchemaMap,
        protected _isCompositeId: boolean = false,
        requireId: boolean,
        protected _schemaMapId?: joi.SchemaMap,
    ) {
        // As default, model ID is a string for 64-bit integer.
        let idSchema = extJoi.genn().bigint().options({convert: false})
        if (requireId) {
            idSchema = idSchema.required()
        }

        if (_schemaMapId) {
            this._schemaMapId = _schemaMapId
        } else if (_isCompositeId) {
            this._schemaMapId = {
                id: idSchema,
                tenantId: idSchema,
            }
        } else {
            this._schemaMapId = { id: idSchema }
            this._compiledId = <any>idSchema
        }
    }


    public get schemaMap(): joi.SchemaMap {
        return this._schemaMap
    }

    public get schemaMapId(): joi.SchemaMap {
        return this._schemaMapId
    }

    public get isCompositeId(): boolean {
        return this._isCompositeId
    }


    /**
     * @see IModelValidator.id
     */
    public id(id: any): [ValidationError, any] {
        Guard.assertIsDefined(this._compiledId, 'Must call `compile` before using this function!')
        const { error, value } = this._compiledId.validate<any>(id)
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

        if (!this._compiledId) {
            if (this._isCompositeId) {
                this._compiledId = joi.object(this._schemaMapId)
            } else {
                // Compile rule for simple ID with only one property
                const idMap = this.schemaMapId
                for (const key in idMap) {
                    /* istanbul ignore else */
                    if (idMap.hasOwnProperty(key)) {
                        this._compiledId = idMap[key] as joi.ObjectSchema
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

        this._compiledWhole = this._compiledWhole.keys(this._schemaMapId)
        this._compiledPartial = this._compiledPartial.keys(this._schemaMapId)
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
