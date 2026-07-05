import { fakerEN_IN as faker } from "@faker-js/faker";
import { Category } from "@/services/api/category-ep";

let categoryData: Category[] = [];

export const initializeFakeCategories = () => {
    if (categoryData.length === 0) {
        for (let i = 0; i < 5; i++) {
            categoryData.push({
                id: faker.string.uuid(),
                name: faker.commerce.department(),
            });
        }
    }
};

export const getFakeCategories = () => {
    initializeFakeCategories();
    return categoryData;
};

export const addFakeCategory = (params: Omit<Category, "id">) => {
    const category: Category = {
        id: faker.string.uuid(),
        ...params,
    };
    
    categoryData.push(category);
    return category;
};

export const updateFakeCategory = (id: string, params: Omit<Category, "id">) => {
    const index = categoryData.findIndex((c) => c.id === id);
    if (index !== -1) {
        categoryData[index] = { ...params, id };
        return categoryData[index];
    }
    return null;
};

export const deleteFakeCategory = (id: string) => {
    categoryData = categoryData.filter((c) => c.id !== id);
};
