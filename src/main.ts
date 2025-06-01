// Import pattern implementations
import { OrderBuilder } from './patterns/builder/OrderBuilder.js';
import { Order as StateOrder } from './patterns/state/OrderState.js';
import { Order as ObserverOrder, CustomerObserver, WarehouseObserver } from './patterns/observer/OrderObserver.js';
import { OrderFacade } from './patterns/facade/OrderFacade.js';
import { PaymentProcessor } from './patterns/strategy/PaymentStrategy.js';
import { OrderValidator } from './patterns/chain/OrderValidator.js';
import { NotificationService } from './services/NotificationService.js';
import { ProductCatalog } from './models/Product.js';
import { OrderManager } from './models/OrderManager.js';

// Initialize UI elements
document.addEventListener('DOMContentLoaded', () => {
    const notificationService = NotificationService.getInstance();
    const productCatalog = ProductCatalog.getInstance();
    const orderManager = OrderManager.getInstance();
    
    notificationService.info('System initialized');
    
    const homeBtn = document.getElementById('homeBtn');
    const ordersBtn = document.getElementById('ordersBtn');
    const createOrderBtn = document.getElementById('createOrderBtn');
    const mainContent = document.getElementById('mainContent');

    if (!homeBtn || !ordersBtn || !createOrderBtn || !mainContent) {
        notificationService.error('Required DOM elements not found');
        return;
    }

    // Initialize pattern implementations
    const orderFacade = new OrderFacade();
    const paymentProcessor = new PaymentProcessor(PaymentProcessor.createStrategy('credit'));
    const orderValidator = new OrderValidator();

    // Define display strategies
    const displayStrategies = {
        simple: (systemStatus: any) => `
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
        
        detailed: (systemStatus: any, orders: any[]) => `
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

    // Make display strategies available globally
    (window as any).displayStrategies = displayStrategies;

    // Event listeners
    homeBtn.addEventListener('click', () => {
        notificationService.info('Navigating to home');
        
        const orders = orderManager.getOrders();
        const systemStatus = {
            totalOrders: orders.length,
            pendingOrders: orderManager.getOrdersByStatus('pending').length,
            processingOrders: orderManager.getOrdersByStatus('processing').length,
            shippedOrders: orderManager.getOrdersByStatus('shipped').length,
            deliveredOrders: orderManager.getOrdersByStatus('delivered').length,
            cancelledOrders: orderManager.getOrdersByStatus('cancelled').length,
            totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0)
        };

        mainContent.innerHTML = `
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

        // Add event listeners for view switching
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
    });

    ordersBtn.addEventListener('click', () => {
        notificationService.info('Loading orders list');
        
        const orders = orderManager.getOrders();
        const orderStates = {
            all: { color: '#808080', label: 'All Orders' },
            pending: { color: '#ffd700', label: 'Pending' },
            processing: { color: '#87ceeb', label: 'Processing' },
            shipped: { color: '#98fb98', label: 'Shipped' },
            delivered: { color: '#90ee90', label: 'Delivered' },
            cancelled: { color: '#ffb6c1', label: 'Cancelled' }
        };

        const updateOrderStatus = (orderId: number, status: string) => {
            orderManager.updateOrderStatus(orderId, status);
            ordersBtn.click(); // Refresh the orders list
        };

        const filterOrders = (status: string) => {
            const filteredOrders = status === 'all' 
                ? orders 
                : orders.filter(order => order.status === status);
            
            const ordersList = document.getElementById('ordersList');
            if (ordersList) {
                ordersList.innerHTML = filteredOrders.map(order => `
                    <div class="order-item">
                        <h3>Order #${order.id}</h3>
                        <p>Product: ${order.product.name}</p>
                        <p>Quantity: ${order.quantity}</p>
                        <p>Total Amount: $${order.totalAmount.toFixed(2)}</p>
                        <p>Payment Method: ${order.paymentMethod}</p>
                        <p>Status: <span class="status-badge ${order.status}">${order.status}</span></p>
                        <div class="order-actions">
                            <button onclick="updateOrderStatus(${order.id}, 'processing')">Process</button>
                            <button onclick="updateOrderStatus(${order.id}, 'shipped')">Ship</button>
                            <button onclick="updateOrderStatus(${order.id}, 'delivered')">Deliver</button>
                            <button onclick="updateOrderStatus(${order.id}, 'cancelled')">Cancel</button>
                        </div>
                    </div>
                `).join('');
            }
        };

        mainContent.innerHTML = `
            <h2>Orders List</h2>
            <div class="order-states">
                ${Object.entries(orderStates).map(([state, { color, label }]) => `
                    <div class="state-indicator" style="background-color: ${color}" onclick="filterOrders('${state}')">
                        ${label}
                    </div>
                `).join('')}
            </div>
            <div id="ordersList">
                ${orders.map(order => `
                    <div class="order-item">
                        <h3>Order #${order.id}</h3>
                        <p>Product: ${order.product.name}</p>
                        <p>Quantity: ${order.quantity}</p>
                        <p>Total Amount: $${order.totalAmount.toFixed(2)}</p>
                        <p>Payment Method: ${order.paymentMethod}</p>
                        <p>Status: <span class="status-badge ${order.status}">${order.status}</span></p>
                        <div class="order-actions">
                            <button onclick="updateOrderStatus(${order.id}, 'processing')">Process</button>
                            <button onclick="updateOrderStatus(${order.id}, 'shipped')">Ship</button>
                            <button onclick="updateOrderStatus(${order.id}, 'delivered')">Deliver</button>
                            <button onclick="updateOrderStatus(${order.id}, 'cancelled')">Cancel</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Make functions available globally
        (window as any).updateOrderStatus = updateOrderStatus;
        (window as any).filterOrders = filterOrders;
    });

    createOrderBtn.addEventListener('click', () => {
        notificationService.info('Opening order creation form');
        const products = productCatalog.getProducts();
        
        mainContent.innerHTML = `
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

        // Add updateTotal function to window
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

        const form = document.getElementById('orderForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const productId = parseInt((document.getElementById('productId') as HTMLSelectElement).value);
                const quantity = parseInt((document.getElementById('quantity') as HTMLInputElement).value);
                const paymentMethod = (document.getElementById('paymentMethod') as HTMLSelectElement).value;

                const product = productCatalog.getProductById(productId);
                if (!product) {
                    notificationService.error('Invalid product selected');
                    return;
                }

                // Validate order using Chain of Responsibility
                const isValid = orderValidator.validateOrder({ 
                    productName: product.name, 
                    quantity, 
                    paymentMethod 
                });
                
                if (isValid) {
                    // Create order using OrderManager
                    const orderDetails = orderManager.createOrder(product, quantity, paymentMethod);
                    
                    // Process payment using Strategy pattern
                    paymentProcessor.setStrategy(PaymentProcessor.createStrategy(paymentMethod));
                    paymentProcessor.processPayment(orderDetails.totalAmount);
                    
                    notificationService.success('Order created successfully!');
                    mainContent.innerHTML = '<h2>Order Created Successfully!</h2>';
                } else {
                    notificationService.error('Order validation failed');
                }
            });
        }
    });

    // Set initial content
    mainContent.innerHTML = '<h2>Welcome to Order Management System</h2>';
}); 