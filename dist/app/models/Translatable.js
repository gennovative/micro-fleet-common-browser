"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_internal_1 = require("../validators/validate-internal");
const VALIDATOR = Symbol();
class Translatable {
    static getValidator() {
        let validator = this[VALIDATOR];
        // "validator" may be `null` when class doesn't need validating
        if (validator === undefined) {
            validator = this.$createValidator();
            this[VALIDATOR] = validator;
        }
        return validator;
    }
    static $createValidator() {
        return validate_internal_1.createJoiValidator(this);
    }
    static from(source) {
        return this.getValidator().whole(source);
    }
    static fromMany(source) {
        if (!source) {
            return null;
        }
        const errors = [];
        const values = [];
        // tslint:disable-next-line: prefer-const
        for (let s of source) {
            const [error, value] = this.getValidator().whole(s);
            error && errors.push(error);
            value && values.push(value);
        }
        return [errors, values];
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
/*
function getTranslator<T>(TargetClass: Newable<T>): IModelAutoMapper<T> {
    let translator = Reflect.getMetadata(TRANSLATOR, TargetClass)
    if (!translator) {
        translator = createTranslator<T>(TargetClass)
        Reflect.defineMetadata(TRANSLATOR, translator, TargetClass)
    }
    return Reflect.getMetadata(TRANSLATOR, TargetClass)
}

function createTranslator<T>(TargetClass: Newable<T>): IModelAutoMapper<T> {
    return new ModelAutoMapper(TargetClass, getValidator<T>(TargetClass))
}

function getValidator<T>(TargetClass: Newable<T>): IModelValidator<T> {
    let validator = Reflect.getMetadata(VALIDATOR, TargetClass)
    // "validator" may be `null` when class doesn't need validating
    if (validator === undefined) {
        validator = createValidator(TargetClass)
        Reflect.defineMetadata(VALIDATOR, validator, TargetClass)
    }
    return validator
}

function createValidator<T>(TargetClass: Newable<T>): IModelValidator<T> {
    return createJoiValidator(TargetClass)
}

function from<T>(TargetClass: Newable<T>, source: object): T {
    return getTranslator<T>(TargetClass).whole(source)
}

function fromMany<T>(TargetClass: Newable<T>, source: object[]): T[] {
    return getTranslator<T>(TargetClass).wholeMany(source)
}
//*/
//# sourceMappingURL=Translatable.js.map