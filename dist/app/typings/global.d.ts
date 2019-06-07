
/**
 * A data type representing Json object.
 */
interface Json {
    [x: string]: string | number | boolean | Date | Json | JsonArray;
}

interface JsonArray extends Array<string | number | boolean | Date | Json | JsonArray> { }

// Based on ES6 native Promise definition
declare type PromiseResolveFn = (value?: any | PromiseLike<any>) => void;
declare type PromiseRejectFn = (reason?: any) => void;

/**
 * A data type representing a class.
 */
declare type Newable<T=any> = (new (...args: any[]) => T);

/**
 * A data type representing Javascript primitive types.
 */
declare type PrimitiveType = string | number | boolean;

/**
 * A data type representing a single-leveled Json-like object.
 */
declare type PrimitiveFlatJson = {
    [x: string]: PrimitiveType
};

declare type FunctionType<T=void> = (...args: any[]) => T;


/**
 * A datatype that presents composite primary key.
 */
declare type TenantPk = {
    id: string,
    tenantId: string,
};
