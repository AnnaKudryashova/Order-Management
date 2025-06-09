import { OrderValidator } from '../src/patterns/chain/OrderValidator.js';

describe('Order Validator Tests', () => {
    let validator: OrderValidator;

    beforeEach(() => {
        validator = new OrderValidator();
    });

    test('should validate correct order request', () => {
        const validRequest = {
            productName: 'Test Product',
            quantity: 2,
            paymentMethod: 'credit'
        };

        expect(validator.validateOrder(validRequest)).toBe(true);
    });

    test('should reject order with empty product name', () => {
        const invalidRequest = {
            productName: '',
            quantity: 2,
            paymentMethod: 'credit'
        };

        expect(validator.validateOrder(invalidRequest)).toBe(false);
    });

    test('should reject order with zero quantity', () => {
        const invalidRequest = {
            productName: 'Test Product',
            quantity: 0,
            paymentMethod: 'credit'
        };

        expect(validator.validateOrder(invalidRequest)).toBe(false);
    });

    test('should reject order with negative quantity', () => {
        const invalidRequest = {
            productName: 'Test Product',
            quantity: -1,
            paymentMethod: 'credit'
        };

        expect(validator.validateOrder(invalidRequest)).toBe(false);
    });

    test('should reject order with invalid payment method', () => {
        const invalidRequest = {
            productName: 'Test Product',
            quantity: 2,
            paymentMethod: 'invalid'
        };

        expect(validator.validateOrder(invalidRequest)).toBe(false);
    });

    test('should accept valid payment methods', () => {
        const validMethods = ['credit', 'paypal', 'bank'];

        validMethods.forEach(method => {
            const request = {
                productName: 'Test Product',
                quantity: 2,
                paymentMethod: method
            };

            expect(validator.validateOrder(request)).toBe(true);
        });
    });
}); 