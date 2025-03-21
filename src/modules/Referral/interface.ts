export interface IReferral {
    pocketMoniId: any;
    referralCode: any;
    referredUserCode: any;
    customerTier: any;
    onboardingPoint: number;
    pointsEarned: number;
    createdAt: any;
}

export interface IPoint {
    userId: any;
    totalPoints: number;
}

export interface IPointRules {
    transactionTypeId: any;
    type: any;
    minAmount: number;
    maxAmount: number;
    points: number;
}

export interface ITransactionType {
    name: string;
    description: string;
    createdAt: any;
}

export interface ITransaction {
    referralCode: any;
    referralId: any;
    userId: any;
    transactionType: any;
    amount: number;
    pointsEarned: number;
    beneficiaryId: string;
    extraField: any;
    createdAt: any;
}

export interface IGift {
    userId: any;
    name: any;
    quantity: number;
    pointsRequired: number;
    redeemedAt: any;
    claimedBy: any;
}