import { fakerEN_IN as faker } from "@faker-js/faker";
import { Product, CreateProductRequest } from "@/services/api/product-ep";

let productData: Product[] = [];

export const initializeFakeProducts = () => {
    if (productData.length === 0) {
        for (let i = 0; i < 15; i++) {
            productData.push({
                id: faker.string.uuid(),
                english_name: faker.commerce.productName(),
                product_code: faker.string.alphanumeric(8).toUpperCase(),
                category_id: faker.string.uuid(),
                category: {
                    id: faker.string.uuid(),
                    name: faker.commerce.department(),
                },
                base_price: parseFloat(faker.commerce.price()),
                current_stock: faker.number.int({ min: 10, max: 100 }),
                description: faker.commerce.productDescription(),
            });
        }
    }
};

export const getFakeProducts = () => {
    initializeFakeProducts();
    return productData;
};

export const addFakeProduct = (params: CreateProductRequest) => {
    const product: Product = {
        ...params,
        id: faker.string.uuid(),
        product_code: "NEW-PROD-" + faker.string.alphanumeric(4).toUpperCase(),
        current_stock: params.current_stock || 0,
        category: {
            id: params.category_id,
            name: "Mock Category",
        }
    };
    productData.push(product);
    return product;
};

export const updateFakeProduct = (id: string, params: Partial<CreateProductRequest>) => {
    const index = productData.findIndex((p) => p.id === id);
    if (index !== -1) {
        productData[index] = { ...productData[index], ...params };
        return productData[index];
    }
    return null;
};

export const deleteFakeProduct = (id: string) => {
    productData = productData.filter((p) => p.id !== id);
};
