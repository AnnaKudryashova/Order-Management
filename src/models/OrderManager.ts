import { Product } from './Product.js';
import { Order as ObserverOrder } from '../patterns/observer/OrderObserver.js';
import { NotificationService } from '../services/NotificationService.js';
import { Order as StateOrder, OrderStatus } from '../patterns/state/OrderState.js';
import { OrderFacade } from '../patterns/facade/OrderFacade.js';

export interface OrderDetails {
    id: number;
    product: Product;
    quantity: number;
    totalAmount: number;
    paymentMethod: string;
    status: OrderStatus;
    stateOrder: StateOrder;
    observerOrder: ObserverOrder;
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
        
        // Use Facade to create and initialize the order
        const orderFacade = new OrderFacade();
        orderFacade.createOrder(product.name, quantity, paymentMethod);
        
        const orderDetails: OrderDetails = {
            id: this.nextOrderId++,
            product,
            quantity,
            totalAmount,
            paymentMethod,
            status: OrderStatus.PENDING,
            stateOrder: orderFacade.getOrder(),
            observerOrder: new ObserverOrder(product.name, quantity)
        };

        this.orders.push(orderDetails);
        this.notificationService.success(`Order #${orderDetails.id} created successfully`);
        return orderDetails;
    }

    public getOrders(): OrderDetails[] {
        return this.orders;
    }

    public getOrder(id: string): OrderDetails | undefined {
        return this.orders.find(order => order.id.toString() === id);
    }

    public updateOrder(id: string, stateOrder: StateOrder): void {
        const order = this.getOrder(id);
        if (order) {
            order.stateOrder = stateOrder;
            order.status = stateOrder.getStatus();
            order.observerOrder.setStatus(stateOrder.getStatus());
            this.notificationService.info(`Order #${id} status updated to ${stateOrder.getStatus()}`);
        }
    }

    public getOrdersByStatus(status: OrderStatus): OrderDetails[] {
        return this.orders.filter(order => order.status === status);
    }
} 