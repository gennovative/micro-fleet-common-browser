import { IModelValidator } from '../validators/JoiModelValidator'
import { createJoiValidator } from '../validators/validate-internal'
import { ValidationError } from '../validators/ValidationError'


export interface ITranslatable<T = any> {
    getValidator(): IModelValidator<T>
    from(source: object): T
    fromMany(source: object[]): T[]
}



/**
 * A data type representing a class.
 */
type Newable<T = any> = (new (...args: any[]) => T)

type TranslatableClass<U> = Newable<U> & typeof Translatable

const VALIDATOR = Symbol()

export abstract class Translatable {

    public static getValidator<VT extends Translatable>(this: TranslatableClass<VT>): IModelValidator<VT> {
        let validator = this[VALIDATOR]
        // "validator" may be `null` when class doesn't need validating
        if (validator === undefined) {
            validator = this.$createValidator()
            this[VALIDATOR] = validator
        }
        return validator
    }

    protected static $createValidator<VT extends Translatable>(this: TranslatableClass<VT>): IModelValidator<VT> {
        return createJoiValidator(this)
    }

    public static from<FT extends Translatable>(this: TranslatableClass<FT>, source: object): [ValidationError, FT] {
        return this.getValidator<FT>().whole(source)
    }

    public static fromMany<FT extends Translatable>(this: TranslatableClass<FT>, source: object[]): [Array<ValidationError>, Array<FT>] {
        if (!source) { return null }

        const errors: ValidationError[] = []
        const values: FT[] = []
        // tslint:disable-next-line: prefer-const
        for (let s of source) {
            const [error, value] = this.getValidator<FT>().whole(s)
            error && errors.push(error)
            value && values.push(value)
        }
        return [errors, values]
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
