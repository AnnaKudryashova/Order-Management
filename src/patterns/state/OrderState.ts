import { NotificationService } from '../../services/NotificationService.js';

export enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled'
}

export interface OrderState {
    setStatus(status: OrderStatus): void;
    getStatus(): OrderStatus;
}

export class Order {
    private state: OrderState;
    private productName: string;
    private quantity: number;
    private notificationService: NotificationService;

    constructor(productName: string, quantity: number, notificationService: NotificationService) {
        this.productName = productName;
        this.quantity = quantity;
        this.notificationService = notificationService;
        this.state = new PendingState(this, this.notificationService);
    }

    public setStatus(status: OrderStatus): void {
        this.state.setStatus(status);
    }

    public getStatus(): OrderStatus {
        return this.state.getStatus();
    }

    public getProductName(): string {
        return this.productName;
    }

    public getQuantity(): number {
        return this.quantity;
    }

    public transitionTo(newState: OrderState): void {
        this.state = newState;
    }
}

abstract class AbstractOrderState implements OrderState {
    protected order: Order;
    protected notificationService: NotificationService;

    constructor(order: Order, notificationService: NotificationService) {
        this.order = order;
        this.notificationService = notificationService;
    }

    abstract setStatus(status: OrderStatus): void;
    abstract getStatus(): OrderStatus;

    protected handleInvalidTransition(currentStatus: OrderStatus, targetStatus: OrderStatus): void {
        const errorMessage = `Cannot change status from ${currentStatus} to ${targetStatus}. Invalid state transition.`;
        // this.notificationService.error(errorMessage);
        throw new Error(errorMessage);
    }
}

class PendingState extends AbstractOrderState {
    setStatus(status: OrderStatus): void {
        switch (status) {
            case OrderStatus.PROCESSING:
                this.order.transitionTo(new ProcessingState(this.order, this.notificationService));
                this.notificationService.info('Order is now being processed');
                break;
            case OrderStatus.CANCELLED:
                this.order.transitionTo(new CancelledState(this.order, this.notificationService));
                this.notificationService.info('Order has been cancelled');
                break;
            default:
                this.handleInvalidTransition(OrderStatus.PENDING, status);
        }
    }

    getStatus(): OrderStatus {
        return OrderStatus.PENDING;
    }
}

class ProcessingState extends AbstractOrderState {
    setStatus(status: OrderStatus): void {
        switch (status) {
            case OrderStatus.SHIPPED:
                this.order.transitionTo(new ShippedState(this.order, this.notificationService));
                this.notificationService.info('Order has been shipped');
                break;
            case OrderStatus.CANCELLED:
                this.order.transitionTo(new CancelledState(this.order, this.notificationService));
                this.notificationService.info('Order has been cancelled');
                break;
            default:
                this.handleInvalidTransition(OrderStatus.PROCESSING, status);
        }
    }

    getStatus(): OrderStatus {
        return OrderStatus.PROCESSING;
    }
}

class ShippedState extends AbstractOrderState {
    setStatus(status: OrderStatus): void {
        switch (status) {
            case OrderStatus.DELIVERED:
                this.order.transitionTo(new DeliveredState(this.order, this.notificationService));
                this.notificationService.info('Order has been delivered');
                break;
            case OrderStatus.CANCELLED:
                this.order.transitionTo(new CancelledState(this.order, this.notificationService));
                this.notificationService.info('Order has been cancelled');
                break;
            default:
                this.handleInvalidTransition(OrderStatus.SHIPPED, status);
        }
    }

    getStatus(): OrderStatus {
        return OrderStatus.SHIPPED;
    }
}

class DeliveredState extends AbstractOrderState {
    setStatus(status: OrderStatus): void {
        this.handleInvalidTransition(OrderStatus.DELIVERED, status);
    }

    getStatus(): OrderStatus {
        return OrderStatus.DELIVERED;
    }
}

class CancelledState extends AbstractOrderState {
    setStatus(status: OrderStatus): void {
        this.handleInvalidTransition(OrderStatus.CANCELLED, status);
    }

    getStatus(): OrderStatus {
        return OrderStatus.CANCELLED;
    }
}