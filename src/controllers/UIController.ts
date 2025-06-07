import { OrderStatus } from '../patterns/state/OrderState.js';
import { OrderFacade } from '../patterns/facade/OrderFacade.js';
import { PaymentProcessor } from '../patterns/strategy/PaymentStrategy.js';
import { OrderValidator } from '../patterns/chain/OrderValidator.js';
import { NotificationService } from '../services/NotificationService.js';
import { ProductCatalog } from '../models/Product.js';
import { OrderManager } from '../models/OrderManager.js';
import { DisplayStrategy } from '../patterns/strategy/DisplayStrategy.js';
import { SimpleDisplayStrategy } from '../patterns/strategy/SimpleDisplayStrategy.js';
import { DetailedDisplayStrategy } from '../patterns/strategy/DetailedDisplayStrategy.js';
import { SystemStatus } from '../types/SystemStatus.js';

interface OrderState {
    color: string;
    label: string;
}

type OrderStates = Record<string, OrderState>;

export class UIController {
    private readonly notificationService: NotificationService;
    private readonly productCatalog: ProductCatalog;
    private readonly orderManager: OrderManager;
    private readonly orderFacade: OrderFacade;
    private readonly paymentProcessor: PaymentProcessor;
    private readonly orderValidator: OrderValidator;
    private displayStrategy: DisplayStrategy;
    protected readonly mainContent: HTMLElement | null;

    constructor() {
        this.notificationService = NotificationService.getInstance();
        this.productCatalog = ProductCatalog.getInstance();
        this.orderManager = OrderManager.getInstance();
        this.orderFacade = new OrderFacade();
        this.paymentProcessor = new PaymentProcessor(PaymentProcessor.createStrategy('credit'));
        this.orderValidator = new OrderValidator();
        this.displayStrategy = new SimpleDisplayStrategy();
        this.mainContent = document.getElementById('mainContent');
    }

    private getSystemStatus(): SystemStatus {
        const orders = this.orderManager.getOrders();
        return {
            totalOrders: orders.length,
            pendingOrders: this.orderManager.getOrdersByStatus(OrderStatus.PENDING).length,
            processingOrders: this.orderManager.getOrdersByStatus(OrderStatus.PROCESSING).length,
            shippedOrders: this.orderManager.getOrdersByStatus(OrderStatus.SHIPPED).length,
            deliveredOrders: this.orderManager.getOrdersByStatus(OrderStatus.DELIVERED).length,
            cancelledOrders: this.orderManager.getOrdersByStatus(OrderStatus.CANCELLED).length,
            totalRevenue: orders.reduce((sum, order) => sum + order.getTotalAmount(), 0)
        };
    }

    public initializeHomeView(): void {
        if (!this.mainContent) return;

        const orders = this.orderManager.getOrders();
        const systemStatus = this.getSystemStatus();

        this.mainContent.innerHTML = `
            <h2>Welcome to Order Management System</h2>
            <div class="dashboard">
                <div class="summary-toggle">
                    <button id="simpleViewBtn">Simple View</button>
                    <button id="detailedViewBtn">Detailed View</button>
                </div>
                <div id="summaryContent">
                    ${this.displayStrategy.display(systemStatus, orders)}
                </div>
            </div>
        `;

        this.setupViewSwitching(systemStatus, orders);
    }

    private setupViewSwitching(systemStatus: SystemStatus, orders: any[]): void {
        const simpleViewBtn = document.getElementById('simpleViewBtn');
        const detailedViewBtn = document.getElementById('detailedViewBtn');
        const summaryContent = document.getElementById('summaryContent');

        if (simpleViewBtn && summaryContent) {
            simpleViewBtn.addEventListener('click', () => {
                this.displayStrategy = new SimpleDisplayStrategy();
                summaryContent.innerHTML = this.displayStrategy.display(systemStatus);
            });
        }

        if (detailedViewBtn && summaryContent) {
            detailedViewBtn.addEventListener('click', () => {
                this.displayStrategy = new DetailedDisplayStrategy();
                summaryContent.innerHTML = this.displayStrategy.display(systemStatus, orders);
            });
        }
    }

    public initializeOrdersView(): void {
        if (!this.mainContent) return;

        const orders = this.orderManager.getOrders();
        const orderStates: OrderStates = {
            all: { color: '#808080', label: 'All Orders' },
            pending: { color: '#ffd700', label: 'Pending' },
            processing: { color: '#87ceeb', label: 'Processing' },
            shipped: { color: '#98fb98', label: 'Shipped' },
            delivered: { color: '#90ee90', label: 'Delivered' },
            cancelled: { color: '#ffb6c1', label: 'Cancelled' }
        };

        this.mainContent.innerHTML = `
            <h2>Orders List</h2>
            <div class="order-states">
                ${Object.entries(orderStates).map(([state, { color, label }]) => `
                    <div class="state-indicator" style="background-color: ${color}" onclick="filterOrders('${state}')">
                        ${label}
                    </div>
                `).join('')}
            </div>
            <div id="ordersList">
                ${this.renderOrdersList(orders)}
            </div>
        `;

        (window as any).updateOrderStatus = this.updateOrderStatus.bind(this);
        (window as any).filterOrders = this.filterOrders.bind(this);
    }

