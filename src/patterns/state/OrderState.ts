import { NotificationService } from '../../services/NotificationService.js';

export enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled'
}

export interface OrderState {
    getStatus(): OrderStatus;
    canTransitionTo(status: OrderStatus): boolean;
    transitionTo(status: OrderStatus): OrderState;
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

    abstract getStatus(): OrderStatus;
    abstract canTransitionTo(status: OrderStatus): boolean;
    abstract transitionTo(status: OrderStatus): OrderState;

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
    getStatus(): OrderStatus {
        return OrderStatus.PENDING;
    }

    canTransitionTo(status: OrderStatus): boolean {
        return [OrderStatus.PROCESSING, OrderStatus.CANCELLED].includes(status);
    }

    transitionTo(status: OrderStatus): OrderState {
        if (!this.canTransitionTo(status)) {
            throw new Error(`Cannot transition from ${this.getStatus()} to ${status}`);
        }
        switch (status) {
            case OrderStatus.PROCESSING:
                return new ProcessingState(this.order, this.notificationService);
            case OrderStatus.CANCELLED:
                return new CancelledState(this.order, this.notificationService);
            default:
                throw new Error(`Invalid transition from ${this.getStatus()} to ${status}`);
        }
    }
}

export class ProcessingState extends AbstractOrderState {
    getStatus(): OrderStatus {
        return OrderStatus.PROCESSING;
    }

    canTransitionTo(status: OrderStatus): boolean {
        return [OrderStatus.SHIPPED, OrderStatus.CANCELLED].includes(status);
    }

    transitionTo(status: OrderStatus): OrderState {
        if (!this.canTransitionTo(status)) {
            throw new Error(`Cannot transition from ${this.getStatus()} to ${status}`);
        }
        switch (status) {
            case OrderStatus.SHIPPED:
                return new ShippedState(this.order, this.notificationService);
            case OrderStatus.CANCELLED:
                return new CancelledState(this.order, this.notificationService);
            default:
                throw new Error(`Invalid transition from ${this.getStatus()} to ${status}`);
        }
    }
}

export class ShippedState extends AbstractOrderState {
    getStatus(): OrderStatus {
        return OrderStatus.SHIPPED;
    }

    canTransitionTo(status: OrderStatus): boolean {
        return [OrderStatus.DELIVERED].includes(status);
    }

    transitionTo(status: OrderStatus): OrderState {
        if (!this.canTransitionTo(status)) {
            throw new Error(`Cannot transition from ${this.getStatus()} to ${status}`);
        }
        switch (status) {
            case OrderStatus.DELIVERED:
                return new DeliveredState(this.order, this.notificationService);
            default:
                throw new Error(`Invalid transition from ${this.getStatus()} to ${status}`);
        }
    }
}

export class DeliveredState extends AbstractOrderState {
    getStatus(): OrderStatus {
        return OrderStatus.DELIVERED;
    }

    canTransitionTo(status: OrderStatus): boolean {
        return false; // No transitions allowed from delivered state
    }

    transitionTo(status: OrderStatus): OrderState {
        throw new Error(`Cannot transition from ${this.getStatus()} to ${status}`);
    }
}

export class CancelledState extends AbstractOrderState {
    getStatus(): OrderStatus {
        return OrderStatus.CANCELLED;
    }

    canTransitionTo(status: OrderStatus): boolean {
        return false; // No transitions allowed from cancelled state
    }

    transitionTo(status: OrderStatus): OrderState {
        throw new Error(`Cannot transition from ${this.getStatus()} to ${status}`);
    }
}