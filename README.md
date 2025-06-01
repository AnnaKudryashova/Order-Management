# Order Management System

A TypeScript-based order management system implementing various design patterns including Facade, Observer, State, Strategy, and Chain of Responsibility.

## Features

- Product catalog management
- Order creation and tracking
- Real-time order status updates
- Multiple payment methods
- Order validation
- Interactive dashboard
- Status-based order filtering

## Design Patterns Used

- **Facade Pattern**: Simplifies the order management interface
- **Observer Pattern**: Handles real-time order status updates
- **State Pattern**: Manages order status transitions
- **Strategy Pattern**: Implements different payment methods
- **Chain of Responsibility**: Validates orders through a chain of handlers
- **Builder Pattern**: Constructs complex order objects
- **Singleton Pattern**: Manages global services and catalogs

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
│   ├── models/          # Data models
│   ├── patterns/        # Design pattern implementations
│   ├── services/        # Utility services
│   ├── styles/          # CSS styles
│   └── main.ts          # Application entry point
├── dist/                # Compiled JavaScript files
├── tests/               # Test files
├── package.json         # Project configuration
├── tsconfig.json        # TypeScript configuration
└── README.md           # Project documentation
```

## Available Scripts

- `npm run build` - Compiles TypeScript files
- `npm start` - Starts the development server
- `npm test` - Runs tests (if configured)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 