    private renderOrdersList(orders: any[]): string {
        return orders.map(order => `
            <div class="order-item">
                <h3>Order #${order.id}</h3>
                <p>Product: ${order.product.name}</p>
                <p>Quantity: ${order.quantity}</p>
                <p>Total Amount: $${order.getTotalAmount().toFixed(2)}</p>
                <p>Payment Method: ${order.paymentMethod}</p>
                <p>Status: <span class="status-badge ${order.status}">${order.status}</span></p>
                <div class="order-actions">
                    <button onclick="updateOrderStatus('${order.id}', '${OrderStatus.PROCESSING}')">Process</button>
                    <button onclick="updateOrderStatus('${order.id}', '${OrderStatus.SHIPPED}')">Ship</button>
                    <button onclick="updateOrderStatus('${order.id}', '${OrderStatus.DELIVERED}')">Deliver</button>
                    <button onclick="updateOrderStatus('${order.id}', '${OrderStatus.CANCELLED}')">Cancel</button>
                </div>
            </div>
        `).join('');
    }

    private updateOrderStatus(orderId: string, status: string): void {
        const order = this.orderManager.getOrder(orderId);
        if (!order) {
            this.notificationService.error('Order not found');
            return;
        }

        try {
            switch (status) {
                case OrderStatus.PROCESSING:
                    this.orderFacade.processOrder(order);
                    break;
                case OrderStatus.SHIPPED:
                    this.orderFacade.shipOrder(order);
                    break;
                case OrderStatus.DELIVERED:
                    this.orderFacade.deliverOrder(order);
                    break;
                case OrderStatus.CANCELLED:
                    this.orderFacade.cancelOrder(order);
                    break;
            }

            this.orderManager.updateOrder(orderId, order.stateOrder);
            this.initializeOrdersView();
        } catch (error: any) {
            console.error('Error updating order status:', error);
            this.notificationService.error(error.message || 'Failed to update order status');
        }
    }

    private filterOrders(status: string): void {
        const orders = status === 'all'
            ? this.orderManager.getOrders()
            : this.orderManager.getOrdersByStatus(status as OrderStatus);

        const ordersList = document.getElementById('ordersList');
        if (ordersList) {
            ordersList.innerHTML = this.renderOrdersList(orders);
        }
    }

    public initializeCreateOrderView(): void {
        if (!this.mainContent) return;

        const products = this.productCatalog.getProducts();

        this.mainContent.innerHTML = `
            <h2>Create New Order</h2>
            <form id="orderForm">
                <div>
                    <label for="productId">Product:</label>
                    <select id="productId" required onchange="updateTotal()">
                        <option value="">Select a product</option>
                        ${products.map(product => `
                            <option value="${product.id}" data-price="${product.price}">
                                ${product.name} - $${product.price.toFixed(2)}
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div>
                    <label for="quantity">Quantity:</label>
                    <input type="number" id="quantity" required min="1" onchange="updateTotal()">
                </div>
                <div>
                    <label for="paymentMethod">Payment Method:</label>
                    <select id="paymentMethod" required>
                        <option value="credit">Credit Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="bank">Bank Transfer</option>
                    </select>
                </div>
                <div class="total-amount">
                    <label>Total Amount:</label>
                    <span id="totalAmount">$0.00</span>
                </div>
                <button type="submit">Create Order</button>
            </form>
        `;

        this.setupTotalAmountCalculator();
        this.setupOrderForm();
    }

    private setupTotalAmountCalculator(): void {
        (window as any).updateTotal = () => {
            const productSelect = document.getElementById('productId') as HTMLSelectElement;
            const quantityInput = document.getElementById('quantity') as HTMLInputElement;
            const totalAmountSpan = document.getElementById('totalAmount');

            if (productSelect.value && quantityInput.value) {
                const price = parseFloat(productSelect.options[productSelect.selectedIndex].dataset.price || '0');
                const quantity = parseInt(quantityInput.value);
                const total = price * quantity;
                if (totalAmountSpan) {
                    totalAmountSpan.textContent = `$${total.toFixed(2)}`;
                }
            }
        };
    }

    private setupOrderForm(): void {
        const form = document.getElementById('orderForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const productId = parseInt((document.getElementById('productId') as HTMLSelectElement).value);
            const quantity = parseInt((document.getElementById('quantity') as HTMLInputElement).value);
            const paymentMethod = (document.getElementById('paymentMethod') as HTMLSelectElement).value;

            const product = this.productCatalog.getProductById(productId);
            if (!product) {
                this.notificationService.error('Invalid product selected');
                return;
            }

            const isValid = this.orderValidator.validateOrder({
                productName: product.name,
                quantity,
                paymentMethod
            });

            if (isValid) {
                const orderDetails = this.orderManager.createOrder(product, quantity, paymentMethod);
                this.paymentProcessor.setStrategy(PaymentProcessor.createStrategy(paymentMethod));
                this.paymentProcessor.processPayment(orderDetails.getTotalAmount());

                this.notificationService.success('Order created successfully!');
                if (this.mainContent) {
                    this.mainContent.innerHTML = '<h2>Order Created Successfully!</h2>';
                }
            } else {
                this.notificationService.error('Order validation failed');
            }
        });
    }
}