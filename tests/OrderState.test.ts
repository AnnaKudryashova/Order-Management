import { Order } from '../src/models/Order.js';
import { Product } from '../src/models/Product.js';
import { OrderStatus } from '../src/patterns/state/OrderState.js';
import { NotificationService } from '../src/services/NotificationService.js';

describe('Order State Tests', () => {
    let order: Order;
    let testProduct: Product;
    let notificationService: NotificationService;

    beforeEach(() => {
        notificationService = NotificationService.getInstance();
        testProduct = new Product(1, 'Test Product', 100);
        order = new Order(1, testProduct, 1, 'credit');
    });

    test('should start with pending status', () => {
        expect(order.getStatus()).toBe(OrderStatus.PENDING);
    });

    test('should transition from pending to processing', () => {
        order.setStatus(OrderStatus.PROCESSING);
        expect(order.getStatus()).toBe(OrderStatus.PROCESSING);
    });

    test('should transition from processing to shipped', () => {
        order.setStatus(OrderStatus.PROCESSING);
        order.setStatus(OrderStatus.SHIPPED);
        expect(order.getStatus()).toBe(OrderStatus.SHIPPED);
    });

    test('should transition from shipped to delivered', () => {
        order.setStatus(OrderStatus.PROCESSING);
        order.setStatus(OrderStatus.SHIPPED);
        order.setStatus(OrderStatus.DELIVERED);
        expect(order.getStatus()).toBe(OrderStatus.DELIVERED);
    });

    test('should not allow transition from delivered to other states', () => {
        order.setStatus(OrderStatus.PROCESSING);
        order.setStatus(OrderStatus.SHIPPED);
        order.setStatus(OrderStatus.DELIVERED);
        
        expect(() => {
            order.setStatus(OrderStatus.PROCESSING);
        }).toThrow();
    });

    test('should allow cancellation from pending state', () => {
        order.setStatus(OrderStatus.CANCELLED);
        expect(order.getStatus()).toBe(OrderStatus.CANCELLED);
    });

    test('should allow cancellation from processing state', () => {
        order.setStatus(OrderStatus.PROCESSING);
        order.setStatus(OrderStatus.CANCELLED);
        expect(order.getStatus()).toBe(OrderStatus.CANCELLED);
    });

    test('should not allow transition from cancelled state', () => {
        order.setStatus(OrderStatus.CANCELLED);
        
        expect(() => {
            order.setStatus(OrderStatus.PROCESSING);
        }).toThrow();
    });
}); 