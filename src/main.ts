
import { UIController } from './controllers/UIController.js';

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

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UIController();

    const homeBtn = document.getElementById('homeBtn');
    const ordersBtn = document.getElementById('ordersBtn');
    const createOrderBtn = document.getElementById('createOrderBtn');

    if (!homeBtn || !ordersBtn || !createOrderBtn) {
        console.error('Required DOM elements not found');
        return;
    }

    ui.initializeHomeView();
    ui.initializeOrdersView();
    ui.initializeCreateOrderView();

    homeBtn.addEventListener('click', () => ui.initializeHomeView());
    ordersBtn.addEventListener('click', () => ui.initializeOrdersView());
    createOrderBtn.addEventListener('click', () => ui.initializeCreateOrderView());
});