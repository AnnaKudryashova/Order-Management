import { NotificationService } from '../../services/NotificationService.js';

interface IPaymentStrategy {
    processPayment(amount: number): void;
    getType(): string;
}

export class CreditCardStrategy implements IPaymentStrategy {
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = NotificationService.getInstance();
    }

    processPayment(amount: number): void {
        this.notificationService.info(`Processing ${amount.toFixed(2)} via Credit Card`);
    }

    getType(): string {
        return 'Credit Card';
    }
}

export class PayPalStrategy implements IPaymentStrategy {
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = NotificationService.getInstance();
    }

    processPayment(amount: number): void {
        this.notificationService.info(`Processing ${amount.toFixed(2)} via PayPal`);
    }

    getType(): string {
        return 'PayPal';
    }
}

export class BankTransferStrategy implements IPaymentStrategy {
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = NotificationService.getInstance();
    }

    processPayment(amount: number): void {
        this.notificationService.info(`Processing ${amount.toFixed(2)} via Bank Transfer`);
    }

    getType(): string {
        return 'Bank Transfer';
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
        const formattedAmount = amount.toFixed(2);
        console.log(`Processing ${formattedAmount} via ${this.strategy.getType()}`);
        this.strategy.processPayment(amount);
        console.log(`Payment of ${formattedAmount} processed successfully`);
    }

    static createStrategy(type: string): IPaymentStrategy {
        const notificationService = NotificationService.getInstance();
        
        switch (type.toLowerCase()) {
            case 'credit':
                return new CreditCardStrategy();
            case 'paypal':
                return new PayPalStrategy();
            case 'bank':
                return new BankTransferStrategy();
            default:
                notificationService.error('Invalid payment strategy type');
                throw new Error('Invalid payment strategy type');
        }
    }
} 