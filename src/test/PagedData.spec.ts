import { expect } from 'chai'

import { PagedData } from '../app'


describe('PagedData', () => {
    it('Should initialize with one value', () => {
        // Act
        const page = new PagedData(['a'], 100)

        // Assert
        expect(page.length).to.equal(1)
        expect(page.total).to.equal(100)
        expect(page.items).to.deep.equal(['a'])
    })

    it('Should initialize with multiple values', () => {
        // Act
        const page = new PagedData(['a', 'b', 'c'], 100)

        // Assert
        expect(page.length).to.equal(3)
        expect(page.total).to.equal(100)
        expect(page.items).to.deep.equal(['a', 'b', 'c'])
    })

    it('Should initialize without total', () => {
        // Act
        const page = new PagedData(['a', 'b', 'c'])

        // Assert
        expect(page.length).to.equal(3)
        expect(page.total).to.equal(3)
        expect(page.items).to.deep.equal(['a', 'b', 'c'])
    })

    describe('map', () => {
        it('Should return a new instance.', () => {
            // Arrange
            const page = new PagedData(['a', 'b', 'c'], 100)

            // Act
            const mapPage = page.map(it => it + 'd')

            // Assert
            expect(mapPage !== page, 'new instance').to.be.true
            expect(mapPage.total).to.equal(page.total)
            expect(mapPage.length).to.equal(page.length)
            expect(mapPage.items).to.deep.equal(['ad', 'bd', 'cd'])
        })
    })

    describe('forEach', () => {
        it('Should apply to each item.', () => {
            // Arrange
            const page = new PagedData([1, 2, 3], 100)

            // Act
            page.forEach((val, i, arr) => arr[i] = ++val)

            // Assert
            expect(page.items).to.deep.equal([2, 3, 4])
        })
    })

    describe('toJSON', () => {
        it('Should return a serializable object.', () => {
            // Arrange
            const page = new PagedData(['a', 'b', 'c'], 100)

            // Act
            const obj = page.toJSON()

            // Assert
            expect(obj.total).to.equal(page.total)
            expect(obj.items).to.deep.equal(page.items)
        })
    })
})
