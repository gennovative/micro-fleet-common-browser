"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
const Guard_1 = require("../Guard");
const JoiExtended_1 = require("./JoiExtended");
const ValidationError_1 = require("./ValidationError");
class JoiModelValidator {
    /**
     * @param {joi.SchemaMap} _schemaMap Rules to validate model properties.
     * @param {boolean} _isCompositeId Whether the primary key is made of multiple properties. Default to `false`
     *     This param is IGNORED if param `schemaMapId` has value.
     * @param {boolean} requireId Whether to validate ID.
     *     This param is IGNORED if param `schemaMapId` has value.
     * @param {joi.SchemaMap} _schemaMapId Rule to validate model ID.
     */
    constructor(_schemaMap, _isCompositeId = false, requireId, _schemaMapId) {
        this._schemaMap = _schemaMap;
        this._isCompositeId = _isCompositeId;
        this._schemaMapId = _schemaMapId;
        // As default, model ID is a string for 64-bit integer.
        let idSchema = JoiExtended_1.extJoi.genn().bigint().options({ convert: false });
        if (requireId) {
            idSchema = idSchema.required();
        }
        if (_schemaMapId) {
            this._schemaMapId = _schemaMapId;
        }
        else if (_isCompositeId) {
            this._schemaMapId = {
                id: idSchema,
                tenantId: idSchema,
            };
        }
        else {
            this._schemaMapId = { id: idSchema };
            this._compiledId = idSchema;
        }
    }
    /**
     * Builds a new instance of ModelValidatorBase.
     */
    static create({ schemaMapModel, isCompositeId = false, requireId = false, schemaMapId: schemaMapId, }) {
        const validator = new JoiModelValidator(schemaMapModel, isCompositeId, requireId, schemaMapId);
        validator.compile();
        return validator;
    }
    get schemaMap() {
        return this._schemaMap;
    }
    get schemaMapId() {
        return this._schemaMapId;
    }
    get isCompositeId() {
        return this._isCompositeId;
    }
    /**
     * @see IModelValidator.id
     */
    id(id) {
        Guard_1.Guard.assertIsDefined(this._compiledId, 'Must call `compile` before using this function!');
        const { error, value } = this._compiledId.validate(id);
        return (error) ? [ValidationError_1.ValidationError.fromJoi(error.details), null] : [null, value];
    }
    /**
     * @see IModelValidator.whole
     */
    whole(target, options = {}) {
        return this.validate(this._compiledWhole, target, options);
    }
    /**
     * @see IModelValidator.partial
     */
    partial(target, options = {}) {
        return this.validate(this._compiledPartial, target, options);
    }
    /**
     * @see IModelValidator.compile
     */
    compile() {
        if (!this._compiledId) {
            if (this._isCompositeId) {
                this._compiledId = joi.object(this._schemaMapId);
            }
            else {
                // Compile rule for simple ID with only one property
                const idMap = this.schemaMapId;
                for (const key in idMap) {
                    /* istanbul ignore else */
                    if (idMap.hasOwnProperty(key)) {
                        this._compiledId = idMap[key];
                        break; // Only get the first rule
                    }
                }
            }
        }
        const wholeSchema = this._schemaMap;
        this._compiledWhole = joi.object(wholeSchema);
        // Make all rules optional for partial schema.
        const partialSchema = {};
        for (const key in wholeSchema) {
            /* istanbul ignore else */
            if (wholeSchema.hasOwnProperty(key)) {
                const rule = wholeSchema[key];
                /* istanbul ignore else */
                if (typeof rule.optional === 'function') {
                    partialSchema[key] = rule.optional();
                }
            }
        }
        this._compiledPartial = joi.object(partialSchema);
        this._compiledWhole = this._compiledWhole.keys(this._schemaMapId);
        this._compiledPartial = this._compiledPartial.keys(this._schemaMapId);
    }
    validate(schema, target, options = {}) {
        Guard_1.Guard.assertIsDefined(schema, 'Must call `compile` before using this function!');
        const opts = Object.assign({
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        }, options);
        const { error, value } = schema.validate(target, opts);
        return (error) ? [ValidationError_1.ValidationError.fromJoi(error.details), null] : [null, value];
    }
}
exports.JoiModelValidator = JoiModelValidator;
//# sourceMappingURL=JoiModelValidator.js.map