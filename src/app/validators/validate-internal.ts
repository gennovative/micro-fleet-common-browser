import * as joi from '@hapi/joi'

import { JoiModelValidator, JoiModelValidatorConstructorOptions } from './JoiModelValidator'


// This file is for internal use, do not export to (lib)user

export type PropValidationMetadata = {
    type?(): joi.AnySchema;
    rules?: Array<(prev: joi.AnySchema) => joi.AnySchema>,
    rawSchema?: joi.SchemaLike,
}

export type ClassValidationMetadata = JoiModelValidatorConstructorOptions & {
    idProps: Set<string | symbol>,
    props: {
        [key: string]: PropValidationMetadata,
    }
}

const VALIDATE_META = Symbol()

function createClassValidationMetadata(): ClassValidationMetadata {
    return {
        schemaMapId: {},
        schemaMapModel: {},
        props: {},
        idProps: new Set(),
    }
}

export function getClassValidationMetadata(Class: Function): ClassValidationMetadata {
    return Class[VALIDATE_META] || createClassValidationMetadata()
}


export function setClassValidationMetadata(Class: Function, meta: ClassValidationMetadata): void {
    Class[VALIDATE_META] = meta
}


export function deleteClassValidationMetadata(Class: Function): void {
    delete Class[VALIDATE_META]
}


export function getPropValidationMetadata(Class: Function, propName: string | symbol): PropValidationMetadata {
    return getClassValidationMetadata(Class).props[propName as string] || {
        type: () => joi.string(),
        rules: [],
    }
}

export function setPropValidationMetadata(Class: Function, propName: string | symbol, meta: PropValidationMetadata): void {
    const classMeta = getClassValidationMetadata(Class)
    classMeta.props[propName as string] = meta
    setClassValidationMetadata(Class, classMeta)
}


export function createJoiValidator<T>(Class: Function): JoiModelValidator<T> {
    const classMeta = getClassValidationMetadata(Class)
    const [schemaMapId, schemaMapModel] = buildSchemaMapModel(classMeta)
    if (isEmpty(schemaMapId) && isEmpty(schemaMapModel)) {
        return null
    }
    const validator = new JoiModelValidator<T>({
        schemaMapModel,
        schemaMapId,
        joiOptions: classMeta.joiOptions,
    })
    // Clean up
    deleteClassValidationMetadata(Class)
    return validator
}

function buildSchemaMapModel(classMeta: ClassValidationMetadata): [joi.SchemaMap, joi.SchemaMap] {
    // Property decorators can override class schema maps

    // tslint:disable-next-line:prefer-const
    for (let [prop, meta] of Object.entries(classMeta.props)) {
        const propSchema = buildPropSchema(meta)
        if (classMeta.idProps.has(prop)) {
            classMeta.schemaMapId[prop] = propSchema
        }
        else {
            classMeta.schemaMapModel[prop] = propSchema
        }
    }
    return [classMeta.schemaMapId, classMeta.schemaMapModel]
}

function buildPropSchema(propMeta: PropValidationMetadata): joi.AnySchema {
    return Boolean(propMeta.rawSchema)
        ? propMeta.rawSchema as joi.AnySchema
        : propMeta.rules.reduce(
            (prev, curRule) => curRule(prev),
            propMeta.type()
    )
}


function isEmpty(obj: any): boolean {
    return (obj == null) || obj.length === 0 || Object.keys(obj).length == 0
}
