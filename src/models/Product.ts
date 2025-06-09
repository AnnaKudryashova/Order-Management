export class Product {
    constructor(
        public id: number,
        public name: string,
        public price: number,
        public description: string = ''
    ) {}
}

export class ProductCatalog {
    private static instance: ProductCatalog;
    private products: Product[] = [
        new Product(1, 'Laptop', 999.99, 'High-performance laptop'),
        new Product(2, 'Smartphone', 499.99, 'Latest model smartphone'),
        new Product(3, 'Headphones', 99.99, 'Wireless noise-cancelling headphones'),
        new Product(4, 'Tablet', 299.99, '10-inch tablet'),
        new Product(5, 'Smartwatch', 199.99, 'Fitness and health tracking watch')
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