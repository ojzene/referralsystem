export interface IReferral {
    pocketMoniId: any;
    referrerId: string;
    referredUserId: string;
    pointsEarned: number;
    createdAt: any;
}

export interface IPoint {
    userId: any;
    totalPoints: number;
}

export interface IPointRules {
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
    userId: any;
    transactionType: any;
    amount: number;
    pointsEarned: number;
    beneficiaryId: string;
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