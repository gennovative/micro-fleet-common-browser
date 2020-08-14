import * as joi from '@hapi/joi'

import { JoiModelValidator, JoiModelValidatorConstructorOptions, ValidationOptions } from './JoiModelValidator'


// This file is for internal use, do not export to (lib)user

export type PropValidationMetadata = {
    ownerClass: any,
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

export function createClassValidationMetadata(): ClassValidationMetadata {
    return {
        schemaMapId: {},
        schemaMapModel: {},
        props: {},
        idProps: new Set(),
    }
}

function cloneMetadata(source: ClassValidationMetadata): ClassValidationMetadata {
    return {
        schemaMapId: { ...source.schemaMapId },
        schemaMapModel: { ...source.schemaMapModel },
        props: { ...source.props },
        idProps: new Set(source.idProps),
    }
}

export function getClassValidationMetadata(Class: Function): ClassValidationMetadata {
    let proto = Class.prototype
    if (proto.hasOwnProperty(VALIDATE_META)) {
        return proto[VALIDATE_META]
    }

    do {
        proto = Object.getPrototypeOf(proto)
        if (proto.hasOwnProperty(VALIDATE_META)) {
            return cloneMetadata(proto[VALIDATE_META])
        }
    } while (!Object.is(proto, Object.prototype))

    return createClassValidationMetadata()
}


export function setClassValidationMetadata(Class: Function, meta: ClassValidationMetadata): void {
    Class.prototype[VALIDATE_META] = meta
}


export function deleteClassValidationMetadata(Class: Function): void {
    delete Class.prototype[VALIDATE_META]
}


// export function getPropValidationMetadata(Class: Function, propName: string | symbol): PropValidationMetadata {
//     return getClassValidationMetadata(Class).props[propName as string] || {
//         type: () => joi.string(),
//         rules: [],
//     }
// }

/**
 * @param classMeta Must be passed to avoid calling costly function `getClassValidationMetadata`
 */

export function extractPropValidationMetadata(
    classMeta: ClassValidationMetadata, propName: string | symbol, ownerClass: any,
): PropValidationMetadata {
    const found = classMeta.props[propName as string]
    return (found != null && found.ownerClass === ownerClass)
        ? found
        : {
            type: () => joi.string(),
            rules: [],
            ownerClass,
        }
}

export function setPropValidationMetadata(
    Class: Function, classMeta: ClassValidationMetadata,
    propName: string | symbol, propMeta: PropValidationMetadata,
): void {
    classMeta = classMeta || getClassValidationMetadata(Class)
    classMeta.props[propName as string] = propMeta
    setClassValidationMetadata(Class, classMeta)
}


export function createJoiValidator<T>(
    Class: Function,
    joiOptions?: ValidationOptions,
): JoiModelValidator<T> {
    const classMeta = getClassValidationMetadata(Class)
    const [schemaMapId, schemaMapModel] = buildSchemaMapModel(classMeta)
    if (isEmpty(schemaMapId) && isEmpty(schemaMapModel)) {
        // Class doesn't need validating
        return null
    }
    const validator = new JoiModelValidator<T>({
        schemaMapModel,
        schemaMapId,
        joiOptions: joiOptions || classMeta.joiOptions,
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
