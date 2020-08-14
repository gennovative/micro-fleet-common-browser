import { expect } from 'chai'
import * as joi from '@hapi/joi'

import { StringDecoratorOptions, decorators as d } from '../app/decorators'
import { Translatable } from '../app/models/Translatable'


// tslint:disable: no-magic-numbers

/*
 * NOTE: Create new class for each test to avoid decorator cache.
 */

describe('Translatable', function () {
    // this.timeout(5000)
    this.timeout(60000) // For debugging

    describe('validateClass', () => {

        @d.validateClass({
            schemaMapModel: {
                name: joi.string().regex(/^[\d\w -]+$/u).max(10).min(3).required(),
                address: joi.string().required(),
                age: joi.number().min(15).max(99).integer()
                    .allow(null).optional(),
                gender: joi.valid('male', 'female').allow(null).optional(),
            },
            schemaMapId: {
                theID: joi.number().min(1).max(Number.MAX_SAFE_INTEGER).required(),
            },
        })
        class ModelA extends Translatable {
            public theID: number = undefined // It's IMPORTANT to initialize property with a value.
            public name: string = undefined
            public address: string = undefined
            public age: number = undefined
            public gender: 'male' | 'female' = undefined
        }

        it('Should return an object of target type if success', () => {
            // Arrange
            const sourceOne = {
                    theID: 1,
                    name: 'Gennova123',
                    address: 'Unlimited length street name',
                    age: 18,
                    gender: 'male',
                },
                sourceTwo = {
                    theID: 123,
                    name: 'gen-no-va',
                    address: '^!@',
                }
            let errorOne, convertedOne, errorTwo, convertedTwo

            // Act
            try {
                convertedOne = ModelA.from(sourceOne)
            } catch (err) {
                errorOne = err
            }

            try {
                convertedTwo = ModelA.from(sourceTwo)
            } catch (err) {
                errorTwo = err
            }

            // Assert
            errorOne && console.error(errorOne)

            expect(errorOne, 'errorOne').not.to.exist
            expect(convertedOne, 'convertedOne').to.exist
            expect(convertedOne.theID, 'theID').to.equal(sourceOne.theID, 'theID')
            expect(convertedOne.name, 'name').to.equal(sourceOne.name, 'name')
            expect(convertedOne.address, 'address').to.equal(sourceOne.address, 'address')
            expect(convertedOne.age, 'age').to.equal(sourceOne.age, 'age')
            expect(convertedOne.gender, 'gender').to.equal(sourceOne.gender, 'gender')

            errorTwo && console.error(errorTwo, 'errorTwo')

            expect(errorTwo, 'errorTwo').not.to.exist
            expect(convertedTwo, 'convertedTwo').to.exist
            expect(convertedTwo.theID, 'theID').to.equal(sourceTwo.theID, 'theID')
            expect(convertedTwo.name, 'name').to.equal(sourceTwo.name, 'name')
            expect(convertedTwo.address, 'address').to.equal(sourceTwo.address, 'address')
            expect(convertedTwo.age, 'age').not.to.exist
            expect(convertedTwo.gender, 'gender').not.to.exist
        })

        it('Should return error details if invalid', () => {
            // Arrange
            const targetOne = {
                },
                targetTwo = {
                    name: <any>null,
                    address: '',
                    age: '10',
                },
                targetThree = {
                    name: 'too long name w!th inv@lid ch@racters',
                    address: <any>null,
                    age: 10,
                    gender: 'homo',
                }

            // Act
            let errorOne, validatedOne
            try {
                validatedOne = ModelA.from(targetOne)
            }
            catch (err) {
                errorOne = err
            }

            let errorTwo, validatedTwo
            try {
                validatedTwo = ModelA.from(targetTwo)
            }
            catch (err) {
                errorTwo = err
            }

            const validator = ModelA.getValidator()
            const [errorThree, validatedThree] = validator.whole(targetThree)

            // Assert
            expect(validatedOne, 'validatedOne').not.to.exist
            expect(errorOne, 'errorOne').to.exist
            expect(errorOne.details, 'errorOne.details.length').to.have.length(2)
            expect(errorOne.details[0].path.length).to.equal(1)
            expect(errorOne.details[0].path[0]).to.equal('name')
            expect(errorOne.details[0].message).to.equal('"name" is required')
            expect(errorOne.details[1].path.length).to.equal(1)
            expect(errorOne.details[1].path[0]).to.equal('address')
            expect(errorOne.details[1].message).to.equal('"address" is required')

            expect(validatedTwo, 'validatedTwo').not.to.exist
            expect(errorTwo, 'errorTwo').to.exist
            expect(errorTwo.details).to.have.length(3)
            expect(errorTwo.details[0].path.length).to.equal(1)
            expect(errorTwo.details[0].path[0]).to.equal('name')
            expect(errorTwo.details[0].message).to.equal('"name" must be a string')
            expect(errorTwo.details[1].path.length).to.equal(1)
            expect(errorTwo.details[1].path[0]).to.equal('address')
            expect(errorTwo.details[1].message).to.equal('"address" is not allowed to be empty')
            expect(errorTwo.details[2].path.length).to.equal(1)
            expect(errorTwo.details[2].path[0]).to.equal('age')
            expect(errorTwo.details[2].message).to.equal('"age" must be larger than or equal to 15')

            expect(validatedThree, 'validatedThree').not.to.exist
            expect(errorThree, 'errorThree').to.exist
            expect(errorThree.details).to.have.length(5)
            expect(errorThree.details[0].path.length).to.equal(1)
            expect(errorThree.details[0].path[0]).to.equal('name')
            expect(errorThree.details[0].message).to.contain('fails to match the required pattern')
            expect(errorThree.details[1].path.length).to.equal(1)
            expect(errorThree.details[1].path[0]).to.equal('name')
            expect(errorThree.details[1].message).to.equal('"name" length must be less than or equal to 10 characters long')
            expect(errorThree.details[2].path.length).to.equal(1)
            expect(errorThree.details[2].path[0]).to.equal('address')
            expect(errorThree.details[2].message).to.equal('"address" must be a string')
            expect(errorThree.details[3].path.length).to.equal(1)
            expect(errorThree.details[3].path[0]).to.equal('age')
            expect(errorThree.details[3].message).to.equal('"age" must be larger than or equal to 15')
            expect(errorThree.details[4].path.length).to.equal(1)
            expect(errorThree.details[4].path[0]).to.equal('gender')
            expect(errorThree.details[4].message).to.equal('"gender" must be one of [male, female, null]')
        })


        const GENDERS = ['male', 'female']
        @d.validateClass({
            schemaMapModel: {
                gender: joi.valid(...GENDERS),
            },
        })
        class ModelB extends Translatable {
            @d.validateProp(joi.string().required())
            public address: string = undefined

            @d.valid('soccer', 'football', 'handball')
            public hobbies: string = undefined

            public theID: string = undefined
            public name: string = undefined
            public age: number = undefined
            public gender: string = undefined
        }
        it('Should clear all property rules', () => {
            // Arrange
            const source = {
                    theID: 1,
                    name: 'Gennova123',
                    address: 'Unlimited length street name',
                    hobbies: 'football',
                    gender: 'male',
                }
            let error, converted

            // Act
            try {
                converted = ModelB.from(source)
            } catch (err) {
                error = err
            }

            // Assert
            error && console.error(error)

            expect(error).not.to.exist
            expect(converted, 'converted').to.exist
            expect(converted.theID, 'theID').not.to.exist
            expect(converted.name, 'name').not.to.exist
            expect(converted.address, 'address').not.to.exist
            expect(converted.age, 'age').not.to.exist
            expect(converted.gender, 'gender').to.equal(source.gender)
        })
    }) // describe 'validateClass'


    describe('decorators', () => {

        class ModelB extends Translatable {
            @d.id()
            @d.required()
            @d.number({ min: 1, max: Number.MAX_SAFE_INTEGER })
            public theID: number = undefined

            @d.required()
            @d.string(<StringDecoratorOptions>{ minLength: 3, maxLength: 10, pattern: /^[\d\w -]+$/u })
            public name: string = undefined

            @d.required()
            @d.string()
            public address: string = undefined

            @d.number({ min: 15, max: 99 })
            public age: number = undefined

            @d.valid('male', 'female')
            public gender: 'male' | 'female' = undefined
        }

        it('Should return an object of target type if success', () => {
            // Arrange
            const sourceOne = {
                    theID: 1,
                    name: 'Gennova123',
                    address: 'Unlimited length street name',
                    age: 18,
                    gender: 'male',
                },
                sourceTwo = {
                    theID: 123,
                    name: 'gen-no-va',
                    address: '^!@',
                }
            let errorOne, convertedOne, errorTwo, convertedTwo

            // Act
            try {
                convertedOne = ModelB.from(sourceOne)
            } catch (err) {
                errorOne = err
            }

            try {
                convertedTwo = ModelB.from(sourceTwo)
            } catch (err) {
                errorTwo = err
            }

            // Assert
            errorOne && console.error(errorOne)

            expect(errorOne, 'errorOne').not.to.exist
            expect(convertedOne, 'convertedOne').to.exist
            expect(convertedOne.theID, 'theID').to.equal(sourceOne.theID)
            expect(convertedOne.name, 'name').to.equal(sourceOne.name)
            expect(convertedOne.address, 'address').to.equal(sourceOne.address)
            expect(convertedOne.age, 'age').to.equal(sourceOne.age)
            expect(convertedOne.gender, 'gender').to.equal(sourceOne.gender)

            errorTwo && console.error(errorTwo, 'errorTwo')

            expect(errorTwo, 'errorTwo').not.to.exist
            expect(convertedTwo, 'convertedTwo').to.exist
            expect(convertedTwo.theID, 'theID').to.equal(sourceTwo.theID)
            expect(convertedTwo.name, 'name').to.equal(sourceTwo.name)
            expect(convertedTwo.address, 'address').to.equal(sourceTwo.address)
            expect(convertedTwo.age, 'age').not.to.exist
            expect(convertedTwo.gender, 'gender').not.to.exist
        })

        it('Should ignore `required` validation (except ID), but not allow `null` value', () => {
            // Arrange
            const targetOne = {
                    theID: 1,
                    age: 20,
                },
                targetTwo = {
                    theID: 2,
                    name: <any>null,
                    age: <any>null,
                }

            // Act
            const validator = ModelB.getValidator()
            const [errorOne, validatedOne] = validator.partial(targetOne),
                [errorTwo, validatedTwo] = validator.partial(targetTwo)

            // Assert: `required` validation is ignored.
            errorOne && console.error(errorOne)
            expect(validatedOne, 'validatedOne').to.exist
            expect(validatedOne.age, 'age').to.equal(targetOne.age)
            expect(errorOne, 'errorOne').not.to.exist

            // Assert: `required` properties don't allow `null`.
            expect(validatedTwo, 'validatedTwo').not.to.exist
            expect(errorTwo, 'errorTwo').to.exist
            expect(errorTwo.details).to.have.length(2)
            expect(errorTwo.details[0].path.length).to.equal(1)
            expect(errorTwo.details[0].path[0]).to.equal('name')
            expect(errorTwo.details[0].message).to.equal('"name" must be a string')
            expect(errorTwo.details[1].path.length).to.equal(1)
            expect(errorTwo.details[1].path[0]).to.equal('age')
            expect(errorTwo.details[1].message).to.equal('"age" must be a number')
        })
    }) // describe 'decorators'


    describe('inheritance', () => {

        @d.validateClass({
            schemaMapModel: {
                name: joi.string().regex(/^[\d\w -]+$/u).max(10).min(3).required(),
                address: joi.string().required(),
                age: joi.number().min(15).max(50).integer()
                    .allow(null).optional(),
                gender: joi.valid('male', 'female').allow(null).optional(),
            },
            schemaMapId: {
                theID: joi.number().min(1).max(Number.MAX_SAFE_INTEGER).required(),
            },
        })
        class ModelC extends Translatable {
            public theID: number = undefined // It's IMPORTANT to initialize property with a value.
            public name: string = undefined
            public address: string = undefined
            public age: number = undefined
            public gender: string = undefined
        }

        const HOBBIES_1 = ['soccer', 'football', 'handball']
        const GENDERS_1 = ['transmale', 'transfemale']
        class ChildOneC extends ModelC {
            @d.number({ min: 10, max: 30 })
            public age: number = undefined

            @d.valid(HOBBIES_1)
            public hobbies: string = undefined

            @d.valid(...GENDERS_1)
            public gender: string = undefined
        }

        it('Should inherit class validation rules with decorators', () => {
            // Arrange
            const sourceOne = {
                    theID: 1,
                    name: 'Gennova123',
                    address: 'Unlimited length street name',
                    age: 18,
                    gender: 'transmale',
                    hobbies: 'handball',
                },
                sourceTwo = {
                    theID: 123,
                    // name: 'gen-no-va', // Skip required property
                    age: 40,
                    address: '^!@',
                    gender: 'male',
                    hobbies: 'gambling', // Not allowed value
                }
            let errorOne, convertedOne, errorTwo, convertedTwo

            // Act
            try {
                convertedOne = ChildOneC.from(sourceOne)
            } catch (err) {
                errorOne = err
            }

            try {
                convertedTwo = ChildOneC.from(sourceTwo)
            } catch (err) {
                errorTwo = err
            }

            // Assert
            errorOne && console.error(errorOne)

            expect(errorOne, 'errorOne').not.to.exist
            expect(convertedOne, 'convertedOne').to.exist
            expect(convertedOne.theID, 'theID').to.equal(sourceOne.theID)
            expect(convertedOne.name, 'name').to.equal(sourceOne.name)
            expect(convertedOne.address, 'address').to.equal(sourceOne.address)
            expect(convertedOne.age, 'age').to.equal(sourceOne.age)
            expect(convertedOne.gender, 'gender').to.equal(sourceOne.gender)

            // errorTwo && console.error(errorTwo, 'errorTwo')

            expect(convertedTwo, 'convertedTwo').not.to.exist
            expect(errorTwo, 'errorTwo').to.exist
            expect(errorTwo.details, 'details.length').to.have.length(4)
            expect(errorTwo.details[0].path[0]).to.equal('name')
            expect(errorTwo.details[0].message).to.equal('"name" is required')
            expect(errorTwo.details[1].path[0]).to.equal('age')
            expect(errorTwo.details[1].message).to.equal('"age" must be less than or equal to 30')
            expect(errorTwo.details[2].path[0]).to.equal('gender')
            expect(errorTwo.details[2].message).to.equal('"gender" must be one of [transmale, transfemale]')
            expect(errorTwo.details[3].path[0]).to.equal('hobbies')
            expect(errorTwo.details[3].message).to.equal('"hobbies" must be one of [soccer, football, handball]')
        })


        const HOBBIES_2 = ['gingerbeard', 'kitkat', 'jelly']
        const GENDERS_2 = ['gay', 'lesbian']
        class ChildTwoC extends ModelC {
            @d.number({ min: 10, max: 30 })
            public age: number = undefined

            @d.valid(HOBBIES_2)
            public hobbies: string = undefined

            @d.validateProp(joi.valid(...GENDERS_2))
            public gender: string = undefined
        }

        it('Should inherit class validation rules with validateProp()', () => {
            // Arrange
            const sourceOne = {
                    theID: 1,
                    name: 'Gennova123',
                    address: 'Unlimited length street name',
                    age: 18,
                    gender: 'lesbian',
                    hobbies: 'kitkat',
                },
                sourceTwo = {
                    theID: 123,
                    // name: 'gen-no-va', // Skip required property
                    age: 40,
                    address: '^!@',
                    gender: 'male',
                    hobbies: 'gambling', // Not allowed value
                }
            let errorOne, convertedOne, errorTwo, convertedTwo

            // Act
            try {
                convertedOne = ChildTwoC.from(sourceOne)
            } catch (err) {
                errorOne = err
            }

            try {
                convertedTwo = ChildTwoC.from(sourceTwo)
            } catch (err) {
                errorTwo = err
            }

            // Assert
            errorOne && console.error(errorOne)

            expect(errorOne, 'errorOne').not.to.exist
            expect(convertedOne, 'convertedOne').to.exist
            expect(convertedOne.theID, 'theID').to.equal(sourceOne.theID)
            expect(convertedOne.name, 'name').to.equal(sourceOne.name)
            expect(convertedOne.address, 'address').to.equal(sourceOne.address)
            expect(convertedOne.age, 'age').to.equal(sourceOne.age)
            expect(convertedOne.gender, 'gender').to.equal(sourceOne.gender)

            // errorTwo && console.error(errorTwo, 'errorTwo')

            expect(convertedTwo, 'convertedTwo').not.to.exist
            expect(errorTwo, 'errorTwo').to.exist
            expect(errorTwo.details, 'errorTwo.details.length').to.have.length(4)
            expect(errorTwo.details[0].path[0], 'details[0].path').to.equal('name')
            expect(errorTwo.details[0].message, 'details[0].message').to.equal('"name" is required')
            expect(errorTwo.details[1].path[0]).to.equal('age')
            expect(errorTwo.details[1].message).to.equal('"age" must be less than or equal to 30')
            expect(errorTwo.details[2].path[0], 'details[1].path').to.equal('gender')
            expect(errorTwo.details[2].message, 'details[1].message').to.equal('"gender" must be one of [gay, lesbian]')
            expect(errorTwo.details[3].path[0], 'details[2].path').to.equal('hobbies')
            expect(errorTwo.details[3].message, 'details[2].message').to.equal('"hobbies" must be one of [gingerbeard, kitkat, jelly]')
        })


        const HOBBIES_3 = ['games', 'books', 'gamebooks']
        const GENDERS_3 = ['genderless', 'bigender']
        @d.validateClass({
            schemaMapModel: {
                gender: joi.valid(...GENDERS_3),
            },
        })
        class ChildThreeC extends ModelC {
            @d.valid(HOBBIES_3)
            public hobbies: string = undefined
        }

        it('Should NOT inherit class validation rules with validateClass()', () => {
            // Arrange
            const sourceOne = {
                    theID: -10,
                    name: '@!#$%',
                    age: 'Eighty',
                    gender: 'bigender',
                    hobbies: 'gamebooks',
                },
                sourceTwo = {
                    theID: 123,
                    // name: 'gen-no-va', // Skip required property
                    address: '^!@',
                    gender: 'homo',
                    hobbies: 'gambling', // Not allowed value
                }
            let errorOne, convertedOne, errorTwo, convertedTwo

            // Act
            try {
                convertedOne = ChildThreeC.from(sourceOne)
            } catch (err) {
                errorOne = err
            }

            try {
                convertedTwo = ChildThreeC.from(sourceTwo)
            } catch (err) {
                errorTwo = err
            }

            // Assert
            errorOne && console.error(errorOne)

            expect(errorOne, 'errorOne').not.to.exist
            expect(convertedOne, 'convertedOne').to.exist
            expect(convertedOne.theID, 'theID').not.to.exist
            expect(convertedOne.name, 'name').not.to.exist
            expect(convertedOne.address, 'address').not.to.exist
            expect(convertedOne.age, 'age').not.to.exist
            expect(convertedOne.hobbies, 'hobbies').not.to.exist
            expect(convertedOne.gender, 'gender').to.equal(sourceOne.gender)

            // errorTwo && console.error(errorTwo, 'errorTwo')

            expect(convertedTwo, 'convertedTwo').not.to.exist
            expect(errorTwo, 'errorTwo').to.exist
            expect(errorTwo.details, 'errorTwo.details.length').to.have.length(1)
            expect(errorTwo.details[0].path[0], 'details[0].path[0]').to.equal('gender')
            expect(errorTwo.details[0].message, 'details[0].message').to.equal('"gender" must be one of [genderless, bigender]')
        })


        class GrandChildOne extends ChildOneC {
            @d.number({ max: 80 })
            public age: number = undefined
        }

        it('Should override individual parent rules with decorators', () => {
            // Arrange
            const sourceOne = {
                    theID: 1,
                    name: 'Gennova123',
                    address: 'Unlimited length street name',
                    age: 7,
                    gender: 'transmale',
                    hobbies: 'handball',
                },
                sourceTwo = {
                    theID: 123,
                    // name: 'gen-no-va', // Skip required property
                    age: 100,
                    address: '^!@',
                    gender: 'male',
                    hobbies: 'gambling', // Not allowed value
                }
            let errorOne, convertedOne, errorTwo, convertedTwo

            // Act
            try {
                convertedOne = GrandChildOne.from(sourceOne)
            } catch (err) {
                errorOne = err
            }

            try {
                convertedTwo = GrandChildOne.from(sourceTwo)
            } catch (err) {
                errorTwo = err
            }

            // Assert
            errorOne && console.error(errorOne)

            expect(errorOne, 'errorOne').not.to.exist
            expect(convertedOne, 'convertedOne').to.exist
            expect(convertedOne.theID, 'theID').to.equal(sourceOne.theID)
            expect(convertedOne.name, 'name').to.equal(sourceOne.name)
            expect(convertedOne.address, 'address').to.equal(sourceOne.address)
            expect(convertedOne.age, 'age').to.equal(sourceOne.age)
            expect(convertedOne.gender, 'gender').to.equal(sourceOne.gender)

            // errorTwo && console.error(errorTwo, 'errorTwo')

            expect(convertedTwo, 'convertedTwo').not.to.exist
            expect(errorTwo, 'errorTwo').to.exist
            expect(errorTwo.details, 'details.length').to.have.length(4)
            expect(errorTwo.details[0].path[0]).to.equal('name')
            expect(errorTwo.details[0].message).to.equal('"name" is required')
            expect(errorTwo.details[1].path[0]).to.equal('age')
            expect(errorTwo.details[1].message).to.equal('"age" must be less than or equal to 80')
            expect(errorTwo.details[2].path[0]).to.equal('gender')
            expect(errorTwo.details[2].message).to.equal('"gender" must be one of [transmale, transfemale]')
            expect(errorTwo.details[3].path[0]).to.equal('hobbies')
            expect(errorTwo.details[3].message).to.equal('"hobbies" must be one of [soccer, football, handball]')
        })


        class GrandChildTwo extends ChildTwoC {
            @d.validateProp(joi.number().max(80))
            public age: number = undefined
        }

        it('Should override individual parent rules with validateProp()', () => {
            // Arrange
            const sourceOne = {
                    theID: 1,
                    name: 'Gennova123',
                    address: 'Unlimited length street name',
                    age: 7,
                    gender: 'lesbian',
                    hobbies: 'kitkat',
                },
                sourceTwo = {
                    theID: 123,
                    // name: 'gen-no-va', // Skip required property
                    age: 100,
                    address: '^!@',
                    gender: 'male',
                    hobbies: 'gambling', // Not allowed value
                }
            let errorOne, convertedOne, errorTwo, convertedTwo

            // Act
            try {
                convertedOne = GrandChildTwo.from(sourceOne)
            } catch (err) {
                errorOne = err
            }

            try {
                convertedTwo = GrandChildTwo.from(sourceTwo)
            } catch (err) {
                errorTwo = err
            }

            // Assert
            errorOne && console.error(errorOne)

            expect(errorOne, 'errorOne').not.to.exist
            expect(convertedOne, 'convertedOne').to.exist
            expect(convertedOne.theID, 'theID').to.equal(sourceOne.theID)
            expect(convertedOne.name, 'name').to.equal(sourceOne.name)
            expect(convertedOne.address, 'address').to.equal(sourceOne.address)
            expect(convertedOne.age, 'age').to.equal(sourceOne.age)
            expect(convertedOne.gender, 'gender').to.equal(sourceOne.gender)

            // errorTwo && console.error(errorTwo, 'errorTwo')

            expect(convertedTwo, 'convertedTwo').not.to.exist
            expect(errorTwo, 'errorTwo').to.exist
            expect(errorTwo.details, 'details.length').to.have.length(4)
            expect(errorTwo.details[0].path[0]).to.equal('name')
            expect(errorTwo.details[0].message).to.equal('"name" is required')
            expect(errorTwo.details[1].path[0]).to.equal('age')
            expect(errorTwo.details[1].message).to.equal('"age" must be less than or equal to 80')
            expect(errorTwo.details[2].path[0]).to.equal('gender')
            expect(errorTwo.details[2].message).to.equal('"gender" must be one of [gay, lesbian]')
            expect(errorTwo.details[3].path[0]).to.equal('hobbies')
            expect(errorTwo.details[3].message).to.equal('"hobbies" must be one of [gingerbeard, kitkat, jelly]')
        })
    }) // describe 'inheritance'
})
