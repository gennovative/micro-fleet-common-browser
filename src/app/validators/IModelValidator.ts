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
    isCompositePk?: boolean,

    /**
     * Whether to validate PK.
     * This param is IGNORED if param `schemaMapPk` has value.
     * Default to be `false`.
     */
    requirePk?: boolean,

    /**
     * Rule to validate model PK.
     */
    schemaMapPk?: joi.SchemaMap,
}

export interface IModelValidator<T> {

    readonly schemaMap: joi.SchemaMap

    readonly schemaMapPk: joi.SchemaMap

    readonly isCompositePk: boolean


    /**
     * Validates model PK.
     */
    pk(pk: any): [ValidationError, any]

    /**
     * Validates model for creation operation, which doesn't need `pk` property.
     */
    whole(target: any, options?: ValidationOptions): [ValidationError, T]

    /**
     * Validates model for modification operation, which requires `pk` property.
     */
    partial(target: any, options?: ValidationOptions): [ValidationError, Partial<T>]

    /**
     * Must call this method before using `whole` or `partial`,
     * or after `schemaMap` or `schemaMapId` is changed.
     */
    compile(): void

}
