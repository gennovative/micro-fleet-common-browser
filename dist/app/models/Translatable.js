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
        if (!this.hasOwnProperty(VALIDATOR)) {
            validator = this.$createValidator();
            this[VALIDATOR] = validator;
        }
        else {
            validator = this[VALIDATOR];
        }
        return validator;
    }
    static $createValidator(options) {
        return validate_internal_1.createJoiValidator(this, options);
    }
    /**
     * Converts arbitrary object into instance of this class type.
     *
     * If no class property is marked for validation, all properties are copied.
     *
     * If just some class properties are marked for validation, they are validated then copied, the rest are ignored.
     */
    static from(source, options = {}) {
        return this.getTranslator().whole(source, options);
    }
    /**
     * Converts array of arbitrary objects into array of instances of this class type.
     * Conversion rule is same as `from()` method.
     */
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