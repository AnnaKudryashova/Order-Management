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

export interface OrderContext {
    transitionTo(newState: OrderState): void;
}

abstract class AbstractOrderState implements OrderState {
    protected order: OrderContext;
    protected notificationService: NotificationService;

    constructor(order: OrderContext, notificationService: NotificationService) {
        this.order = order;
        this.notificationService = notificationService;
    }

    abstract setStatus(status: OrderStatus): void;
    abstract getStatus(): OrderStatus;

    protected handleInvalidTransition(currentStatus: OrderStatus, targetStatus: OrderStatus): void {
        if (currentStatus === targetStatus) {
            this.notificationService.info(`Order is already in ${currentStatus} status`);
            return;
        }
        const errorMessage = `Cannot change status from ${currentStatus} to ${targetStatus}. Invalid state transition.`;
        this.notificationService.error(errorMessage);
    }
}

export class PendingState extends AbstractOrderState {
    setStatus(status: OrderStatus): void {
        if (status === OrderStatus.PENDING) {
            this.notificationService.info('Order is already pending');
            return;
        }

        switch (status) {
            case OrderStatus.PROCESSING:
                this.order.transitionTo(new ProcessingState(this.order, this.notificationService));
                break;
            case OrderStatus.CANCELLED:
                this.order.transitionTo(new CancelledState(this.order, this.notificationService));
                break;
            default:
                this.handleInvalidTransition(OrderStatus.PENDING, status);
        }
    }

    getStatus(): OrderStatus {
        return OrderStatus.PENDING;
    }
}

export class ProcessingState extends AbstractOrderState {
    setStatus(status: OrderStatus): void {
        if (status === OrderStatus.PROCESSING) {
            this.notificationService.info('Order is already being processed');
            return;
        }

        switch (status) {
            case OrderStatus.SHIPPED:
                this.order.transitionTo(new ShippedState(this.order, this.notificationService));
                break;
            case OrderStatus.CANCELLED:
                this.order.transitionTo(new CancelledState(this.order, this.notificationService));
                break;
            default:
                this.handleInvalidTransition(OrderStatus.PROCESSING, status);
        }
    }

    getStatus(): OrderStatus {
        return OrderStatus.PROCESSING;
    }
}

export class ShippedState extends AbstractOrderState {
    setStatus(status: OrderStatus): void {
        if (status === OrderStatus.SHIPPED) {
            this.notificationService.info('Order is already shipped');
            return;
        }

        switch (status) {
            case OrderStatus.DELIVERED:
                this.order.transitionTo(new DeliveredState(this.order, this.notificationService));
                break;
            case OrderStatus.CANCELLED:
                this.order.transitionTo(new CancelledState(this.order, this.notificationService));
                break;
            default:
                this.handleInvalidTransition(OrderStatus.SHIPPED, status);
        }
    }

    getStatus(): OrderStatus {
        return OrderStatus.SHIPPED;
    }
}

export class DeliveredState extends AbstractOrderState {
    setStatus(status: OrderStatus): void {
        if (status === OrderStatus.DELIVERED) {
            this.notificationService.info('Order is already delivered');
            return;
        }
        this.handleInvalidTransition(OrderStatus.DELIVERED, status);
    }

    getStatus(): OrderStatus {
        return OrderStatus.DELIVERED;
    }
}

export class CancelledState extends AbstractOrderState {
    setStatus(status: OrderStatus): void {
        if (status === OrderStatus.CANCELLED) {
            this.notificationService.info('Order is already cancelled');
            return;
        }
        this.handleInvalidTransition(OrderStatus.CANCELLED, status);
    }

    getStatus(): OrderStatus {
        return OrderStatus.CANCELLED;
    }
}