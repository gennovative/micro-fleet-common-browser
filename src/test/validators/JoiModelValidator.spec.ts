import { expect } from 'chai'
import * as joi from '@hapi/joi'

import { SampleModel } from './SampleModel'
import { JoiModelValidator } from '../../app/validators/JoiModelValidator'
import { extJoi } from '../../app/validators/JoiExtended'


// tslint:disable: no-magic-numbers

let globalValidator: JoiModelValidator<SampleModel>

describe('JoiModelValidator', () => {
    beforeEach(() => {
        globalValidator = new JoiModelValidator<SampleModel>({
            schemaMapModel: {
                name: joi.string().regex(/^[\d\w -]+$/u).max(10).min(3).required(),
                address: joi.string().required(),
                age: joi.number().min(15).max(99).integer().optional(),
                gender: joi.only('male', 'female').optional(),
            },
            schemaMapId: {
                theID: joi.number().min(1).required(),
            },
        })
    })

    describe('getters', () => {
        it('schemaMap', () => {
            expect(globalValidator.schemaMapModel).to.equal(globalValidator['_schemaMapModel'])
        })

        it('schemaMapId', () => {
            expect(globalValidator.schemaMapId).to.equal(globalValidator['_schemaMapId'])
        })
    }) // END describe 'getters'

    describe('id', () => {
        it('Should return the validated single ID if valid', () => {
            // Arrange
            const ID = 999

            // Act
            const [error, id] = globalValidator.id({ theID: ID })

            // Assert
            if (error) { console.error(error) }
            expect(error).not.to.exist
            expect(id).to.exist
            expect(id).to.deep.equal({ theID: ID })
        })

        it('Should return the validated compound ID if valid', () => {
            // Arrange
            const validator = new JoiModelValidator<SampleModel>({
                    schemaMapModel: { name: joi.string() },
                    schemaMapId: {
                        id: extJoi.genn().bigint().required(),
                        tenantId: extJoi.genn().bigint().required(),
                    },
                }),
                target = {
                    id: BigInt('9007199254740991') + BigInt(999), // Number.MAX_SAFE_INTEGER + 999n
                    tenantId: BigInt('9007199254740991') + BigInt(888),
                }

            // Act
            const [error, id] = validator.id(target)

            // Assert
            if (error) { console.error(error) }
            expect(error).not.to.exist
            expect(id).to.exist
            expect(id.id).to.equal(target.id)
            expect(id.tenantId).to.equal(target.tenantId)
        })

        it('Should return an error object if invalid', () => {
            // Arrange
            const ID = 0

            // Act
            const [error, id] = globalValidator.id({ theID: ID })

            // Assert
            expect(id).not.to.exist
            expect(error).to.exist
            expect(error.details[0].path.length).to.equal(1)
            expect(error.details[0].message).to.equal('"theID" must be larger than or equal to 1')
        })
    }) // END describe 'id'

    describe('whole', () => {
        it('Should return the validated object if valid', () => {
            // Arrange
            const targetOne = {
                    name: 'Gennova123',
                    address: 'Unlimited length street name',
                    age: 18,
                    gender: 'male',
                },
                targetTwo = {
                    name: 'gen-no-va',
                    address: '^!@',
                }

            // Act
            const [errorOne, validatedOne] = globalValidator.whole(targetOne),
                [errorTwo, validatedTwo] = globalValidator.whole(targetTwo)

            // Assert
            if (errorOne) {
                console.error(errorOne)
            }
            expect(errorOne).not.to.exist
            expect(validatedOne).to.exist
            expect(validatedOne.name).to.equal(targetOne.name)
            expect(validatedOne.address).to.equal(targetOne.address)
            expect(validatedOne.age).to.equal(targetOne.age)
            expect(validatedOne.gender).to.equal(targetOne.gender)

            if (errorTwo) {
                console.error(errorTwo)
            }
            expect(errorTwo).not.to.exist
            expect(validatedTwo).to.exist
            expect(validatedTwo.name).to.equal(targetTwo.name)
            expect(validatedTwo.address).to.equal(targetTwo.address)
            expect(validatedTwo.age).not.to.exist
            expect(validatedTwo.gender).not.to.exist
        })

        it('Should remove unknown properties if valid', () => {
            // Arrange
            const target = {
                    name: 'Gennova123',
                    address: 'Unlimited length street name',
                    hobbies: ['sport', 'books'],
                    loveMovie: false,
                }

            // Act
            const [error, value] = globalValidator.whole(target)

            // Assert
            if (error) {
                console.error(error)
            }
            expect(error).not.to.exist
            expect(value).to.exist
            expect(value.name).to.equal(target.name)
            expect(value.address).to.equal(target.address)
            expect(value['hobbies']).not.to.exist
            expect(value['loveMovie']).not.to.exist
        })

        it('Should return an error object if invalid', () => {
            // Arrange
            const targetOne = {
                },
                targetTwo = {
                    name: 'ab',
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
            const [errorOne, validatedOne] = globalValidator.whole(targetOne),
                [errorTwo, validatedTwo] = globalValidator.whole(targetTwo),
                [errorThree, validatedThree] = globalValidator.whole(targetThree)

            // Assert
            expect(validatedOne).not.to.exist
            expect(errorOne).to.exist

            expect(validatedTwo).not.to.exist
            expect(errorTwo).to.exist

            expect(validatedThree).not.to.exist
            expect(errorThree).to.exist
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
            const [errorOne, validatedOne] = globalValidator.whole(targetOne),
                [errorTwo, validatedTwo] = globalValidator.whole(targetTwo),
                [errorThree, validatedThree] = globalValidator.whole(targetThree)

            // Assert
            expect(validatedOne).not.to.exist
            expect(errorOne).to.exist
            expect(errorOne.details).to.have.length(2)
            expect(errorOne.details[0].path.length).to.equal(1)
            expect(errorOne.details[0].path[0]).to.equal('name')
            expect(errorOne.details[0].message).to.equal('"name" is required')
            expect(errorOne.details[1].path.length).to.equal(1)
            expect(errorOne.details[1].path[0]).to.equal('address')
            expect(errorOne.details[1].message).to.equal('"address" is required')

            expect(validatedTwo).not.to.exist
            expect(errorTwo).to.exist
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

            expect(validatedThree).not.to.exist
            expect(errorThree).to.exist
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
            expect(errorThree.details[4].message).to.equal('"gender" must be one of [male, female]')
        })
    }) // END describe 'whole'

    describe('partial', () => {
        it('Should only validate existing properties', () => {
            // Arrange
            const target = {
                    theID: 1,
                    name: 'Long invalid name',
                    // address: '^!@' => address is not specified
                }

            // Act
            const [error, validated] = globalValidator.partial(target)

            // Assert
            expect(validated).not.to.exist
            expect(error).to.exist
            expect(error.details.length).to.equal(1)
            expect(error.details[0].path.length).to.equal(1)
            expect(error.details[0].path[0]).to.equal('name')
            // => No "required" error for `address`.
        })

        it('Should ignore `required` validation (except ID), but not allow `null` value', () => {
            // Arrange
            const targetOne = {
                    theID: 1,
                },
                targetTwo = {
                    theID: 2,
                    name: <any>null,
                    age: <any>null,
                }

            // Act
            const [errorOne, validatedOne] = globalValidator.partial(targetOne),
                [errorTwo, validatedTwo] = globalValidator.partial(targetTwo)

            // Assert: `required` validation is ignored.
            errorOne && console.error(errorOne)
            expect(validatedOne).to.exist
            expect(errorOne).not.to.exist

            // Assert: `required` properties don't allow `null`.
            expect(validatedTwo).not.to.exist
            expect(errorTwo).to.exist
            expect(errorTwo.details).to.have.length(2)
            expect(errorTwo.details[0].path.length).to.equal(1)
            expect(errorTwo.details[0].path[0]).to.equal('name')
            expect(errorTwo.details[0].message).to.equal('"name" must be a string')
            expect(errorTwo.details[1].path.length).to.equal(1)
            expect(errorTwo.details[1].path[0]).to.equal('age')
            expect(errorTwo.details[1].message).to.equal('"age" must be a number')
        })
    }) // END describe 'partial'
})
