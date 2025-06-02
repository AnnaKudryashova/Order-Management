// Import pattern implementations
import { OrderStatus } from './patterns/state/OrderState.js';
import { OrderFacade } from './patterns/facade/OrderFacade.js';
import { PaymentProcessor } from './patterns/strategy/PaymentStrategy.js';
import { OrderValidator } from './patterns/chain/OrderValidator.js';
import { NotificationService } from './services/NotificationService.js';
import { ProductCatalog } from './models/Product.js';
import { OrderManager } from './models/OrderManager.js';

// Type definitions
interface SystemStatus {
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
}

interface OrderState {
    color: string;
    label: string;
}

type OrderStates = Record<string, OrderState>;

// Display strategies
const displayStrategies = {
    simple: (systemStatus: SystemStatus): string => `
        <h3>Simple Overview</h3>
        <div class="dashboard-cards">
            <div class="dashboard-card">
                <h4>Total Orders</h4>
                <p class="number">${systemStatus.totalOrders}</p>
            </div>
            <div class="dashboard-card">
                <h4>Total Revenue</h4>
                <p class="number">$${systemStatus.totalRevenue.toFixed(2)}</p>
            </div>
        </div>
    `,

    detailed: (systemStatus: SystemStatus, orders: any[]): string => `
        <h3>Detailed Overview</h3>
        <div class="dashboard-cards">
            <div class="dashboard-card">
                <h4>Total Orders</h4>
                <p class="number">${systemStatus.totalOrders}</p>
            </div>
            <div class="dashboard-card">
                <h4>Total Revenue</h4>
                <p class="number">$${systemStatus.totalRevenue.toFixed(2)}</p>
            </div>
            <div class="dashboard-card">
                <h4>Pending Orders</h4>
                <p class="number">${systemStatus.pendingOrders}</p>
            </div>
            <div class="dashboard-card">
                <h4>Processing Orders</h4>
                <p class="number">${systemStatus.processingOrders}</p>
            </div>
            <div class="dashboard-card">
                <h4>Shipped Orders</h4>
                <p class="number">${systemStatus.shippedOrders}</p>
            </div>
            <div class="dashboard-card">
                <h4>Delivered Orders</h4>
                <p class="number">${systemStatus.deliveredOrders}</p>
            </div>
            <div class="dashboard-card">
                <h4>Cancelled Orders</h4>
                <p class="number">${systemStatus.cancelledOrders}</p>
            </div>
        </div>
        <div class="recent-orders">
            <h4>Recent Orders</h4>
            <table class="orders-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.slice(-5).map(order => `
                        <tr>
                            <td>#${order.id}</td>
                            <td>${order.product.name}</td>
                            <td>${order.quantity}</td>
                            <td>$${order.totalAmount.toFixed(2)}</td>
                            <td><span class="status-badge ${order.status}">${order.status}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `
};

// UI Controller class to handle all UI-related operations
class UIController {
    private readonly notificationService: NotificationService;
    private readonly productCatalog: ProductCatalog;
    private readonly orderManager: OrderManager;
    private readonly orderFacade: OrderFacade;
    private readonly paymentProcessor: PaymentProcessor;
    private readonly orderValidator: OrderValidator;
    protected readonly mainContent: HTMLElement | null;

    constructor() {
        this.notificationService = NotificationService.getInstance();
        this.productCatalog = ProductCatalog.getInstance();
        this.orderManager = OrderManager.getInstance();
        this.orderFacade = new OrderFacade();
        this.paymentProcessor = new PaymentProcessor(PaymentProcessor.createStrategy('credit'));
        this.orderValidator = new OrderValidator();
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
            totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0)
        };
    }

    private setupViewSwitching(systemStatus: SystemStatus, orders: any[]): void {
        const simpleViewBtn = document.getElementById('simpleViewBtn');
        const detailedViewBtn = document.getElementById('detailedViewBtn');
        const summaryContent = document.getElementById('summaryContent');

        if (simpleViewBtn && summaryContent) {
            simpleViewBtn.addEventListener('click', () => {
                summaryContent.innerHTML = displayStrategies.simple(systemStatus);
            });
        }

        if (detailedViewBtn && summaryContent) {
            detailedViewBtn.addEventListener('click', () => {
                summaryContent.innerHTML = displayStrategies.detailed(systemStatus, orders);
            });
        }
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
                this.paymentProcessor.processPayment(orderDetails.totalAmount);

                this.notificationService.success('Order created successfully!');
                if (this.mainContent) {
                    this.mainContent.innerHTML = '<h2>Order Created Successfully!</h2>';
                }
            } else {
                this.notificationService.error('Order validation failed');
            }
        });
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

    public initializeHomeView(): void {
        if (!this.mainContent) return;

        this.notificationService.info('Navigating to home');
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
                    ${displayStrategies.simple(systemStatus)}
                </div>
            </div>
        `;

        this.setupViewSwitching(systemStatus, orders);
    }

    public initializeOrdersView(): void {
        if (!this.mainContent) return;

        this.notificationService.info('Loading orders list');
        const orders = this.orderManager.getOrders();
        const orderStates: OrderStates = {
            all: { color: '#808080', label: 'All Orders' },
            pending: { color: '#ffd700', label: 'Pending' },
            processing: { color: '#87ceeb', label: 'Processing' },
            shipped: { color: '#98fb98', label: 'Shipped' },
            delivered: { color: '#90ee90', label: 'Delivered' },
            cancelled: { color: '#ffb6c1', label: 'Cancelled' }
        };

        const updateOrderStatus = (orderId: string, status: string) => {
            const order = this.orderManager.getOrder(orderId);
            if (!order) {
                this.notificationService.error('Order not found');
                return;
            }

            try {
                const orderFacade = new OrderFacade(
                    order.product.name,
                    order.quantity,
                    order.status
                );

                switch (status) {
                    case OrderStatus.PROCESSING:
                        orderFacade.processOrder();
                        break;
                    case OrderStatus.SHIPPED:
                        orderFacade.shipOrder();
                        break;
                    case OrderStatus.DELIVERED:
                        orderFacade.deliverOrder();
                        break;
                    case OrderStatus.CANCELLED:
                        orderFacade.cancelOrder();
                        break;
                }

                // Update the order in the manager with the new status
                this.orderManager.updateOrder(orderId, orderFacade.getOrder());
                this.initializeOrdersView();
            } catch (error: any) {
                console.error('Error updating order status:', error);
                this.notificationService.error(error.message || 'Failed to update order status');
            }
        };

        const filterOrders = (status: string) => {
            const filteredOrders = status === 'all'
                ? orders
                : orders.filter(order => order.status === status);

            const ordersList = document.getElementById('ordersList');
            if (ordersList) {
                ordersList.innerHTML = this.renderOrdersList(filteredOrders, updateOrderStatus);
            }
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
                ${this.renderOrdersList(orders, updateOrderStatus)}
            </div>
        `;

        // Make functions available globally
        (window as any).updateOrderStatus = updateOrderStatus;
        (window as any).filterOrders = filterOrders;
    }

    private renderOrdersList(orders: any[], updateOrderStatus: (id: string, status: string) => void): string {
        return orders.map(order => `
            <div class="order-item">
                <h3>Order #${order.id}</h3>
                <p>Product: ${order.product.name}</p>
                <p>Quantity: ${order.quantity}</p>
                <p>Total Amount: $${order.totalAmount.toFixed(2)}</p>
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
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const ui = new UIController();

    const homeBtn = document.getElementById('homeBtn');
    const ordersBtn = document.getElementById('ordersBtn');
    const createOrderBtn = document.getElementById('createOrderBtn');

    if (!homeBtn || !ordersBtn || !createOrderBtn) {
        console.error('Required DOM elements not found');
        return;
    }

    // Initialize views
    ui.initializeHomeView();
    ui.initializeOrdersView();
    ui.initializeCreateOrderView();

    // Add event listeners
    homeBtn.addEventListener('click', () => ui.initializeHomeView());
    ordersBtn.addEventListener('click', () => ui.initializeOrdersView());
    createOrderBtn.addEventListener('click', () => ui.initializeCreateOrderView());
});