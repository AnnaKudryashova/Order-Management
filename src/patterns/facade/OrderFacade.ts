import { OrderBuilder } from '../builder/OrderBuilder.js';
import { OrderStatus } from '../state/OrderState.js';
import { CustomerObserver, WarehouseObserver } from '../observer/OrderObserver.js';
import { NotificationService } from '../../services/NotificationService.js';
import { Product } from '../../models/Product.js';
import { Order } from '../../models/Order.js';

export class OrderFacade {
    private static instance: OrderFacade;
    private orderBuilder: OrderBuilder;
    private customerObserver: CustomerObserver;
    private warehouseObserver: WarehouseObserver;
    private notificationService: NotificationService;

    private constructor() {
        this.orderBuilder = new OrderBuilder();
        this.notificationService = NotificationService.getInstance();
        this.customerObserver = new CustomerObserver('Customer');
        this.warehouseObserver = new WarehouseObserver();
    }

    public static getInstance(): OrderFacade {
        if (!OrderFacade.instance) {
            OrderFacade.instance = new OrderFacade();
        }
        return OrderFacade.instance;
    }

    createOrder(product: Product, quantity: number, paymentMethod: string, orderId: number): Order {
        const order = this.orderBuilder
            .setProduct(product)
            .setQuantity(quantity)
            .setPaymentMethod(paymentMethod)
            .setOrderId(orderId)
            .build();

        order.attach(this.customerObserver);
        order.attach(this.warehouseObserver);
        return order;
    }

    processOrder(order: Order): void {
        order.setStatus(OrderStatus.PROCESSING);
    }

    shipOrder(order: Order): void {
        order.setStatus(OrderStatus.SHIPPED);
    }

    deliverOrder(order: Order): void {
        order.setStatus(OrderStatus.DELIVERED);
    }

    cancelOrder(order: Order): void {
        order.setStatus(OrderStatus.CANCELLED);
    }

    getOrderStatus(order: Order): OrderStatus {
        return order.getStatus();
    }
}