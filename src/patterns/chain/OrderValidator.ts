import { NotificationService } from '../../services/NotificationService.js';

interface OrderRequest {
    productName: string;
    quantity: number;
    paymentMethod: string;
}

interface Handler {
    setNext(handler: Handler): Handler;
    handle(request: OrderRequest): boolean;
}

abstract class AbstractHandler implements Handler {
    protected notificationService: NotificationService;
    private nextHandler: Handler | null = null;

    constructor() {
        this.notificationService = NotificationService.getInstance();
    }

    setNext(handler: Handler): Handler {
        this.nextHandler = handler;
        return handler;
    }

    handle(request: OrderRequest): boolean {
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }
        return true;
    }
}

class ProductValidator extends AbstractHandler {
    handle(request: OrderRequest): boolean {
        if (!request.productName || request.productName.trim() === '') {
            this.notificationService.error('Product name is required');
            return false;
        }
        return super.handle(request);
    }
}

class QuantityValidator extends AbstractHandler {
    handle(request: OrderRequest): boolean {
        if (request.quantity <= 0) {
            this.notificationService.error('Quantity must be greater than 0');
            return false;
        }
        return super.handle(request);
    }
}

class PaymentValidator extends AbstractHandler {
    handle(request: OrderRequest): boolean {
        const validPaymentMethods = ['credit', 'paypal', 'bank'];
        if (!validPaymentMethods.includes(request.paymentMethod.toLowerCase())) {
            this.notificationService.error('Invalid payment method');
            return false;
        }
        return super.handle(request);
    }
}

export class OrderValidator {
    private handler: Handler;
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = NotificationService.getInstance();

        const productValidator = new ProductValidator();
        const quantityValidator = new QuantityValidator();
        const paymentValidator = new PaymentValidator();

        productValidator
            .setNext(quantityValidator)
            .setNext(paymentValidator);

        this.handler = productValidator;
    }

    validateOrder(request: OrderRequest): boolean {
        const isValid = this.handler.handle(request);
        if (isValid) {
            this.notificationService.success('Order validation successful');
        }
        return isValid;
    }
}