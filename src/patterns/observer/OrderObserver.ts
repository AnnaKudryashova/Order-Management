import { NotificationService } from '../../services/NotificationService.js';
import { Order } from '../../models/Order.js';

export interface Observer {
    update(order: Order): void;
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