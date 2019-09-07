"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
const JoiModelValidator_1 = require("./JoiModelValidator");
const VALIDATE_META = Symbol();
function getClassValidationMetadata(Class) {
    return Class[VALIDATE_META] || { schemaMapModel: {}, props: {}, idProps: new Set() };
}
exports.getClassValidationMetadata = getClassValidationMetadata;
function setClassValidationMetadata(Class, meta) {
    Class[VALIDATE_META] = meta;
}
exports.setClassValidationMetadata = setClassValidationMetadata;
function deleteClassValidationMetadata(Class) {
    delete Class[VALIDATE_META];
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
    const schemaMapId = {};
    const schemaMapModel = {};
    const hasMapId = !isEmpty(classMeta.schemaMapId);
    const hasMapModel = !isEmpty(classMeta.schemaMapModel);
    // Decorator @validateClass() overrides all property decorators
    if (hasMapId && hasMapModel) {
        return [classMeta.schemaMapId, classMeta.schemaMapModel];
    }
    // Build schema maps from property decorators
    // tslint:disable-next-line:prefer-const
    for (let [prop, meta] of Object.entries(classMeta.props)) {
        const propSchema = buildPropSchema(meta);
        if (classMeta.idProps.has(prop)) {
            schemaMapId[prop] = propSchema;
        }
        else {
            schemaMapModel[prop] = propSchema;
        }
    }
    return [
        hasMapId ? classMeta.schemaMapId : schemaMapId,
        hasMapModel ? classMeta.schemaMapModel : schemaMapModel,
    ];
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