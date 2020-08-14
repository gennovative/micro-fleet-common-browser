"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A model mapper that does nothing other than invoking the validator.
 * The purpose is for convenience in re-using backend DTOs, but not using
 * backend's ModelAutoMapper.
 */
class PassthroughAutoMapper {
    /**
     * @param {class} ModelClass The model class
     * @param {JoiModelValidator} _validator The model validator. If specified, turn on `enableValidation`
     */
    constructor(_validator) {
        this._validator = _validator;
        this.enableValidation = Boolean(_validator);
    }
    /**
     * @see IModelAutoMapper.validator
     */
    get validator() {
        return this._validator;
    }
    /**
     * @see IModelAutoMapper.merge
     */
    merge(dest, sources, options) {
        if (dest == null || typeof dest !== 'object') {
            return dest;
        }
        dest = Object.assign.apply(null, Array.isArray(sources) ? [dest, ...sources] : [dest, sources]);
        return this.partial(dest, options);
    }
    /**
     * @see IModelAutoMapper.partial
     */
    partial(source, options) {
        return this.$tryTranslate('partial', source, options);
    }
    /**
     * @see IModelAutoMapper.partialMany
     */
    partialMany(sources, options) {
        return this.$tryTranslate('partial', sources, options);
    }
    /**
     * @see IModelAutoMapper.whole
     */
    whole(source, options) {
        return this.$tryTranslate('whole', source, options);
    }
    /**
     * @see IModelAutoMapper.wholeMany
     */
    wholeMany(sources, options) {
        return this.$tryTranslate('whole', sources, options);
    }
    $tryTranslate(fn, source, options) {
        if (source == null || typeof source !== 'object') {
            return source;
        }
        options = Object.assign({
            enableValidation: this.enableValidation,
        }, options);
        if (Array.isArray(source)) {
            // return source.map(s => this.$translate(fn, s, options))
            return source.reduce((prev, cur) => {
                const trans = this.$translate(fn, cur, options);
                // Exclude failed translation (in case options.errorCallback is specified)
                if (trans != null) {
                    prev.push(trans);
                }
            }, []);
        }
        return this.$translate(fn, source, options);
    }
    $translate(fn, source, options) {
        if (!options.enableValidation) {
            return Object.assign({}, source);
        }
        const [error, model] = this.validator[fn](source);
        if (!error) {
            return model;
        }
        if (!options.errorCallback) {
            throw error;
        }
        options.errorCallback(error);
        return null;
    }
}
exports.PassthroughAutoMapper = PassthroughAutoMapper;
//# sourceMappingURL=ModelPassthroughMapper.js.map