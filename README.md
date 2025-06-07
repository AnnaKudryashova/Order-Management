# Order Management System

A TypeScript-based order management system implementing various design patterns including Facade, Observer, State, Strategy, and Chain of Responsibility.

## Features

- Product catalog management with predefined products
- Order creation with quantity and payment method selection
- Real-time order status updates with notifications
- Multiple payment methods (Credit Card, PayPal, Bank Transfer)
- Order validation through Chain of Responsibility
- Interactive dashboard with simple and detailed views
- Status-based order filtering
- Real-time notifications for order status changes
- Customer and warehouse notifications for order updates
- Precise payment amount calculations

## Design Patterns Used

- **Facade Pattern**: `OrderFacade` simplifies the order management interface
- **Observer Pattern**: `CustomerObserver` and `WarehouseObserver` handle real-time order status updates
- **State Pattern**: Manages order status transitions (Pending → Processing → Shipped → Delivered)
- **Strategy Pattern**: Implements different payment methods and display strategies
- **Chain of Responsibility**: `OrderValidator` validates orders through a chain of handlers
- **Builder Pattern**: `OrderBuilder` constructs complex order objects
- **Singleton Pattern**: Manages global services (`NotificationService`, `OrderManager`, `ProductCatalog`, `OrderFacade`)

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/order-management.git
cd order-management
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Start the server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
order-management/
├── src/
│   ├── models/          # Data models (Order, Product)
│   ├── patterns/        # Design pattern implementations
│   │   ├── builder/     # OrderBuilder implementation
│   │   ├── chain/       # OrderValidator implementation
│   │   ├── facade/      # OrderFacade implementation
│   │   ├── observer/    # OrderObserver implementation
│   │   ├── state/       # OrderState implementation
│   │   └── strategy/    # Payment and Display strategies
│   ├── services/        # NotificationService
│   ├── styles/          # CSS styles
│   ├── controllers/     # UIController
│   └── main.ts          # Application entry point
├── dist/                # Compiled JavaScript files
├── package.json         # Project configuration
├── tsconfig.json        # TypeScript configuration
└── README.md           # Project documentation
```

## Key Features in Detail

### Order Management
- Create orders with product selection, quantity, and payment method
- Track order status with real-time updates
- Filter orders by status
- View order details including total amount

### Payment Processing
- Multiple payment methods (Credit Card, PayPal, Bank Transfer)
- Precise amount calculations with 2 decimal places
- Payment strategy switching at runtime

### Notifications
- Real-time status change notifications
- Customer notifications for order updates
- Warehouse notifications for order processing
- Error notifications for invalid operations

### User Interface
- Interactive dashboard with order statistics
- Simple and detailed view options
- Status-based filtering
- Order creation form with real-time total calculation

## Available Scripts

- `npm run build` - Compiles TypeScript files
- `npm start` - Starts the development server

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 