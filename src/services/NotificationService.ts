export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export class NotificationService {
    private static instance: NotificationService;
    private notificationArea: HTMLElement;

    private constructor() {
        this.notificationArea = document.getElementById('notificationArea')!;
    }

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    public show(message: string, type: NotificationType = 'info', duration: number = 5000): void {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        this.notificationArea.appendChild(notification);

        // Remove notification after duration
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => {
                this.notificationArea.removeChild(notification);
            }, 500);
        }, duration);
    }

    public success(message: string, duration?: number): void {
        this.show(message, 'success', duration);
    }

    public error(message: string, duration?: number): void {
        this.show(message, 'error', duration);
    }

    public warning(message: string, duration?: number): void {
        this.show(message, 'warning', duration);
    }

    public info(message: string, duration?: number): void {
        this.show(message, 'info', duration);
    }
} 