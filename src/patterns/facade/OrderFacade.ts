import { OrderBuilder } from '../builder/OrderBuilder.js';
import { Order as StateOrder, OrderStatus } from '../state/OrderState.js';
import { Order as ObserverOrder, CustomerObserver, WarehouseObserver } from '../observer/OrderObserver.js';
import { NotificationService } from '../../services/NotificationService.js';
import { Product } from '../../models/Product.js';
import { OrderDetails } from '../../models/OrderManager.js';

export class OrderFacade {
    private orderBuilder: OrderBuilder;
    private customerObserver: CustomerObserver;
    private warehouseObserver: WarehouseObserver;
    private notificationService: NotificationService;

    constructor() {
        this.orderBuilder = new OrderBuilder();
        this.notificationService = NotificationService.getInstance();
        this.customerObserver = new CustomerObserver('Customer');
        this.warehouseObserver = new WarehouseObserver();
    }

    createOrder(product: Product, quantity: number, paymentMethod: string, orderId: number): OrderDetails {
        const orderDetails = this.orderBuilder
            .setProduct(product)
            .setQuantity(quantity)
            .setPaymentMethod(paymentMethod)
            .setOrderId(orderId)
            .build();

        orderDetails.observerOrder.attach(this.customerObserver);
        orderDetails.observerOrder.attach(this.warehouseObserver);
        orderDetails.observerOrder.setStatus(OrderStatus.PROCESSING);

        return orderDetails;
    }

    processOrder(orderDetails: OrderDetails): void {
        orderDetails.stateOrder.setStatus(OrderStatus.PROCESSING);
        orderDetails.observerOrder.setStatus(OrderStatus.PROCESSING);
    }

    shipOrder(orderDetails: OrderDetails): void {
        orderDetails.stateOrder.setStatus(OrderStatus.SHIPPED);
        orderDetails.observerOrder.setStatus(OrderStatus.SHIPPED);
    }

    deliverOrder(orderDetails: OrderDetails): void {
        orderDetails.stateOrder.setStatus(OrderStatus.DELIVERED);
        orderDetails.observerOrder.setStatus(OrderStatus.DELIVERED);
    }

    cancelOrder(orderDetails: OrderDetails): void {
        orderDetails.stateOrder.setStatus(OrderStatus.CANCELLED);
        orderDetails.observerOrder.setStatus(OrderStatus.CANCELLED);
    }

    getOrderStatus(orderDetails: OrderDetails): OrderStatus {
        return orderDetails.stateOrder.getStatus();
    }
}