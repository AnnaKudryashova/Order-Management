import { NotificationService } from '../../services/NotificationService.js';

interface IPaymentStrategy {
    processPayment(amount: number): void;
}

class CreditCardPayment implements IPaymentStrategy {
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = NotificationService.getInstance();
    }

    processPayment(amount: number): void {
        this.notificationService.info(`Processing ${amount} via Credit Card`);
    }
}

class PayPalPayment implements IPaymentStrategy {
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = NotificationService.getInstance();
    }

    processPayment(amount: number): void {
        this.notificationService.info(`Processing ${amount} via PayPal`);
    }
}

class BankTransferPayment implements IPaymentStrategy {
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = NotificationService.getInstance();
    }

    processPayment(amount: number): void {
        this.notificationService.info(`Processing ${amount} via Bank Transfer`);
    }
}

export class PaymentProcessor {
    private strategy: IPaymentStrategy;
    private notificationService: NotificationService;

    constructor(strategy: IPaymentStrategy) {
        this.strategy = strategy;
        this.notificationService = NotificationService.getInstance();
    }

    setStrategy(strategy: IPaymentStrategy): void {
        this.strategy = strategy;
        this.notificationService.info('Payment strategy updated');
    }

    processPayment(amount: number): void {
        this.strategy.processPayment(amount);
        this.notificationService.success(`Payment of ${amount} processed successfully`);
    }

    static createStrategy(type: string): IPaymentStrategy {
        const notificationService = NotificationService.getInstance();
        
        switch (type.toLowerCase()) {
            case 'credit':
                return new CreditCardPayment();
            case 'paypal':
                return new PayPalPayment();
            case 'bank':
                return new BankTransferPayment();
            default:
                notificationService.error('Invalid payment strategy type');
                throw new Error('Invalid payment strategy type');
        }
    }
} 