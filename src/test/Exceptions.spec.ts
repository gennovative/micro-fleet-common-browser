import { expect } from 'chai'

import { Exception, MinorException, CriticalException,
    InvalidArgumentException, NotImplementedException } from '../app/models/Exceptions'



describe('Exception', () => {
    it('`stack` should have value right after exception is created.', () => {
        // Arrange
        const ex = new Exception()

        // Act
        const stack = ex.stack

        // Assert
        expect(stack).not.to.be.undefined
    })

    it('`toString` should work for critical exception.', () => {
        // Arrange
        const MSG = 'An error occurs'
        const ex = new Exception(MSG, true)

        // Act
        const myString = ex.toString()

        // Assert
        expect(myString).to.contain(`[Critical] ${MSG}`)
    })

    it('`toString` should work for minor exception.', () => {
        // Arrange
        const MSG = 'An error occurs'
        const ex = new Exception(MSG, false)

        // Act
        const myString = ex.toString()

        // Assert
        expect(myString).to.contain(`[Minor] ${MSG}`)
    })

    it('`toString` should work with empty message.', () => {
        // Arrange
        const ex = new Exception()

        // Act
        const myString = ex.toString()

        // Assert
        expect(myString).to.contain(`[Critical] `)
    })
}) // describe 'Exception'

describe('CriticalException', () => {
    it('new instance should have specified message.', () => {
        // Arrange
        const MSG = 'An error occurs'

        // Act
        const ex = new CriticalException(MSG)

        // Assert
        expect(ex.message).to.equal(MSG)
    })
}) // describe 'CriticalException'

describe('MinorException', () => {
    it('new instance should have specified message.', () => {
        // Arrange
        const MSG = 'An error occurs'

        // Act
        const ex = new MinorException(MSG)

        // Assert
        expect(ex.message).to.equal(MSG)
    })
}) // describe 'MinorException'

describe('InvalidArgumentException', () => {
    it('new instance should have specified message.', () => {
        // Arrange
        const MSG = 'An error occurs',
            ARG_NAME = 'age'

        // Act
        const ex = new InvalidArgumentException(ARG_NAME, MSG),
            message = ex.message

        // Assert
        expect(message).to.equal(`The argument "${ARG_NAME}" is invalid! ${MSG}`)
    })

    it('new instance should work without specified message.', () => {
        // Arrange
        const ARG_NAME = 'age'

        // Act
        const ex = new InvalidArgumentException(ARG_NAME),
            message = ex.message

        // Assert
        expect(message).to.equal(`The argument "${ARG_NAME}" is invalid! `)
    })
}) // describe 'InvalidArgumentException'

describe('NotImplementedException', () => {
    it('new instance should have specified message.', () => {
        // Arrange
        const MSG = 'This function is not supported (yet)!'

        // Act
        const ex = new NotImplementedException(MSG)

        // Assert
        expect(ex.message).to.equal(MSG)
    })
}) // describe 'NotImplementedException'

