import { NotificationService } from '../src/services/NotificationService.js';

describe('Notification Service Tests', () => {
    let notificationService: NotificationService;
    let mockNotificationArea: HTMLElement;

    beforeEach(() => {
        // Create mock DOM elements
        mockNotificationArea = document.createElement('div');
        mockNotificationArea.className = 'notification-container';
        document.body.appendChild(mockNotificationArea);

        notificationService = NotificationService.getInstance();
        notificationService.setNotificationArea(mockNotificationArea);
    });

    afterEach(() => {
        // Clean up mock DOM elements
        document.body.innerHTML = '';
    });

    test('should create success notification', () => {
        notificationService.success('Test success message');
        const notification = mockNotificationArea.querySelector('.notification');
        expect(notification).not.toBeNull();
        expect(notification?.textContent).toContain('Test success message');
    });

    test('should create error notification', () => {
        notificationService.error('Test error message');
        const notification = mockNotificationArea.querySelector('.notification.error');
        expect(notification).not.toBeNull();
        expect(notification?.textContent).toContain('Test error message');
    });

    test('should create warning notification', () => {
        notificationService.warning('Test warning message');
        const notification = mockNotificationArea.querySelector('.notification.warning');
        expect(notification).not.toBeNull();
        expect(notification?.textContent).toContain('Test warning message');
    });

    test('should create info notification', () => {
        notificationService.info('Test info message');
        const notification = mockNotificationArea.querySelector('.notification.info');
        expect(notification).not.toBeNull();
        expect(notification?.textContent).toContain('Test info message');
    });

    test('should remove notification after timeout', (done) => {
        notificationService.success('Test message');
        const notification = mockNotificationArea.querySelector('.notification');
        expect(notification).not.toBeNull();

        // Wait for notification to be removed (5s + 0.3s animation + buffer)
        setTimeout(() => {
            try {
                const remainingNotification = mockNotificationArea.querySelector('.notification');
                expect(remainingNotification).toBeNull();
                done();
            } catch (error) {
                done(error);
            }
        }, 5500);
    }, 7000); // Increase test timeout to 7 seconds

    test('should maintain singleton instance', () => {
        const instance1 = NotificationService.getInstance();
        const instance2 = NotificationService.getInstance();
        expect(instance1).toBe(instance2);
    });
}); 