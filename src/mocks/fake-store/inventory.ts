import { fakerEN_IN as faker } from "@faker-js/faker";
import {
    StockItem,
    PurchaseItem,
    AdjustmentItem,
    LedgerItem,
} from "@/services/api/inventory-ep";

let stockData: StockItem[] = [];
let purchaseHistory: PurchaseItem[] = [];
let adjustmentHistory: AdjustmentItem[] = [];
let stockLedger: LedgerItem[] = [];

export const initializeFakeInventory = () => {
    if (stockData.length === 0) {
        for (let i = 0; i < 15; i++) {
            const currentStock = faker.number.int({ min: 10, max: 200 });
            stockData.push({
                id: faker.string.uuid(),
                productName: faker.commerce.productName(),
                sku: faker.string.alphanumeric(8).toUpperCase(),
                currentStock,
                minStock: faker.number.int({ min: 10, max: 30 }),
                maxStock: faker.number.int({ min: 200, max: 500 }),
            });
        }
    }
};

export const getFakeStock = () => stockData;

export const updateFakeMinMaxStock = (
    id: string,
    minStock: number,
    maxStock: number
) => {
    const item = stockData.find((i) => i.id === id);
    if (item) {
        item.minStock = minStock;
        item.maxStock = maxStock;
    }
};

export const addFakePurchase = (
    params: Omit<PurchaseItem, "id" | "date">
) => {
    const purchase: PurchaseItem = {
        ...params,
        id: faker.string.uuid(),
        date: new Date().toISOString(),
    };
    purchaseHistory.push(purchase);
    
    // update stock
    const item = stockData.find((i) => i.sku === params.sku);
    if (item) {
        item.currentStock += params.quantity;
        
        // add to ledger
        stockLedger.push({
            id: faker.string.uuid(),
            productName: item.productName,
            sku: item.sku,
            transactionType: "Purchase",
            quantityChanged: params.quantity,
            balance: item.currentStock,
            date: purchase.date,
        });
    }
};

export const addFakeAdjustment = (
    params: Omit<AdjustmentItem, "id" | "date">
) => {
    const adjustment: AdjustmentItem = {
        ...params,
        id: faker.string.uuid(),
        date: new Date().toISOString(),
    };
    adjustmentHistory.push(adjustment);
    
    // update stock
    const item = stockData.find((i) => i.sku === params.sku);
    if (item) {
        item.currentStock += params.quantity;
        
        // add to ledger
        stockLedger.push({
            id: faker.string.uuid(),
            productName: item.productName,
            sku: item.sku,
            transactionType: "Adjustment",
            quantityChanged: params.quantity,
            balance: item.currentStock,
            date: adjustment.date,
        });
    }
};

export const getFakeHistory = () => {
    const history = [...purchaseHistory, ...adjustmentHistory];
    return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getFakeLedger = () => {
    return stockLedger.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
