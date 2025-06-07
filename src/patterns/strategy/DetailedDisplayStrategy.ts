import { DisplayStrategy } from './DisplayStrategy.js';
import { SystemStatus } from '../../types/SystemStatus.js';

export class DetailedDisplayStrategy implements DisplayStrategy {
    display(systemStatus: SystemStatus, orders: any[]): string {
        return `
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
                                <td>$${order.getTotalAmount().toFixed(2)}</td>
                                <td><span class="status-badge ${order.status}">${order.status}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
} 