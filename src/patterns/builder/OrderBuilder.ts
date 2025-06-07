import { Product } from '../../models/Product.js';
import { Order } from '../../models/Order.js';

export class OrderBuilder {
    private product: Product | null = null;
    private quantity: number = 0;
    private paymentMethod: string = '';
    private orderId: number = 0;

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

    build(): Order {
        if (!this.product) {
            throw new Error('Product is required to build an order');
        }

        return new Order(this.orderId, this.product, this.quantity, this.paymentMethod);
    }
}