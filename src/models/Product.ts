export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
}

export class ProductCatalog {
    private static instance: ProductCatalog;
    private products: Product[] = [
        { id: 1, name: 'Laptop', price: 999.99, description: 'High-performance laptop' },
        { id: 2, name: 'Smartphone', price: 499.99, description: 'Latest model smartphone' },
        { id: 3, name: 'Headphones', price: 99.99, description: 'Wireless noise-cancelling headphones' },
        { id: 4, name: 'Tablet', price: 299.99, description: '10-inch tablet' },
        { id: 5, name: 'Smartwatch', price: 199.99, description: 'Fitness and health tracking watch' }
    ];

    private constructor() {}

    public static getInstance(): ProductCatalog {
        if (!ProductCatalog.instance) {
            ProductCatalog.instance = new ProductCatalog();
        }
        return ProductCatalog.instance;
    }

    public getProducts(): Product[] {
        return this.products;
    }

    public getProductById(id: number): Product | undefined {
        return this.products.find(product => product.id === id);
    }
} 