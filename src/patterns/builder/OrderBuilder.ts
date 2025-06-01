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
    private order: Order;

    constructor() {
        this.order = new Order();
    }

    setProductName(name: string): OrderBuilder {
        this.order.setProductName(name);
        return this;
    }

    setQuantity(quantity: number): OrderBuilder {
        this.order.setQuantity(quantity);
        return this;
    }

    setPaymentMethod(method: string): OrderBuilder {
        this.order.setPaymentMethod(method);
        return this;
    }

    build(): Order {
        return this.order;
    }
} 