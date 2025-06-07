import { Product } from './Product.js';
import { OrderStatus } from '../patterns/state/OrderState.js';
import { NotificationService } from '../services/NotificationService.js';
import { OrderFacade } from '../patterns/facade/OrderFacade.js';
import { Order } from './Order.js';

export class OrderManager {
    private static instance: OrderManager;
    private orders: Order[] = [];
    private nextOrderId: number = 1;
    private notificationService: NotificationService;
    private orderFacade: OrderFacade;

    private constructor() {
        this.notificationService = NotificationService.getInstance();
        this.orderFacade = new OrderFacade();
    }

    public static getInstance(): OrderManager {
        if (!OrderManager.instance) {
            OrderManager.instance = new OrderManager();
        }
        return OrderManager.instance;
    }

    public createOrder(product: Product, quantity: number, paymentMethod: string): Order {
        const order = this.orderFacade.createOrder(product, quantity, paymentMethod, this.nextOrderId++);
        this.orders.push(order);
        this.notificationService.success(`Order #${order.getId()} created successfully`);
        return order;
    }

    public getOrders(): Order[] {
        return this.orders;
    }

    public getOrder(id: string): Order | undefined {
        return this.orders.find(order => order.getId().toString() === id);
    }

    public updateOrder(id: string, status: OrderStatus): void {
        const order = this.getOrder(id);
        if (order) {
            order.setStatus(status);
            this.notificationService.info(`Order #${id} status updated to ${status}`);
        }
    }

    public getOrdersByStatus(status: OrderStatus): Order[] {
        return this.orders.filter(order => order.getStatus() === status);
    }
} 