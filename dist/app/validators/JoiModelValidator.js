"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
const Guard_1 = require("../Guard");
const ValidationError_1 = require("./ValidationError");
class JoiModelValidator {
    constructor(options) {
        this._defaultOpts = Object.assign({ abortEarly: false, allowUnknown: true, stripUnknown: true }, options.joiOptions);
        this._schemaMapId = options.schemaMapId;
        this._schemaMapModel = options.schemaMapModel;
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
        return (error) ? [ValidationError_1.ValidationError.fromJoi(error.details), null] : [null, value];
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
        // Whole validation does not check required ID.
        this._compiledWhole = joi.object(this._schemaMapModel);
    }
    _compilePartialSchema() {
        const wholeSchema = this._schemaMapModel;
        // Make all rules optional for partial schema.
        const partialSchema = Object.assign({}, this._schemaMapId);
        for (const key in wholeSchema) {
            const rule = wholeSchema[key];
            /* istanbul ignore else */
            if (typeof rule.optional === 'function') {
                partialSchema[key] = rule.optional();
            }
        }
        this._compiledPartial = joi.object(partialSchema);
    }
    _validate(schema, target, options = {}) {
        const opts = Object.assign({}, this._defaultOpts, options);
        const { error, value } = schema.validate(target, opts);
        return (error) ? [ValidationError_1.ValidationError.fromJoi(error.details), null] : [null, value];
    }
}
exports.JoiModelValidator = JoiModelValidator;
//# sourceMappingURL=JoiModelValidator.js.map