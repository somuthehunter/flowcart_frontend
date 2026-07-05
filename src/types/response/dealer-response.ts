export enum DealershipType {
    New = 1,
    PreOwned = 2,
}

export enum Brand {
    Acura = 1,
    AlfaRomeo = 2,
    AstonMartin = 3,
    Audi = 4,
    Bentley = 5,
    BMW = 6,
    Bugatti = 7,
    Buick = 8,
    Cadillac = 9,
    Chevrolet = 10,
    Chrysler = 11,
    Dodge = 12,
    Ferrari = 13,
    Fiat = 14,
    Fisker = 15,
    Ford = 16,
    Genesis = 17,
    GMC = 18,
    Honda = 19,
    Hyundai = 20,
    Infiniti = 21,
    Jaguar = 22,
    Jeep = 23,
    Kia = 24,
    Lamborghini = 25,
    LandRover = 26,
    Lexus = 27,
    Lincoln = 28,
    Lotus = 29,
    Maserati = 30,
    Mazda = 31,
    McLaren = 32,
    MercedesBenz = 33,
    Mini = 34,
    Mitsubishi = 35,
    Nissan = 36,
    Porsche = 37,
    Ram = 38,
    Rivian = 39,
    RollsRoyce = 40,
    Saab = 41,
    Saturn = 42,
    Scion = 43,
    Subaru = 44,
    Tesla = 45,
    Toyota = 46,
    Volkswagen = 47,
    Volvo = 48,
}

export enum DealerStatus {
    PendingActivation = 1,
    Active = 2,
    Disable = 3,
}
export enum AddressType {
    Legal = 1,
    Billing,
    Shipping,
    Factory,
    Branch,
}

export type DealerAddress = {
    addressId: string;
    dealerId: string;
    addressType: AddressType;
    addressLine: string | null;
    state: string | null;
    zipcode: string | null;
    country: string | null;
    latitude: string;
    longitude: string;
    radius: string;
    isPrimary: boolean;
};

export type DealerContactPerson = {
    contactId: string;
    dealerId: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    email: string;
    isUser: boolean;
    designation: string | null;
};

export type DepartmentBusinessHours = {
    deptName: string;
    dealerId: string;
    monFrom: string | null;
    monTo: string | null;
    tueFrom: string | null;
    tueTo: string | null;
    wedFrom: string | null;
    wedTo: string | null;
    thuFrom: string | null;
    thuTo: string | null;
    friFrom: string | null;
    friTo: string | null;
    satFrom: string | null;
    satTo: string | null;
    sunFrom: string | null;
    sunTo: string | null;
    timeZone: string | null;
};

export type DealerDetails = {
    dealerId: string;
    dealerCode: string | null;
    resellerId: string | null;
    primaryEmail: string;
    companyName: string;
    ownerName: string | null;
    phone: string;
    website: string | null;
    dealershipType: DealershipType[];
    brand: Brand[];
    status: DealerStatus;
    dealerLogoUrl: string | null;
    addresses: DealerAddress[];
    contactPersons: DealerContactPerson[];
    departmentBusinessHours: DepartmentBusinessHours[];
    createdAt: string;
    updatedAt: string;
    logUsername: string | null;
    logDts: string;
};
