import { SystemStatus } from '../../types/SystemStatus.js';

export interface DisplayStrategy {
    display(systemStatus: SystemStatus, orders?: any[]): string;
} 