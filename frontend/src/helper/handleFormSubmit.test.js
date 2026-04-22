import {handleFormSubmit} from './handleFormSubmit';

describe('handleFormSubmit function', () => {
    it('should return updateItem if the values are id', () => {
        const values = { id: 1 };
        const updateItem = { name: 'test' };
        expect(handleFormSubmit(values, {}, updateItem)).toEqual(updateItem);
    });
    it('should return addItem if the values is empty', () => {
        const values = {};
        const addItem = { name: 'test' };
        expect(handleFormSubmit(values, addItem, {})).toEqual(addItem);
    });
    it('should return addItem when id is 0 because 0 is falsy', () => {
        const values = { id: 0 };
        const addItem = { name: 'new' };
        expect(handleFormSubmit(values, addItem, {})).toEqual(addItem);
    });
    it('should return addItem when id is null', () => {
        const values = { id: null };
        const addItem = { name: 'new' };
        expect(handleFormSubmit(values, addItem, {})).toEqual(addItem);
    });
    it('should return updateItem when id is string numeric "0"', () => {
        const values = { id: '0' };
        const updateItem = { name: 'update' };
        expect(handleFormSubmit(values, {}, updateItem)).toEqual(updateItem);
    });

    describe('Edge cases for handleFormSubmit', () => {
        // Test with undefined id
        it('should return addItem when id is undefined', () => {
            // Arrange
            const values = { id: undefined };
            const addItem = { name: 'newItem' };
            const updateItem = { name: 'existingItem' };

            // Act
            const result = handleFormSubmit(values, addItem, updateItem);

            // Assert
            expect(result).toEqual(addItem);
        });

        // Test with positive numeric id
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

        // Test with string numeric id
        it('should return updateItem when id is string numeric "123"', () => {
            // Arrange
            const values = { id: '123' };
            const addItem = { name: 'new' };
            const updateItem = { name: 'update', id: '123' };

            // Act
            const result = handleFormSubmit(values, addItem, updateItem);

            // Assert
            expect(result).toEqual(updateItem);
        });

        // Test with large numeric id
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

        // Test with negative id (edge case but should still work)
        it('should return updateItem when id is negative number', () => {
            // Arrange
            const values = { id: -1 };
            const addItem = { name: 'new' };
            const updateItem = { name: 'update' };

            // Act
            const result = handleFormSubmit(values, addItem, updateItem);

            // Assert
            expect(result).toEqual(updateItem);
        });

        // Test with empty string id (falsy)
        it('should return addItem when id is empty string', () => {
            // Arrange
            const values = { id: '' };
            const addItem = { name: 'new' };
            const updateItem = { name: 'update' };

            // Act
            const result = handleFormSubmit(values, addItem, updateItem);

            // Assert
            expect(result).toEqual(addItem);
        });

        // Test with values object missing id property
        it('should return addItem when values object has no id property', () => {
            // Arrange
            const values = { name: 'test', description: 'test desc' };
            const addItem = { name: 'new' };
            const updateItem = { name: 'update' };

            // Act
            const result = handleFormSubmit(values, addItem, updateItem);

            // Assert
            expect(result).toEqual(addItem);
        });

        // Test with boolean false as id
        it('should return addItem when id is boolean false', () => {
            // Arrange
            const values = { id: false };
            const addItem = { name: 'new' };
            const updateItem = { name: 'update' };

            // Act
            const result = handleFormSubmit(values, addItem, updateItem);

            // Assert
            expect(result).toEqual(addItem);
        });

        // Test with boolean true as id (truthy)
        it('should return updateItem when id is boolean true', () => {
            // Arrange
            const values = { id: true };
            const addItem = { name: 'new' };
            const updateItem = { name: 'update' };

            // Act
            const result = handleFormSubmit(values, addItem, updateItem);

            // Assert
            expect(result).toEqual(updateItem);
        });

        // Test with object as id (truthy)
        it('should return updateItem when id is an object', () => {
            // Arrange
            const values = { id: { nested: 'value' } };
            const addItem = { name: 'new' };
            const updateItem = { name: 'update' };

            // Act
            const result = handleFormSubmit(values, addItem, updateItem);

            // Assert
            expect(result).toEqual(updateItem);
        });

        // Test with array as id (truthy)
        it('should return updateItem when id is an array', () => {
            // Arrange
            const values = { id: [1, 2, 3] };
            const addItem = { name: 'new' };
            const updateItem = { name: 'update' };

            // Act
            const result = handleFormSubmit(values, addItem, updateItem);

            // Assert
            expect(result).toEqual(updateItem);
        });

        // Test that it doesn't modify input objects
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

        // Test with very large numeric string id
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
