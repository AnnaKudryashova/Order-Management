import { Order } from '../src/models/Order.js';
import { Product } from '../src/models/Product.js';
import { OrderBuilder } from '../src/patterns/builder/OrderBuilder.js';
import { OrderStatus } from '../src/patterns/state/OrderState.js';

describe('Order and OrderBuilder Tests', () => {
    let testProduct: Product;
    let orderBuilder: OrderBuilder;

    beforeEach(() => {
        testProduct = new Product(1, 'Test Product', 100);
        orderBuilder = new OrderBuilder();
    });

    test('should create order with builder pattern', () => {
        const order = orderBuilder
            .setProduct(testProduct)
            .setQuantity(2)
            .setPaymentMethod('credit')
            .setOrderId(1)
            .build();

        expect(order.getId()).toBe(1);
        expect(order.getProduct()).toBe(testProduct);
        expect(order.getQuantity()).toBe(2);
        expect(order.getPaymentMethod()).toBe('credit');
        expect(order.getStatus()).toBe(OrderStatus.PENDING);
    });

    test('should throw error when building order without product', () => {
        expect(() => {
            orderBuilder
                .setQuantity(2)
                .setPaymentMethod('credit')
                .setOrderId(1)
                .build();
        }).toThrow('Product is required to build an order');
    });

    test('should calculate total amount correctly', () => {
        const order = orderBuilder
            .setProduct(testProduct)
            .setQuantity(3)
            .setPaymentMethod('credit')
            .setOrderId(1)
            .build();

        expect(order.getTotalAmount()).toBe(300); // 100 * 3
    });

    test('should update order status', () => {
        const order = orderBuilder
            .setProduct(testProduct)
            .setQuantity(1)
            .setPaymentMethod('credit')
            .setOrderId(1)
            .build();

        order.setStatus(OrderStatus.PROCESSING);
        expect(order.getStatus()).toBe(OrderStatus.PROCESSING);
    });
}); 