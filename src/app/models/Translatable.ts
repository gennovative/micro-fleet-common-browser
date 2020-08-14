import { PassthroughAutoMapper, IModelAutoMapper, MappingOptions } from '../translators/ModelPassthroughMapper'
import { IModelValidator } from '../validators/JoiModelValidator'
import { createJoiValidator } from '../validators/validate-internal'
import { ValidationOptions } from '@hapi/joi'


export interface ITranslatable<T = any> {
    getValidator(): IModelValidator<T>
    from(source: object): T
    fromMany(source: object[]): Array<T>
}



/**
 * A data type representing a class.
 */
type Newable<T = any> = (new (...args: any[]) => T)

type TranslatableClass<U> = Newable<U> & typeof Translatable

const TRANSLATOR = Symbol()
const VALIDATOR = Symbol()

export abstract class Translatable {
    public static getTranslator<TT extends Translatable>(this: TranslatableClass<TT>): IModelAutoMapper<TT> {
        let translator
        if (!this.hasOwnProperty(TRANSLATOR)) {
            translator = this.$createTranslator<TT>()
            this[TRANSLATOR] = translator
        }
        else {
            translator = this[TRANSLATOR]
        }
        return translator
    }

    protected static $createTranslator<TT extends Translatable>(this: TranslatableClass<TT>): IModelAutoMapper<TT> {
        return new PassthroughAutoMapper(this.getValidator<TT>())
    }

    public static getValidator<VT extends Translatable>(this: TranslatableClass<VT>): IModelValidator<VT> {
        let validator
        if (!this.hasOwnProperty(VALIDATOR)) {
            validator = this.$createValidator()
            this[VALIDATOR] = validator
        }
        else {
            validator = this[VALIDATOR]
        }
        return validator
    }

    protected static $createValidator<VT extends Translatable>(
        this: TranslatableClass<VT>,
        options?: ValidationOptions,
    ): IModelValidator<VT> {
        return createJoiValidator(this, options)
    }

    /**
     * Converts arbitrary object into instance of this class type.
     *
     * If no class property is marked for validation, all properties are copied.
     *
     * If just some class properties are marked for validation, they are validated then copied, the rest are ignored.
     */
    public static from<FT extends Translatable>(this: TranslatableClass<FT>, source: object, options: MappingOptions = {}): FT {
        return this.getTranslator<FT>().whole(source, options)
    }

    /**
     * Converts array of arbitrary objects into array of instances of this class type.
     * Conversion rule is same as `from()` method.
     */
    public static fromMany<FT extends Translatable>(this: TranslatableClass<FT>, source: object[], options: MappingOptions = {}): FT[] {
        return this.getTranslator<FT>().wholeMany(source, options)
    }

}


/**
 * Used to decorate model class to equip same functionalities as extending class `Translatable`.
 */
export function translatable(): ClassDecorator {
    return function (TargetClass: Function): void {
        copyStatic(Translatable, TargetClass,
            ['getTranslator', '$createTranslator', 'getValidator', '$createValidator', 'from', 'fromMany'])
    }
}

function copyStatic(SrcClass: any, DestClass: any, props: string[] = []): void {
    props.forEach(p => {
        if (!DestClass[p]) {
            DestClass[p] = SrcClass[p].bind(DestClass)
        }
    })
}
