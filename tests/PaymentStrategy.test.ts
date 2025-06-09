import { PaymentProcessor, CreditCardStrategy, PayPalStrategy, BankTransferStrategy } from '../src/patterns/strategy/PaymentStrategy.js';
import { NotificationService } from '../src/services/NotificationService.js';

describe('Payment Strategy Tests', () => {
    let paymentProcessor: PaymentProcessor;
    let notificationService: NotificationService;

    beforeEach(() => {
        notificationService = NotificationService.getInstance();
        paymentProcessor = new PaymentProcessor(new CreditCardStrategy());
    });

    test('should process credit card payment', () => {
        const creditCardStrategy = new CreditCardStrategy();
        paymentProcessor.setStrategy(creditCardStrategy);
        paymentProcessor.processPayment(100);
        expect(creditCardStrategy.getType()).toBe('Credit Card');
    });

    test('should process PayPal payment', () => {
        const paypalStrategy = new PayPalStrategy();
        paymentProcessor.setStrategy(paypalStrategy);
        paymentProcessor.processPayment(100);
        expect(paypalStrategy.getType()).toBe('PayPal');
    });

    test('should process bank transfer payment', () => {
        const bankStrategy = new BankTransferStrategy();
        paymentProcessor.setStrategy(bankStrategy);
        paymentProcessor.processPayment(100);
        expect(bankStrategy.getType()).toBe('Bank Transfer');
    });

    test('should create correct strategy based on type', () => {
        const creditStrategy = PaymentProcessor.createStrategy('credit');
        expect(creditStrategy.getType()).toBe('Credit Card');

        const paypalStrategy = PaymentProcessor.createStrategy('paypal');
        expect(paypalStrategy.getType()).toBe('PayPal');

        const bankStrategy = PaymentProcessor.createStrategy('bank');
        expect(bankStrategy.getType()).toBe('Bank Transfer');
    });

    test('should throw error for invalid strategy type', () => {
        expect(() => {
            PaymentProcessor.createStrategy('invalid');
        }).toThrow('Invalid payment strategy type');
    });
}); 