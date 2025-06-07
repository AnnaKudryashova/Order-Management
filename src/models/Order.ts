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
        this.state.setStatus(status);
        this.notify();
    }

    public getStatus(): OrderStatus {
        return this.state.getStatus();
    }

    public transitionTo(newState: OrderState): void {
        this.state = newState;
    }

    public attach(observer: Observer): void {
        this.observers.push(observer);
        this.notificationService.info('New observer attached');
    }

    public detach(observer: Observer): void {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
            this.notificationService.info('Observer detached');
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