import { handleFormSubmit } from './handleFormSubmit';

describe('handleFormSubmit function', () => {

    it('should return updateItem if values have a truthy id', () => {
        const values = { id: 1 };
        const updateItem = { name: 'test' };
        expect(handleFormSubmit(values, {}, updateItem)).toEqual(updateItem);
    });

    it('should return addItem if values have no id property', () => {
        const values = {};
        const addItem = { name: 'test' };
        expect(handleFormSubmit(values, addItem, {})).toEqual(addItem);
    });

    it('should return addItem when id is 0 — 0 is falsy', () => {
        const values = { id: 0 };
        const addItem = { name: 'new' };
        expect(handleFormSubmit(values, addItem, {})).toEqual(addItem);
    });

    it('should return addItem when id is null — null is falsy', () => {
        const values = { id: null };
        const addItem = { name: 'new' };
        expect(handleFormSubmit(values, addItem, {})).toEqual(addItem);
    });

    it('should return updateItem when id is string "0" — non-empty string is truthy', () => {
        // Arrange — "0" !== 0, рядок "0" є truthy в JS
        const values = { id: '0' };
        const updateItem = { name: 'update' };
        // Act & Assert
        expect(handleFormSubmit(values, {}, updateItem)).toEqual(updateItem);
    });

    describe('Edge cases for handleFormSubmit', () => {

        it('should return addItem when id is undefined — undefined is falsy', () => {
            // Arrange
            const values = { id: undefined };
            const addItem = { name: 'newItem' };
            const updateItem = { name: 'existingItem' };
            // Act
            const result = handleFormSubmit(values, addItem, updateItem);
            // Assert
            expect(result).toEqual(addItem);
        });

        it('should return updateItem when id is positive number', () => {
            // Arrange
            const values = { id: 123 };
            const addItem = { name: 'new' };
            const updateItem = { name: 'update', id: 123 };
            // Act
            const result = handleFormSubmit(values, addItem, updateItem);
            // Assert
            expect(result).toEqual(updateItem);
        });

        it('should return updateItem when id is string "123" — truthy string', () => {
            // Arrange
            const values = { id: '123' };
            const addItem = { name: 'new' };
            const updateItem = { name: 'update', id: '123' };
            // Act
            const result = handleFormSubmit(values, addItem, updateItem);
            // Assert
            expect(result).toEqual(updateItem);
        });

        it('should return updateItem when id is large number', () => {
            // Arrange
            const values = { id: 999999 };
            const addItem = { name: 'new' };
            const updateItem = { name: 'large id' };
            // Act
            const result = handleFormSubmit(values, addItem, updateItem);
            // Assert
            expect(result).toEqual(updateItem);
        });

        it('should return updateItem when id is negative number — negative is truthy', () => {
            // Arrange — -1 є truthy
            const values = { id: -1 };
            const addItem = { name: 'new' };
            const updateItem = { name: 'update' };
            // Act
            const result = handleFormSubmit(values, addItem, updateItem);
            // Assert
            expect(result).toEqual(updateItem);
        });

        it('should return addItem when id is empty string — "" is falsy', () => {
            // Arrange
            const values = { id: '' };
            const addItem = { name: 'new' };
            const updateItem = { name: 'update' };
            // Act
            const result = handleFormSubmit(values, addItem, updateItem);
            // Assert
            expect(result).toEqual(addItem);
        });

        it('should return addItem when values has no id property at all', () => {
            // Arrange
            const values = { name: 'test', description: 'test desc' };
            const addItem = { name: 'new' };
            const updateItem = { name: 'update' };
            // Act
            const result = handleFormSubmit(values, addItem, updateItem);
            // Assert
            expect(result).toEqual(addItem);
        });

        it('should return addItem when id is boolean false — false is falsy', () => {
            // Arrange
            const values = { id: false };
            const addItem = { name: 'new' };
            const updateItem = { name: 'update' };
            // Act
            const result = handleFormSubmit(values, addItem, updateItem);
            // Assert
            expect(result).toEqual(addItem);
        });

        it('should return updateItem when id is boolean true — true is truthy', () => {
            // Arrange
            const values = { id: true };
            const addItem = { name: 'new' };
            const updateItem = { name: 'update' };
            // Act
            const result = handleFormSubmit(values, addItem, updateItem);
            // Assert
            expect(result).toEqual(updateItem);
        });

        it('should return updateItem when id is a non-empty array — [] is truthy', () => {
            // Arrange — масив завжди truthy, навіть порожній
            const values = { id: [1, 2, 3] };
            const addItem = { name: 'new' };
            const updateItem = { name: 'update' };
            // Act
            const result = handleFormSubmit(values, addItem, updateItem);
            // Assert
            expect(result).toEqual(updateItem);
        });

        it('should not modify input objects', () => {
            // Arrange
            const values = { id: 1 };
            const addItem = { name: 'new' };
            const updateItem = { name: 'update' };
            const valuesCopy = { ...values };
            const addItemCopy = { ...addItem };
            const updateItemCopy = { ...updateItem };
            // Act
            handleFormSubmit(values, addItem, updateItem);
            // Assert
            expect(values).toEqual(valuesCopy);
            expect(addItem).toEqual(addItemCopy);
            expect(updateItem).toEqual(updateItemCopy);
        });

        it('should return updateItem when id is large numeric string', () => {
            // Arrange
            const values = { id: '999999999999' };
            const addItem = { name: 'new' };
            const updateItem = { name: 'update' };
            // Act
            const result = handleFormSubmit(values, addItem, updateItem);
            // Assert
            expect(result).toEqual(updateItem);
        });
    });
});