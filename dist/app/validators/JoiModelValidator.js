"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("@hapi/joi");
const Guard_1 = require("../Guard");
const ValidationError_1 = require("./ValidationError");
class JoiModelValidator {
    constructor(options) {
        this._defaultOpts = Object.assign({ abortEarly: false, allowUnknown: true, stripUnknown: true }, options.joiOptions);
        this._schemaMapId = options.schemaMapId;
        Guard_1.Guard.assertIsTruthy(options.schemaMapModel || options.rawSchema, 'Either "schemaMapModel" or "rawSchema" option must be specified.');
        this._schemaMapModel = options.schemaMapModel;
        this._rawSchema = options.rawSchema;
    }
    get schemaMapModel() {
        return this._schemaMapModel;
    }
    get schemaMapId() {
        return this._schemaMapId;
    }
    /**
     * @see IModelValidator.id
     */
    id(id) {
        if (!this._compiledId) {
            this._compileIdSchema();
        }
        const { error, value } = this._compiledId.validate(id);
        return (error) ? [ValidationError_1.ValidationError.fromJoi(error), null] : [null, value];
    }
    /**
     * @see IModelValidator.whole
     */
    whole(target, options = {}) {
        if (!this._compiledWhole) {
            this._compileWholeSchema();
        }
        return this._validate(this._compiledWhole, target, options);
    }
    /**
     * @see IModelValidator.partial
     */
    partial(target, options = {}) {
        if (!this._compiledPartial) {
            this._compilePartialSchema();
        }
        return this._validate(this._compiledPartial, target, options);
    }
    _compileIdSchema() {
        Guard_1.Guard.assertIsDefined(this._schemaMapId, 'schemaMapId is not specified');
        this._compiledId = joi.object(this._schemaMapId);
    }
    _compileWholeSchema() {
        this._compiledWhole = this._rawSchema || joi.object(Object.assign(Object.assign({}, this._optionalize(this._schemaMapId)), this._schemaMapModel));
    }
    _compilePartialSchema() {
        this._compiledPartial = this._rawSchema || joi.object(Object.assign(Object.assign({}, this._schemaMapId), this._optionalize(this._schemaMapModel)));
    }
    _optionalize(schemaMap) {
        const optionalMap = {};
        for (const key in schemaMap) {
            const rule = schemaMap[key];
            /* istanbul ignore else */
            if (typeof rule.optional === 'function') {
                optionalMap[key] = rule.optional();
            }
        }
        return optionalMap;
    }
    _validate(schema, target, options = {}) {
        const opts = Object.assign(Object.assign({}, this._defaultOpts), options);
        const { error, value } = schema.validate(target, opts);
        return (error) ? [ValidationError_1.ValidationError.fromJoi(error), null] : [null, value];
    }
}
exports.JoiModelValidator = JoiModelValidator;
//# sourceMappingURL=JoiModelValidator.js.map