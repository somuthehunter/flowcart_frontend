import { fakerEN_IN as faker } from "@faker-js/faker";
import { Bill, BillItem, CreateBillRequest } from "@/services/api/bill-ep";

let billData: Bill[] = [];

export const initializeFakeBills = () => {
    if (billData.length === 0) {
        for (let i = 0; i < 10; i++) {
            const items: BillItem[] = [];
            let totalAmount = 0;
            
            for (let j = 0; j < faker.number.int({ min: 1, max: 5 }); j++) {
                const quantity = faker.number.int({ min: 1, max: 10 });
                const price = parseFloat(faker.commerce.price());
                const total = quantity * price;
                totalAmount += total;
                
                items.push({
                    id: faker.string.uuid(),
                    quantity,
                    unit_price: price.toFixed(2),
                    total_price: total.toFixed(2),
                    product: {
                        id: faker.string.uuid(),
                        english_name: faker.commerce.productName(),
                        product_code: faker.string.alphanumeric(8),
                    }
                });
            }
            
            billData.push({
                id: faker.string.uuid(),
                invoice_number: `INV-${faker.number.int({ min: 1000, max: 9999 })}`,
                customer_name: faker.person.fullName(),
                customer_mobile: faker.phone.number({ style: 'national' }),
                total_amount: totalAmount.toFixed(2),
                payment_status: "PAID",
                items,
                created_at: new Date(faker.date.past()).toISOString(),
            });
        }
    }
};

export const getFakeBills = () => {
    initializeFakeBills();
    return billData;
};

export const getFakeBillDetails = (id: string) => {
    return billData.find((b) => b.id === id) || null;
};

export const addFakeBill = (params: CreateBillRequest) => {
    let totalAmount = 0;
    
    const items = params.items.map(item => {
        const price = 50; // Mock price
        const total = item.quantity * price;
        totalAmount += total;
        return {
            id: faker.string.uuid(),
            quantity: item.quantity,
            unit_price: price.toFixed(2),
            total_price: total.toFixed(2),
            product: {
                id: item.product_id,
                english_name: "Mock Product",
                product_code: "MOCK-001"
            }
        };
    });
    
    const bill: Bill = {
        id: faker.string.uuid(),
        invoice_number: `INV-${faker.number.int({ min: 1000, max: 9999 })}`,
        customer_name: params.customer_name,
        customer_mobile: params.customer_mobile,
        total_amount: totalAmount.toFixed(2),
        payment_status: "PAID",
        items,
        created_at: new Date().toISOString(),
    };
    
    billData.push(bill);
    return bill;
};
