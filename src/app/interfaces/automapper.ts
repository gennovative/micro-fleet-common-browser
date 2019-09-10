/*
 * These interfaces are duplicated from automapper.d.ts
 * because they are not exported in original file.
 */

/**
 * Interface for returning an object with available 'sub' functions
 * to enable method chaining (e.g. automapper.createMap().forMember().forMember() ...)
 */
export interface ICreateMapFluentFunctions {
    /**
     * Customize configuration for an individual destination member.
     * @param sourceProperty The destination member property name.
     * @param valueOrFunction The value or function to use for this individual member.
     * @returns {IAutoMapperCreateMapChainingFunctions}
     */
    forMember(sourceProperty: string, valueOrFunction: any |
                    ((opts: IMemberConfigurationOptions) => any) |
                    ((opts: IMemberConfigurationOptions, cb: IMemberCallback) => void)): ICreateMapFluentFunctions

    /**
     * Customize configuration for an individual source member.
     * @param sourceProperty The source member property name.
     * @param sourceMemberConfigFunction The function to use for this individual member.
     * @returns {IAutoMapperCreateMapChainingFunctions}
     */
    forSourceMember(
        sourceProperty: string,
        sourceMemberConfigFunction: ((opts: ISourceMemberConfigurationOptions) => any) |
            ((opts: ISourceMemberConfigurationOptions, cb: IMemberCallback) => void)
    ): ICreateMapFluentFunctions

    /**
     * Customize configuration for all destination members.
     * @param func The function to use for this individual member.
     * @returns {IAutoMapperCreateMapChainingFunctions}
     */
    forAllMembers(func: (destinationObject: any, destinationPropertyName: string, value: any) => void): ICreateMapFluentFunctions

    /**
     * Ignore all members not specified explicitly.
     */
    ignoreAllNonExisting(): ICreateMapFluentFunctions

    /**
     * Skip normal member mapping and convert using a custom type converter (instantiated during mapping).
     * @param typeConverterClassOrFunction The converter class or function to use when converting.
     */
    convertUsing(typeConverterClassOrFunction: ((resolutionContext: IResolutionContext) => any) |
                                                    ((resolutionContext: IResolutionContext, callback: IMapCallback) => void) |
                                                    ITypeConverter |
                                                    (new() => ITypeConverter)): void

    /**
     * Specify to which class type AutoMapper should convert. When specified,
     * AutoMapper will create an instance of the given type, instead of returning a new object literal.
     * @param typeClass The destination type class.
     * @returns {IAutoMapperCreateMapChainingFunctions}
     */
    convertToType(typeClass: new () => any): ICreateMapFluentFunctions

    /**
     * Specify which profile should be used when mapping.
     * @param {string} profileName The profile name.
     * @returns {IAutoMapperCreateMapChainingFunctions}
     */
    withProfile(profileName: string): void
}


/**
 * Configuration options for forMember mapping function.
 */
export interface IMemberConfigurationOptions extends ISourceMemberConfigurationOptions {
    /**
     * Map from a custom source property name.
     * @param sourcePropertyName The source property to map.
     */
    mapFrom(sourcePropertyName: string): void

    /**
     * If specified, the property will only be mapped when the condition is fulfilled.
     */
    condition(predicate: ((sourceObject: any) => boolean)): void
}


/**
 * Configuration options for forSourceMember mapping function.
 */
export interface ISourceMemberConfigurationOptions extends IMappingConfigurationOptions {
    /**
     * When this configuration function is used, the property is ignored
     * when mapping.
     */
    ignore(): void
}


export interface IMappingConfigurationOptions {
    /** The source object to map. */
    sourceObject: any

    /** The source property to map. */
    sourcePropertyName: string

    /**
     * The intermediate destination property value, used for stacking multiple for(Source)Member calls
     * while elaborating the intermediate result.
     */
    intermediatePropertyValue: any
}

/**
 * Member callback interface
 */
export type IMemberCallback = (callbackValue: any) => void


/**
 * Converts source type to destination type instead of normal member mapping
 */
export interface ITypeConverter {
    /**
     * Performs conversion from source to destination type.
     * @param {IResolutionContext} resolutionContext Resolution context.
     * @returns {any} Destination object.
     */
    convert(resolutionContext: IResolutionContext): any
}


/**
 * Context information regarding resolution of a destination value
 */
export interface IResolutionContext {
    /** Source value */
    sourceValue: any

    /** Destination value */
    destinationValue: any

    /** Source property name */
    sourcePropertyName?: string

    /** Destination property name */
    destinationPropertyName?: string

    /** Index of current collection mapping */
    arrayIndex?: number
}


/**
 * Member callback interface
 */
export type IMapCallback = (result: any) => void
