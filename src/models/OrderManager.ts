import { Product } from './Product.js';
import { Order as ObserverOrder } from '../patterns/observer/OrderObserver.js';
import { NotificationService } from '../services/NotificationService.js';

export interface OrderDetails {
    id: number;
    product: Product;
    quantity: number;
    totalAmount: number;
    paymentMethod: string;
    status: string;
    order: ObserverOrder;
}

export class OrderManager {
    private static instance: OrderManager;
    private orders: OrderDetails[] = [];
    private nextOrderId: number = 1;
    private notificationService: NotificationService;

    private constructor() {
        this.notificationService = NotificationService.getInstance();
    }

    public static getInstance(): OrderManager {
        if (!OrderManager.instance) {
            OrderManager.instance = new OrderManager();
        }
        return OrderManager.instance;
    }

    public createOrder(product: Product, quantity: number, paymentMethod: string): OrderDetails {
        const totalAmount = product.price * quantity;
        const order = new ObserverOrder(product.name, quantity);
        
        const orderDetails: OrderDetails = {
            id: this.nextOrderId++,
            product,
            quantity,
            totalAmount,
            paymentMethod,
            status: 'pending',
            order
        };

        this.orders.push(orderDetails);
        this.notificationService.success(`Order #${orderDetails.id} created successfully`);
        return orderDetails;
    }

    public getOrders(): OrderDetails[] {
        return this.orders;
    }

    public getOrderById(id: number): OrderDetails | undefined {
        return this.orders.find(order => order.id === id);
    }

    public updateOrderStatus(id: number, status: string): void {
        const order = this.getOrderById(id);
        if (order) {
            order.status = status;
            order.order.setStatus(status);
            this.notificationService.info(`Order #${id} status updated to ${status}`);
        }
    }

    public getOrdersByStatus(status: string): OrderDetails[] {
        return this.orders.filter(order => order.status === status);
    }
} 