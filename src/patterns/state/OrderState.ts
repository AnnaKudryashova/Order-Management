import { NotificationService } from '../../services/NotificationService.js';

interface OrderStateInterface {
    process(order: Order): void;
    ship(order: Order): void;
    deliver(order: Order): void;
    cancel(order: Order): void;
}

export class Order {
    private state: OrderStateInterface;
    private status: string;
    private notificationService: NotificationService;

    constructor() {
        this.state = new PendingState();
        this.status = 'pending';
        this.notificationService = NotificationService.getInstance();
    }

    setState(state: OrderStateInterface): void {
        this.state = state;
    }

    setStatus(status: string): void {
        this.status = status;
    }

    getStatus(): string {
        return this.status;
    }

    process(): void {
        this.state.process(this);
    }

    ship(): void {
        this.state.ship(this);
    }

    deliver(): void {
        this.state.deliver(this);
    }

    cancel(): void {
        this.state.cancel(this);
    }
}

class PendingState implements OrderStateInterface {
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = NotificationService.getInstance();
    }

    process(order: Order): void {
        order.setState(new ProcessingState());
        order.setStatus('processing');
        this.notificationService.info('Order is now being processed');
    }

    ship(order: Order): void {
        this.notificationService.error('Cannot ship pending order');
    }

    deliver(order: Order): void {
        this.notificationService.error('Cannot deliver pending order');
    }

    cancel(order: Order): void {
        order.setState(new CancelledState());
        order.setStatus('cancelled');
        this.notificationService.warning('Order has been cancelled');
    }
}

class ProcessingState implements OrderStateInterface {
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = NotificationService.getInstance();
    }

    process(order: Order): void {
        this.notificationService.warning('Order is already being processed');
    }

    ship(order: Order): void {
        order.setState(new ShippedState());
        order.setStatus('shipped');
        this.notificationService.success('Order has been shipped');
    }

    deliver(order: Order): void {
        this.notificationService.error('Cannot deliver processing order');
    }

    cancel(order: Order): void {
        order.setState(new CancelledState());
        order.setStatus('cancelled');
        this.notificationService.warning('Order has been cancelled');
    }
}

class ShippedState implements OrderStateInterface {
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = NotificationService.getInstance();
    }

    process(order: Order): void {
        this.notificationService.error('Cannot process shipped order');
    }

    ship(order: Order): void {
        this.notificationService.warning('Order is already shipped');
    }

    deliver(order: Order): void {
        order.setState(new DeliveredState());
        order.setStatus('delivered');
        this.notificationService.success('Order has been delivered');
    }

    cancel(order: Order): void {
        this.notificationService.error('Cannot cancel shipped order');
    }
}

class DeliveredState implements OrderStateInterface {
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = NotificationService.getInstance();
    }

    process(order: Order): void {
        this.notificationService.error('Cannot process delivered order');
    }

    ship(order: Order): void {
        this.notificationService.error('Cannot ship delivered order');
    }

    deliver(order: Order): void {
        this.notificationService.warning('Order is already delivered');
    }

    cancel(order: Order): void {
        this.notificationService.error('Cannot cancel delivered order');
    }
}

class CancelledState implements OrderStateInterface {
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = NotificationService.getInstance();
    }

    process(order: Order): void {
        this.notificationService.error('Cannot process cancelled order');
    }

    ship(order: Order): void {
        this.notificationService.error('Cannot ship cancelled order');
    }

    deliver(order: Order): void {
        this.notificationService.error('Cannot deliver cancelled order');
    }

    cancel(order: Order): void {
        this.notificationService.warning('Order is already cancelled');
    }
} 