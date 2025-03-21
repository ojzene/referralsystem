import { Schema, model } from "mongoose";

import { IPoint, IPointRules, IReferral, ITransaction, IGift, ITransactionType } from "./interface";

import ObjectId = Schema.Types.ObjectId

const referralSchema = new Schema<IReferral>({
    pocketMoniId: { type: String, required: false },
    referralCode: { type: String, required: true },
    referredUserCode: { type: String, required: true },
    customerTier: { type: ObjectId, ref: 'CustomerTier', required: false },
    onboardingPoint: { type: Number, default: 0 },
    pointsEarned: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

const pointSchema = new Schema<IPoint>({
    userId: { type: ObjectId, ref: 'PocketUser', required: true },
    totalPoints: { type: Number, default: 0 },
});

const pointRulesSchema = new Schema<IPointRules>({
    transactionTypeId: { type: ObjectId, ref: 'TransactionType', required: true },
    type: { type: String, required: true, toLowerCase: true },
    minAmount: { type: Number, required: true },
    maxAmount: { type: Number },
    points: { type: Number, required: true }
  });

const transactionTypeSchema = new Schema<ITransactionType>({
    name: { type: String, required: true, toLowerCase: true },
    description: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});

const transactionSchema = new Schema<ITransaction>({
    referralCode: { type: String, required: false },
    referralId: { type: ObjectId, ref: 'PocketUser', required: false },
    userId: { type: ObjectId, ref: 'PocketUser', required: true },
    transactionType: { type: ObjectId, ref: 'TransactionType', required: true },
    amount: { type: Number, required: true },
    pointsEarned: { type: Number, required: true },
    beneficiaryId: { type: String, required: false },
    extraField: [{ type: String, required: false }],
    createdAt: { type: Date, default: Date.now },
});

const giftSchema = new Schema<IGift>({
    userId: { type: String, required: false },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    pointsRequired: { type: Number, required: true },
    claimedBy: [{ type: String }],
    redeemedAt: { type: Date, default: Date.now },
});

const ReferralModel = model<IReferral>('Referral', referralSchema);
const PointModel = model<IPoint>('Point', pointSchema);
const PointRulesModel = model<IPointRules>('PointRules', pointRulesSchema);
const TransactionTypeModel = model<ITransactionType>('TransactionType', transactionTypeSchema);
const TransactionModel = model<ITransaction>('Transaction', transactionSchema);
const GiftModel = model<IGift>('Gift', giftSchema);

export { ReferralModel, PointModel, PointRulesModel, TransactionTypeModel, TransactionModel, GiftModel}
