import { UIController } from './controllers/UIController.js';

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