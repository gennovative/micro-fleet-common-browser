import { ICreateMapFluentFunctions } from '../interfaces/automapper'
import { IModelValidator } from '../validators/IModelValidator'
import { ValidationError } from '../validators/ValidationError'


export interface MappingOptions {
    /**
     * Temporarily turns on or off model validation.
     * Can only be turned on if validator is provided to constructor.
     */
    enableValidation?: boolean

    /**
     * If specified, gives validation error to this callback. Otherwise, throw error.
     */
    errorCallback?: (err: ValidationError) => void
}


export interface IModelAutoMapper<T extends Object> {

    /**
     * Turns on or off model validation before translating.
     * Is set to `true` if validator is passed to class constructor.
     */
    enableValidation: boolean

    /**
     * Gets the internal AutoMapper instance for advanced configuration.
     */
    readonly internalMapper: ICreateMapFluentFunctions

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
