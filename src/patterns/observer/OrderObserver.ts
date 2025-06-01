import { NotificationService } from '../../services/NotificationService.js';

interface Observer {
    update(order: Order): void;
}

interface Subject {
    attach(observer: Observer): void;
    detach(observer: Observer): void;
    notify(): void;
}

export class Order implements Subject {
    private observers: Observer[] = [];
    private status: string = 'pending';
    private productName: string = '';
    private quantity: number = 0;
    private notificationService: NotificationService;

    constructor(productName: string, quantity: number) {
        this.productName = productName;
        this.quantity = quantity;
        this.notificationService = NotificationService.getInstance();
    }

    attach(observer: Observer): void {
        this.observers.push(observer);
        this.notificationService.info('New observer attached');
    }

    detach(observer: Observer): void {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
            this.notificationService.info('Observer detached');
        }
    }

    notify(): void {
        for (const observer of this.observers) {
            observer.update(this);
        }
    }

    setStatus(status: string): void {
        this.status = status;
        this.notify();
    }

    getStatus(): string {
        return this.status;
    }

    getDetails(): string {
        return `Order: ${this.productName}, Quantity: ${this.quantity}, Status: ${this.status}`;
    }
}

export class CustomerObserver implements Observer {
    private name: string;
    private notificationService: NotificationService;

    constructor(name: string) {
        this.name = name;
        this.notificationService = NotificationService.getInstance();
    }

    update(order: Order): void {
        this.notificationService.info(`Notification for ${this.name}: Order status changed to ${order.getStatus()}`);
    }
}

export class WarehouseObserver implements Observer {
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = NotificationService.getInstance();
    }

    update(order: Order): void {
        if (order.getStatus() === 'processing') {
            this.notificationService.info('Warehouse: Preparing order for shipping');
        } else if (order.getStatus() === 'shipped') {
            this.notificationService.success('Warehouse: Order has been shipped');
        }
    }
} 