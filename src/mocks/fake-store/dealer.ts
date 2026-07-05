import { fakerEN_IN as faker } from "@faker-js/faker";

import {
    Brand,
    DealerAddress,
    DealerContactPerson,
    DealerDetails,
    DealershipType,
    DealerStatus,
    DepartmentBusinessHours,
} from "@/types/response/dealer-response";

export const createMockDealerAddress = (
    dealerId: string,
    isPrimary = false
): DealerAddress => ({
    addressId: faker.string.uuid(),
    dealerId,
    addressType: faker.helpers.arrayElement([1, 2, 3]),
    addressLine: faker.location.streetAddress(),
    state: faker.location.state(),
    zipcode: faker.location.zipCode(),
    country: "India",
    latitude: faker.location.latitude().toString(),
    longitude: faker.location.longitude().toString(),
    radius: faker.number.int({ min: 5, max: 50 }).toString(),
    isPrimary,
});

export const createMockDealerContactPerson = (
    dealerId: string,
    isUser = false
): DealerContactPerson => ({
    contactId: faker.string.uuid(),
    dealerId,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phone: faker.phone.number(),
    email: faker.internet.email(),
    isUser,
    designation: faker.person.jobTitle(),
});

export const createMockDepartmentBusinessHours = (
    dealerId: string,
    deptName: string
): DepartmentBusinessHours => ({
    deptName,
    dealerId,
    monFrom: "09:00",
    monTo: "18:00",
    tueFrom: "09:00",
    tueTo: "18:00",
    wedFrom: "09:00",
    wedTo: "18:00",
    thuFrom: "09:00",
    thuTo: "18:00",
    friFrom: "09:00",
    friTo: "18:00",
    satFrom: "10:00",
    satTo: "16:00",
    sunFrom: null,
    sunTo: null,
    timeZone: "Asia/Kolkata",
});

export const createMockDealer = (): DealerDetails => {
    const dealerId = faker.string.uuid();
    return {
        dealerId,
        dealerCode: `DLR-${faker.string.alphanumeric(5).toUpperCase()}`,
        resellerId: faker.string.uuid(),
        primaryEmail: faker.internet.email(),
        companyName: faker.company.name(),
        ownerName: faker.person.fullName(),
        phone: faker.phone.number(),
        website: faker.internet.url(),
        dealershipType: [
            faker.helpers.arrayElement([
                DealershipType.New,
                DealershipType.PreOwned,
            ]),
        ],
        brand: [
            faker.helpers.arrayElement([
                Brand.Acura,
                Brand.Audi,
                Brand.BMW,
                Brand.Honda,
                Brand.Toyota,
            ]),
        ],
        status: DealerStatus.Active,
        dealerLogoUrl: faker.image.urlLoremFlickr({ category: "business" }),
        addresses: [createMockDealerAddress(dealerId, true)],
        contactPersons: [createMockDealerContactPerson(dealerId, true)],
        departmentBusinessHours: [
            createMockDepartmentBusinessHours(dealerId, "Sales"),
            createMockDepartmentBusinessHours(dealerId, "Service"),
        ],
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
        logUsername: faker.internet.username(),
        logDts: faker.date.recent().toISOString(),
    };
};
