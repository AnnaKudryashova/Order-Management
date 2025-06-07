import { Product } from '../../models/Product.js';
import { Order as StateOrder, OrderStatus } from '../state/OrderState.js';
import { Order as ObserverOrder } from '../observer/OrderObserver.js';
import { OrderDetails } from '../../models/OrderManager.js';
import { NotificationService } from '../../services/NotificationService.js';

export class Order {
    private productName: string = '';
    private quantity: number = 0;
    private paymentMethod: string = '';
    private status: string = 'pending';

    setProductName(name: string): void {
        this.productName = name;
    }

    setQuantity(quantity: number): void {
        this.quantity = quantity;
    }

    setPaymentMethod(method: string): void {
        this.paymentMethod = method;
    }

    setStatus(status: string): void {
        this.status = status;
    }

    getDetails(): string {
        return `Order: ${this.productName}, Quantity: ${this.quantity}, Payment: ${this.paymentMethod}, Status: ${this.status}`;
    }
}

export class OrderBuilder {
    private product: Product | null = null;
    private quantity: number = 0;
    private paymentMethod: string = '';
    private orderId: number = 0;
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = NotificationService.getInstance();
    }

    setProduct(product: Product): OrderBuilder {
        this.product = product;
        return this;
    }

    setQuantity(quantity: number): OrderBuilder {
        this.quantity = quantity;
        return this;
    }

    setPaymentMethod(method: string): OrderBuilder {
        this.paymentMethod = method;
        return this;
    }

    setOrderId(id: number): OrderBuilder {
        this.orderId = id;
        return this;
    }

    build(): OrderDetails {
        if (!this.product) {
            throw new Error('Product is required to build an order');
        }

        const stateOrder = new StateOrder(this.product.name, this.quantity, this.notificationService);
        const observerOrder = new ObserverOrder(this.product.name, this.quantity);
        const totalAmount = this.product.price * this.quantity;

        return {
            id: this.orderId,
            product: this.product,
            quantity: this.quantity,
            totalAmount,
            paymentMethod: this.paymentMethod,
            status: OrderStatus.PENDING,
            stateOrder,
            observerOrder,
            getTotalAmount: () => totalAmount
        };
    }
}