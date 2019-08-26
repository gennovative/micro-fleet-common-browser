import * as joi from 'joi'

import { ValidationError } from './ValidationError'


export interface ValidationOptions extends joi.ValidationOptions {
    // Re-brand this interface
}

export type JoiModelValidatorCreateOptions = {
    /**
     * Rules to validate model properties.
     */
    schemaMapModel: joi.SchemaMap,

    /**
     * Whether the primary key is composite. Default to `false`.
     * This param is IGNORED if param `schemaMapPk` has value.
     */
    isCompositeId?: boolean,

    /**
     * Whether to validate PK.
     * This param is IGNORED if param `schemaMapPk` has value.
     * Default to be `false`.
     */
    requireId?: boolean,

    /**
     * Rule to validate model PK.
     */
    schemaMapId?: joi.SchemaMap,
}

export interface IModelValidator<T> {

    readonly schemaMap: joi.SchemaMap

    readonly schemaMapId: joi.SchemaMap

    readonly isCompositeId: boolean


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

    /**
     * Must call this method before using `whole` or `partial`,
     * or after `schemaMap` or `schemaMapId` is changed.
     */
    compile(): void

}
