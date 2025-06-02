import { OrderBuilder } from '../builder/OrderBuilder.js';
import { Order as StateOrder, OrderStatus } from '../state/OrderState.js';
import { Order as ObserverOrder, CustomerObserver, WarehouseObserver } from '../observer/OrderObserver.js';
import { NotificationService } from '../../services/NotificationService.js';

export class OrderFacade {
    private orderBuilder: OrderBuilder;
    private stateOrder: StateOrder;
    private observerOrder: ObserverOrder;
    private customerObserver: CustomerObserver;
    private warehouseObserver: WarehouseObserver;
    private notificationService: NotificationService;

    constructor(productName: string = '', quantity: number = 0, currentStatus: OrderStatus = OrderStatus.PENDING) {
        this.orderBuilder = new OrderBuilder();
        this.notificationService = NotificationService.getInstance();
        this.stateOrder = new StateOrder(productName, quantity, this.notificationService);
        this.observerOrder = new ObserverOrder(productName, quantity);
        this.customerObserver = new CustomerObserver('Customer');
        this.warehouseObserver = new WarehouseObserver();

        // Set initial state through proper transitions
        if (currentStatus !== OrderStatus.PENDING) {
            try {
                switch (currentStatus) {
                    case OrderStatus.PROCESSING:
                        this.processOrder();
                        break;
                    case OrderStatus.SHIPPED:
                        this.processOrder();
                        this.shipOrder();
                        break;
                    case OrderStatus.DELIVERED:
                        this.processOrder();
                        this.shipOrder();
                        this.deliverOrder();
                        break;
                    case OrderStatus.CANCELLED:
                        this.cancelOrder();
                        break;
                }
            } catch (error) {
                console.error('Error setting initial state:', error);
                // If there's an error, reset to pending state
                this.stateOrder = new StateOrder(productName, quantity, this.notificationService);
                this.observerOrder.setStatus(OrderStatus.PENDING);
            }
        }
    }

    createOrder(productName: string, quantity: number, paymentMethod: string): void {
        // Use Builder pattern
        const order = this.orderBuilder
            .setProductName(productName)
            .setQuantity(quantity)
            .setPaymentMethod(paymentMethod)
            .build();

        // Use State pattern
        this.stateOrder = new StateOrder(productName, quantity, this.notificationService);

        // Use Observer pattern
        this.observerOrder = new ObserverOrder(productName, quantity);
        this.observerOrder.attach(this.customerObserver);
        this.observerOrder.attach(this.warehouseObserver);
        this.observerOrder.setStatus(OrderStatus.PROCESSING);

        this.notificationService.success('Order created successfully: ' + order.getDetails());
    }

    processOrder(): void {
        try {
            this.stateOrder.setStatus(OrderStatus.PROCESSING);
            this.observerOrder.setStatus(OrderStatus.PROCESSING);
            this.notificationService.info('Order is being processed');
        } catch (error: any) {
            this.notificationService.error('Invalid state transition: ' + error.message);
            throw error;
        }
    }

    shipOrder(): void {
        try {
            this.stateOrder.setStatus(OrderStatus.SHIPPED);
            this.observerOrder.setStatus(OrderStatus.SHIPPED);
            this.notificationService.success('Order has been shipped');
        } catch (error: any) {
            this.notificationService.error('Invalid state transition: ' + error.message);
            throw error;
        }
    }

    deliverOrder(): void {
        try {
            this.stateOrder.setStatus(OrderStatus.DELIVERED);
            this.observerOrder.setStatus(OrderStatus.DELIVERED);
            this.notificationService.success('Order has been delivered');
        } catch (error: any) {
            this.notificationService.error('Invalid state transition: ' + error.message);
            throw error;
        }
    }

    cancelOrder(): void {
        try {
            this.stateOrder.setStatus(OrderStatus.CANCELLED);
            this.observerOrder.setStatus(OrderStatus.CANCELLED);
            this.notificationService.warning('Order has been cancelled');
        } catch (error: any) {
            this.notificationService.error('Invalid state transition: ' + error.message);
            throw error;
        }
    }

    getOrderStatus(): OrderStatus {
        return this.stateOrder.getStatus();
    }

    public getOrder(): StateOrder {
        return this.stateOrder;
    }
}