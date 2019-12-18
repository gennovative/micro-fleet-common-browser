"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("@hapi/joi");
const JoiModelValidator_1 = require("./JoiModelValidator");
const VALIDATE_META = Symbol();
function createClassValidationMetadata() {
    return {
        schemaMapId: {},
        schemaMapModel: {},
        props: {},
        idProps: new Set(),
    };
}
exports.createClassValidationMetadata = createClassValidationMetadata;
function cloneMetadata(source) {
    return {
        schemaMapId: Object.assign({}, source.schemaMapId),
        schemaMapModel: Object.assign({}, source.schemaMapModel),
        props: Object.assign({}, source.props),
        idProps: new Set(source.idProps),
    };
}
function getClassValidationMetadata(Class) {
    let proto = Class.prototype;
    if (proto.hasOwnProperty(VALIDATE_META)) {
        return proto[VALIDATE_META];
    }
    do {
        proto = Object.getPrototypeOf(proto);
        if (proto.hasOwnProperty(VALIDATE_META)) {
            return cloneMetadata(proto[VALIDATE_META]);
        }
    } while (!Object.is(proto, Object.prototype));
    return createClassValidationMetadata();
}
exports.getClassValidationMetadata = getClassValidationMetadata;
function setClassValidationMetadata(Class, meta) {
    Class.prototype[VALIDATE_META] = meta;
}
exports.setClassValidationMetadata = setClassValidationMetadata;
function deleteClassValidationMetadata(Class) {
    delete Class.prototype[VALIDATE_META];
}
exports.deleteClassValidationMetadata = deleteClassValidationMetadata;
// export function getPropValidationMetadata(Class: Function, propName: string | symbol): PropValidationMetadata {
//     return getClassValidationMetadata(Class).props[propName as string] || {
//         type: () => joi.string(),
//         rules: [],
//     }
// }
/**
 * @param classMeta Must be passed to avoid calling costly function `getClassValidationMetadata`
 */
function extractPropValidationMetadata(classMeta, propName, ownerClass) {
    const found = classMeta.props[propName];
    return (found != null && found.ownerClass === ownerClass)
        ? found
        : {
            type: () => joi.string(),
            rules: [],
            ownerClass,
        };
}
exports.extractPropValidationMetadata = extractPropValidationMetadata;
function setPropValidationMetadata(Class, classMeta, propName, propMeta) {
    classMeta = classMeta || getClassValidationMetadata(Class);
    classMeta.props[propName] = propMeta;
    setClassValidationMetadata(Class, classMeta);
}
exports.setPropValidationMetadata = setPropValidationMetadata;
function createJoiValidator(Class, joiOptions) {
    const classMeta = getClassValidationMetadata(Class);
    const [schemaMapId, schemaMapModel] = buildSchemaMapModel(classMeta);
    if (isEmpty(schemaMapId) && isEmpty(schemaMapModel)) {
        // Class doesn't need validating
        return null;
    }
    const validator = new JoiModelValidator_1.JoiModelValidator({
        schemaMapModel,
        schemaMapId,
        joiOptions: joiOptions || classMeta.joiOptions,
    });
    // Clean up
    deleteClassValidationMetadata(Class);
    return validator;
}
exports.createJoiValidator = createJoiValidator;
function buildSchemaMapModel(classMeta) {
    // Property decorators can override class schema maps
    // tslint:disable-next-line:prefer-const
    for (let [prop, meta] of Object.entries(classMeta.props)) {
        const propSchema = buildPropSchema(meta);
        if (classMeta.idProps.has(prop)) {
            classMeta.schemaMapId[prop] = propSchema;
        }
        else {
            classMeta.schemaMapModel[prop] = propSchema;
        }
    }
    return [classMeta.schemaMapId, classMeta.schemaMapModel];
}
function buildPropSchema(propMeta) {
    return Boolean(propMeta.rawSchema)
        ? propMeta.rawSchema
        : propMeta.rules.reduce((prev, curRule) => curRule(prev), propMeta.type());
}
function isEmpty(obj) {
    return (obj == null) || obj.length === 0 || Object.keys(obj).length == 0;
}
//# sourceMappingURL=validate-internal.js.map