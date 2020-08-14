import { IModelValidator } from '../validators/JoiModelValidator'
import { ValidationError } from '../validators/ValidationError'


export type MappingOptions = {
    /**
     * Temporarily turns on or off model validation.
     * Can only be turned on if validator is provided to constructor.
     */
    enableValidation?: boolean

    /**
     * If specified, gives validation error to this callback. Otherwise, throw error.
     */
    errorCallback?(err: ValidationError): void
}


export interface IModelAutoMapper<T extends Object> {

    /**
     * Turns on or off model validation before translating.
     * Is set to `true` if validator is passed to class constructor.
     */
    enableValidation: boolean

    /**
     * Gets the validator.
     */
    readonly validator: IModelValidator<T>

    /**
     * Copies properties from `sources` to dest then optionally validates
     * the result (depends on `enableValidation`).
     * If `enableValidation` is turned off, it works just like native `Object.assign()` function,
     * therefore, use `Object.assign()` for better performance if validation is not needed.
     * Note that it uses `partial()` internally, hence `required` validation is IGNORED.
     *
     * @throws {ValidationError}
     */
    merge(dest: Partial<T>, sources: Partial<T> | Partial<T>[], options?: MappingOptions): Partial<T>

    /**
     * Validates then converts an object to type <T>.
     * but ONLY properties with value are validated and copied.
     * Note that `required` validation is IGNORED.
     * @param {object} source The object to be translated.
     *
     * @throws {ValidationError} If no `errorCallback` is provided.
     */
    partial(source: object, options?: MappingOptions): Partial<T>

    /**
     * Validates then converts a list of objects to type <T>.
     * but ONLY properties with value are validated and copied.
     * Note that `required` validation is IGNORED.
     * @param {object[]} sources A list of objects to be translated.
     *
     * @throws {ValidationError} If no `errorCallback` is provided.
     */
    partialMany(sources: object[], options?: MappingOptions): Partial<T>[]

    /**
     * Validates then converts an object to type <T>.
     * ALL properties are validated and copied regardless with or without value.
     * @param {object} source The object to be translated.
     *
     * @throws {ValidationError} If no `errorCallback` is provided.
     */
    whole(source: object, options?: MappingOptions): T

    /**
     * Validates then converts a list of objects to type <T>.
     * ALL properties are validated and copied regardless with or without value.
     * @param {object[]} sources The list of objects to be translated.
     *
     * @throws {ValidationError} If no `errorCallback` is provided.
     */
    wholeMany(sources: object[], options?: MappingOptions): T[]
}


/**
 * A model mapper that does nothing other than invoking the validator.
 * The purpose is for convenience in re-using backend DTOs, but not using
 * backend's ModelAutoMapper.
 */
export class PassthroughAutoMapper<T extends Object>
        implements IModelAutoMapper<T> {

    /**
     * @see IModelAutoMapper.enableValidation
     */
    public enableValidation: boolean

    /**
     * @param {class} ModelClass The model class
     * @param {JoiModelValidator} _validator The model validator. If specified, turn on `enableValidation`
     */
    constructor(
        protected _validator?: IModelValidator<T>
    ) {
        this.enableValidation = Boolean(_validator)
    }


    /**
     * @see IModelAutoMapper.validator
     */
    public get validator(): IModelValidator<T> {
        return this._validator
    }

    /**
     * @see IModelAutoMapper.merge
     */
    public merge(dest: Partial<T>, sources: Partial<T> | Partial<T>[], options?: MappingOptions): Partial<T> {
        if (dest == null || typeof dest !== 'object') { return dest }
        dest = Object.assign.apply(null, Array.isArray(sources) ? [dest, ...sources] : [dest, sources])
        return this.partial(dest, options) as Partial<T>
    }

    /**
     * @see IModelAutoMapper.partial
     */
    public partial(source: object, options?: MappingOptions): Partial<T> {
        return this.$tryTranslate('partial', source, options) as Partial<T>
    }

    /**
     * @see IModelAutoMapper.partialMany
     */
    public partialMany(sources: object[], options?: MappingOptions): Partial<T>[] {
        return this.$tryTranslate('partial', sources, options) as Partial<T>[]
    }

    /**
     * @see IModelAutoMapper.whole
     */
    public whole(source: object, options?: MappingOptions): T {
        return this.$tryTranslate('whole', source, options) as T
    }

    /**
     * @see IModelAutoMapper.wholeMany
     */
    public wholeMany(sources: object[], options?: MappingOptions): T[] {
        return this.$tryTranslate('whole', sources, options) as T[]
    }


    protected $tryTranslate(fn: string, source: any | any[], options?: MappingOptions): T | T[] {
        if (source == null || typeof source !== 'object') { return source }

        options = Object.assign(<MappingOptions>{
            enableValidation: this.enableValidation,
        }, options)

        if (Array.isArray(source)) {
            // return source.map(s => this.$translate(fn, s, options))
            return source.reduce(
                (prev, cur) => {
                    const trans = this.$translate(fn, cur, options)
                    // Exclude failed translation (in case options.errorCallback is specified)
                    if (trans != null) {
                        prev.push(trans)
                    }
                },
                [],
            )
        }
        return this.$translate(fn, source, options)
    }

    protected $translate(fn: string, source: any, options: MappingOptions): T {
        if (!options.enableValidation) {
            return Object.assign({}, source)
        }

        const [error, model] = this.validator[fn](source)

        if (!error) {
            return model
        }

        if (!options.errorCallback) {
            throw error
        }
        options.errorCallback(error)
        return null
    }

}
