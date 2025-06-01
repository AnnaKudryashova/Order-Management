import { OrderBuilder } from '../builder/OrderBuilder.js';
import { Order as StateOrder } from '../state/OrderState.js';
import { Order as ObserverOrder, CustomerObserver, WarehouseObserver } from '../observer/OrderObserver.js';
import { NotificationService } from '../../services/NotificationService.js';

export class OrderFacade {
    private orderBuilder: OrderBuilder;
    private stateOrder: StateOrder;
    private observerOrder: ObserverOrder;
    private customerObserver: CustomerObserver;
    private warehouseObserver: WarehouseObserver;
    private notificationService: NotificationService;

    constructor() {
        this.orderBuilder = new OrderBuilder();
        this.stateOrder = new StateOrder();
        this.observerOrder = new ObserverOrder('', 0);
        this.customerObserver = new CustomerObserver('Customer');
        this.warehouseObserver = new WarehouseObserver();
        this.notificationService = NotificationService.getInstance();
    }

    createOrder(productName: string, quantity: number, paymentMethod: string): void {
        // Use Builder pattern
        const order = this.orderBuilder
            .setProductName(productName)
            .setQuantity(quantity)
            .setPaymentMethod(paymentMethod)
            .build();

        // Use State pattern
        this.stateOrder.process();

        // Use Observer pattern
        this.observerOrder = new ObserverOrder(productName, quantity);
        this.observerOrder.attach(this.customerObserver);
        this.observerOrder.attach(this.warehouseObserver);
        this.observerOrder.setStatus('processing');

        this.notificationService.success('Order created successfully: ' + order.getDetails());
    }

    processOrder(): void {
        this.stateOrder.process();
        this.observerOrder.setStatus('processing');
        this.notificationService.info('Order is being processed');
    }

    shipOrder(): void {
        this.stateOrder.ship();
        this.observerOrder.setStatus('shipped');
        this.notificationService.success('Order has been shipped');
    }

    deliverOrder(): void {
        this.stateOrder.deliver();
        this.observerOrder.setStatus('delivered');
        this.notificationService.success('Order has been delivered');
    }

    cancelOrder(): void {
        this.stateOrder.cancel();
        this.observerOrder.setStatus('cancelled');
        this.notificationService.warning('Order has been cancelled');
    }

    getOrderStatus(): string {
        return this.stateOrder.getStatus();
    }
} 