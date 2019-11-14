"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("@hapi/joi");
const cloneDeep = require("lodash.clonedeep");
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
function getClassValidationMetadata(Class) {
    let proto = Class.prototype;
    do {
        if (proto.hasOwnProperty(VALIDATE_META)) {
            return cloneDeep(proto[VALIDATE_META]);
        }
        proto = Object.getPrototypeOf(proto);
    } while (proto != Object.prototype);
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
function getPropValidationMetadata(Class, propName) {
    return getClassValidationMetadata(Class).props[propName] || {
        type: () => joi.string(),
        rules: [],
    };
}
exports.getPropValidationMetadata = getPropValidationMetadata;
function setPropValidationMetadata(Class, propName, meta) {
    const classMeta = getClassValidationMetadata(Class);
    classMeta.props[propName] = meta;
    setClassValidationMetadata(Class, classMeta);
}
exports.setPropValidationMetadata = setPropValidationMetadata;
function createJoiValidator(Class) {
    const classMeta = getClassValidationMetadata(Class);
    const [schemaMapId, schemaMapModel] = buildSchemaMapModel(classMeta);
    if (isEmpty(schemaMapId) && isEmpty(schemaMapModel)) {
        return null;
    }
    const validator = new JoiModelValidator_1.JoiModelValidator({
        schemaMapModel,
        schemaMapId,
        joiOptions: classMeta.joiOptions,
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