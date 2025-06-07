import { Product } from './Product.js';
import { OrderStatus, OrderState, PendingState, ProcessingState, ShippedState, DeliveredState, CancelledState } from '../patterns/state/OrderState.js';
import { NotificationService } from '../services/NotificationService.js';
import { Observer } from '../patterns/observer/OrderObserver.js';

export class Order {
    private id: number;
    private product: Product;
    private quantity: number;
    private paymentMethod: string;
    private state: OrderState;
    private observers: Observer[] = [];
    private notificationService: NotificationService;

    constructor(id: number, product: Product, quantity: number, paymentMethod: string) {
        this.id = id;
        this.product = product;
        this.quantity = quantity;
        this.paymentMethod = paymentMethod;
        this.notificationService = NotificationService.getInstance();
        this.state = new PendingState(this, this.notificationService);
    }

    public setStatus(status: OrderStatus): void {
        if (this.state.canTransitionTo(status)) {
            const oldStatus = this.state.getStatus();
            this.state = this.state.transitionTo(status);
            if (oldStatus !== status) {
                this.notify();
            }
        } else {
            throw new Error(`Cannot change status from ${this.state.getStatus()} to ${status}. Invalid state transition.`);
        }
    }

    public getStatus(): OrderStatus {
        return this.state.getStatus();
    }

    public transitionTo(newState: OrderState): void {
        this.state = newState;
    }

    public attach(observer: Observer): void {
        this.observers.push(observer);
    }

    public detach(observer: Observer): void {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    private notify(): void {
        for (const observer of this.observers) {
            observer.update(this);
        }
    }

    public getId(): number {
        return this.id;
    }

    public getProduct(): Product {
        return this.product;
    }

    public getQuantity(): number {
        return this.quantity;
    }

    public getPaymentMethod(): string {
        return this.paymentMethod;
    }

    public getTotalAmount(): number {
        return this.product.price * this.quantity;
    }

    public getDetails(): string {
        return `Order #${this.id}: ${this.product.name}, Quantity: ${this.quantity}, Status: ${this.getStatus()}`;
    }
}