import { expect } from 'chai'
import * as moment from 'moment'

import { extJoi } from '../../app/validators/JoiExtended'


// tslint:disable: no-magic-numbers

describe('JoiExtended', () => {
    describe('bigint', () => {
        it('Should return the value without conversion if valid', () => {
            // Arrange
            const targetOne = BigInt(1234567890987654321),
                targetTwo = '9999999999988888888877777'

            // Act
            const schema = extJoi.bigint()
            const { error: errorOne, value: valueOne } = schema.validate(targetOne)
            const { error: errorTwo, value: valueTwo } = schema.validate(targetTwo)

            // Assert
            if (errorOne) {
                console.error(errorOne)
            }
            expect(errorOne, 'errorOne').not.to.exist
            expect(typeof valueOne, 'typeof valueOne').to.equal('bigint')
            expect(valueOne, 'valueOne').to.equal(targetOne)

            if (errorTwo) {
                console.error(errorTwo)
            }
            expect(errorTwo, 'errorTwo').not.to.exist
            expect(typeof valueTwo, 'typeof valueTwo').to.equal('string')
            expect(valueTwo, 'valueTwo').to.equal(targetTwo)
        })

        it('Should return the value converted to string if valid', () => {
            // Arrange
            const targetOne = BigInt(1234567890987654321),
                targetTwo = '9999999999988888888877777',
                targetThree = Number.MAX_SAFE_INTEGER

            // Act
            const schema = extJoi.bigint().asString()
            const { error: errorOne, value: valueOne } = schema.validate(targetOne)
            const { error: errorTwo, value: valueTwo } = schema.validate(targetTwo)
            const { error: errorThree, value: valueThree } = schema.validate(targetThree)

            // Assert
            if (errorOne) {
                console.error(errorOne)
            }
            expect(errorOne, 'errorOne').not.to.exist
            expect(typeof valueOne, 'typeof valueOne').to.equal('string')
            expect(valueOne, 'valueOne').to.equal(String(targetOne))

            if (errorTwo) {
                console.error(errorTwo)
            }
            expect(errorTwo, 'errorTwo').not.to.exist
            expect(typeof valueTwo, 'typeof valueTwo').to.equal('string')
            expect(valueTwo, 'valueTwo').to.equal(targetTwo)

            if (errorThree) {
                console.error(errorThree)
            }
            expect(errorThree, 'errorThree').not.to.exist
            expect(typeof valueThree, 'typeof valueThree').to.equal('string')
            expect(valueThree, 'valueThree').to.equal(String(targetThree))
        })

        it('Should return the value converted to native BigInt if valid', () => {
            // Arrange
            const targetOne = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(999),
                targetTwo = '9999999999988888888877777',
                targetThree = Number.MAX_VALUE

            // Act
            const schema = extJoi.bigint().asNative()
            const { error: errorOne, value: valueOne } = schema.validate(targetOne)
            const { error: errorTwo, value: valueTwo } = schema.validate(targetTwo)
            const { error: errorThree, value: valueThree } = schema.validate(targetThree)

            // Assert
            if (errorOne) {
                console.error(errorOne)
            }
            expect(errorOne, 'errorOne').not.to.exist
            expect(typeof valueOne, 'typeof valueOne').to.equal('bigint')
            expect(valueOne, 'valueOne').to.equal(targetOne)

            if (errorTwo) {
                console.error(errorTwo)
            }
            expect(errorTwo, 'errorTwo').not.to.exist
            expect(typeof valueTwo, 'typeof valueTwo').to.equal('bigint')
            expect(valueTwo, 'valueTwo').to.equal(BigInt(targetTwo))

            if (errorThree) {
                console.error(errorThree)
            }
            expect(errorThree, 'errorThree').not.to.exist
            expect(typeof valueThree, 'typeof valueThree').to.equal('bigint')
            expect(valueThree, 'valueThree').to.equal(BigInt(targetThree))
        })

        it('Should return an error object if input cannot be converted to bigint', () => {
            // Arrange
            const targetOne = {},
                targetTwo = 'ABC123'

            // Act
            const schema = extJoi.bigint().asNative()
            const { error: errorOne } = schema.validate(targetOne)
            const { error: errorTwo } = schema.validate(targetTwo)

            // Assert
            expect(errorOne).to.exist
            expect(errorOne.message).to.equal('"value": [object Object] cannot be converted to BigInt')

            expect(errorTwo).to.exist
            expect(errorTwo.message).to.equal('"value": ABC123 cannot be converted to BigInt')
        })

        it('Should return an error object if input is invalid', () => {
            // Arrange
            const targetOne = {},
                targetTwo = Number.MAX_SAFE_INTEGER

            // Act
            const { error: errorOne } = extJoi.bigint().asString().validate(targetOne)
            const { error: errorTwo } = extJoi.bigint().validate(targetTwo)

            // Assert
            expect(errorOne).to.exist
            expect(errorOne.message).to.equal('"value" must be of BigInt type or a string that is convertible to BigInt')

            expect(errorTwo).to.exist
            expect(errorTwo.message).to.equal('"value" must be of BigInt type or a string that is convertible to BigInt')
        })

    }) // END describe 'bigint'

    describe('dateString', () => {

        it('Should return string value if translate() is not called', () => {
            // Arrange
            const targetOne = '2019-05-15T09:06:02.023+07:00',
                targetTwo = '2019-05-15T09:06:02.343Z'

            // Act
            const schema = extJoi.dateString()
            const { error: errorOne, value: valueOne } = schema.validate(targetOne)
            const { error: errorTwo, value: valueTwo } = schema.isUTC().validate(targetTwo)

            // Assert
            errorOne && console.error(errorOne)

            expect(errorOne, 'errorOne').not.to.exist
            expect(valueOne, 'valueOne').to.equal(targetOne)

            errorTwo && console.error(errorTwo)

            expect(errorTwo, 'errorTwo').not.to.exist
            expect(valueTwo, 'valueTwo').to.equal(targetTwo)
        })

        it('Should convert date time WITH timezone if input is valid', () => {
            // Arrange
            const targetOne = '2019-05-15T09:06:02+07:00',
                targetTwo = '2019-05-15T09:06:02.321-05:00'

            // Act
            const schema = extJoi.dateString().translate()
            const { error: errorOne, value: valueOne } = schema.validate(targetOne)
            const { error: errorTwo, value: valueTwo } = schema.validate(targetTwo)

            // Assert
            errorOne && console.error(errorOne)

            expect(errorOne).not.to.exist
            expect(valueOne).is.instanceOf(Date)
            const dateOne = new Date(targetOne)
            expect((<Date><any>valueOne).getTime()).to.equal(dateOne.getTime())

            errorTwo && console.error(errorTwo)

            expect(errorTwo).not.to.exist
            expect(valueTwo).is.instanceOf(Date)
            const dateTwo = new Date(targetTwo)
            expect((<Date><any>valueTwo).getTime()).to.equal(dateTwo.getTime())
        })

        it('Should convert UTC date time WITHOUT timezone if input is valid', () => {
            // Arrange
            const targetOne = '2019-05-15T09:06:02Z',
                targetTwo = '2019-02-28T22:30:02Z'

            // Act
            const schema = extJoi.dateString().isUTC().translate()
            const { error: errorOne, value: valueOne } = schema.validate(targetOne)
            const { error: errorTwo, value: valueTwo } = schema.validate(targetTwo)

            // Assert
            errorOne && console.error(errorOne)

            expect(errorOne).not.to.exist
            expect(valueOne).is.instanceOf(Date)
            const dateOne = new Date(targetOne)
            expect((<Date><any>valueOne).getTime()).to.equal(dateOne.getTime())

            errorTwo && console.error(errorTwo)

            expect(errorTwo).not.to.exist
            expect(valueTwo).is.instanceOf(Date)
            const dateTwo = new Date(targetTwo)
            expect((<Date><any>valueTwo).getTime()).to.equal(dateTwo.getTime())
        })

        it('Should convert date time using custom translator if input is valid', () => {
            // Arrange
            const targetOne = '2019-05-15T09:06:02+06:00',
                targetTwo = '2019-02-28T22:30:02Z'

            // Act
            const schemaOne = extJoi.dateString().translate(moment)
            const { error: errorOne, value: valueOne } = schemaOne.validate(targetOne)

            const schemaTwo = extJoi.dateString()
                .isUTC()
                .translate((input: string) => moment.utc(input))
            const { error: errorTwo, value: valueTwo } = schemaTwo.validate(targetTwo)

            // Assert
            errorOne && console.error(errorOne)

            expect(errorOne).not.to.exist
            expect((<moment.Moment><any>valueOne).isValid()).to.be.true
            const momentOne = moment(targetOne)
            expect((<moment.Moment><any>valueOne).isSame(momentOne)).to.be.true

            errorTwo && console.error(errorTwo)

            expect(errorTwo).not.to.exist
            expect((<moment.Moment><any>valueTwo).isValid()).to.be.true
            expect((<moment.Moment><any>valueTwo).isUTC()).to.be.true
            const momentTwo = moment.utc(targetTwo)
            expect((<moment.Moment><any>valueTwo).isSame(momentTwo)).to.be.true
            expect((<moment.Moment><any>valueTwo).format()).to.equal(momentTwo.format())
        })

        it('Should return an error object if input string is invalid', () => {
            // Arrange
                // Invalid date separator /
            const targetOne = '2019/05/15T09:06:02+07:00',
                // Invalid month
                targetTwo = '2019-13-30T09:06:02Z'

            // Act
            const schema = extJoi.dateString()
            const { error: errorOne } = schema.validate(targetOne)
            const { error: errorTwo } = schema.isUTC().validate(targetTwo)

            // Assert
            expect(errorOne).to.to.exist
            expect(errorOne.message).to.equal('"value" must be a date string compliant' +
                ' with W3C Date and Time Formats (YYYY-MM-DD or YYYY-MM-DDThh:mm:ss.s+hh:mm or -hh:mm)')

            expect(errorTwo).to.to.exist
            expect(errorTwo.message).to.equal('"value" must have all components with valid values')
        })

        it('Should return an error object if input is not string', () => {
            // Arrange
            const targetOne = {},
                targetTwo = 201913300906020500

            // Act
            const schema = extJoi.dateString().isUTC()
            const { error: errorOne } = schema.validate(targetOne)
            const { error: errorTwo } = schema.validate(targetTwo)

            // Assert
            const ERR_MSG = '"value" must be a date string compliant' +
                ' with W3C Date and Time Formats (YYYY-MM-DD or YYYY-MM-DDThh:mm:ss.sZ)'
            expect(errorOne).to.to.exist
            expect(errorOne.message).to.equal(ERR_MSG)

            expect(errorTwo).to.to.exist
            expect(errorTwo.message).to.equal(ERR_MSG)
        })

    }) // END describe 'dateString'
})
