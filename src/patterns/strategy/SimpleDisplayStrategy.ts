import { DisplayStrategy } from './DisplayStrategy.js';
import { SystemStatus } from '../../types/SystemStatus.js';

export class SimpleDisplayStrategy implements DisplayStrategy {
    display(systemStatus: SystemStatus): string {
        return `
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
        `;
    }
} 