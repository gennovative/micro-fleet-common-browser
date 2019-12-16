"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModelPassthroughMapper_1 = require("../translators/ModelPassthroughMapper");
const validate_internal_1 = require("../validators/validate-internal");
const TRANSLATOR = Symbol();
const VALIDATOR = Symbol();
class Translatable {
    static getTranslator() {
        let translator;
        if (!this.hasOwnProperty(TRANSLATOR)) {
            translator = this.$createTranslator();
            this[TRANSLATOR] = translator;
        }
        else {
            translator = this[TRANSLATOR];
        }
        return translator;
    }
    static $createTranslator() {
        return new ModelPassthroughMapper_1.PassthroughAutoMapper(this.getValidator());
    }
    static getValidator() {
        let validator;
        // "validator" may be `null` when class doesn't need validating
        // if (validator === undefined) {
        if (!this.hasOwnProperty(VALIDATOR)) {
            validator = this.$createValidator();
            this[VALIDATOR] = validator;
        }
        else {
            validator = this[VALIDATOR];
        }
        return validator;
    }
    static $createValidator() {
        return validate_internal_1.createJoiValidator(this);
    }
    static from(source, options = {}) {
        return this.getTranslator().whole(source, options);
    }
    static fromMany(source, options = {}) {
        return this.getTranslator().wholeMany(source, options);
    }
}
exports.Translatable = Translatable;
/**
 * Used to decorate model class to equip same functionalities as extending class `Translatable`.
 */
function translatable() {
    return function (TargetClass) {
        copyStatic(Translatable, TargetClass, ['getTranslator', '$createTranslator', 'getValidator', '$createValidator', 'from', 'fromMany']);
    };
}
exports.translatable = translatable;
function copyStatic(SrcClass, DestClass, props = []) {
    props.forEach(p => {
        if (!DestClass[p]) {
            DestClass[p] = SrcClass[p].bind(DestClass);
        }
    });
}
//# sourceMappingURL=Translatable.js.map