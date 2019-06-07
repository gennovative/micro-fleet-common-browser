"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
const Guard_1 = require("../Guard");
const JoiExtended_1 = require("./JoiExtended");
const ValidationError_1 = require("./ValidationError");
class JoiModelValidator {
    /**
     * @param {joi.SchemaMap} _schemaMap Rules to validate model properties.
     * @param {boolean} _isCompositePk Whether the primary key is made of multiple properties. Default to `false`
     *     This param is IGNORED if param `schemaMapPk` has value.
     * @param {boolean} requirePk Whether to validate ID.
     *     This param is IGNORED if param `schemaMapPk` has value.
     * @param {joi.SchemaMap} _schemaMapId Rule to validate model PK.
     */
    constructor(_schemaMap, _isCompositePk = false, requirePk, _schemaMapPk) {
        this._schemaMap = _schemaMap;
        this._isCompositePk = _isCompositePk;
        this._schemaMapPk = _schemaMapPk;
        // As default, model ID is a 64-bit integer.
        let idSchema = JoiExtended_1.extJoi.genn().bigint();
        if (requirePk) {
            idSchema = idSchema.required();
        }
        if (_schemaMapPk) {
            this._schemaMapPk = _schemaMapPk;
        }
        else if (_isCompositePk) {
            this._schemaMapPk = {
                id: idSchema,
                tenantId: idSchema,
            };
        }
        else {
            this._schemaMapPk = { id: idSchema };
            this._compiledPk = idSchema;
        }
    }
    /**
     * Builds a new instance of ModelValidatorBase.
     */
    static create({ schemaMapModel, isCompositePk = false, requirePk = false, schemaMapPk, }) {
        const validator = new JoiModelValidator(schemaMapModel, isCompositePk, requirePk, schemaMapPk);
        validator.compile();
        return validator;
    }
    get schemaMap() {
        return this._schemaMap;
    }
    get schemaMapPk() {
        return this._schemaMapPk;
    }
    get isCompositePk() {
        return this._isCompositePk;
    }
    /**
     * @see IModelValidator.pk
     */
    pk(pk) {
        Guard_1.Guard.assertIsDefined(this._compiledPk, 'Must call `compile` before using this function!');
        const { error, value } = this._compiledPk.validate(pk);
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
        if (!this._compiledPk) {
            if (this._isCompositePk) {
                this._compiledPk = joi.object(this._schemaMapPk);
            }
            else {
                // Compile rule for simple PK with only one property
                const idMap = this.schemaMapPk;
                for (const key in idMap) {
                    /* istanbul ignore else */
                    if (idMap.hasOwnProperty(key)) {
                        this._compiledPk = idMap[key];
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
        this._compiledWhole = this._compiledWhole.keys(this._schemaMapPk);
        this._compiledPartial = this._compiledPartial.keys(this._schemaMapPk);
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