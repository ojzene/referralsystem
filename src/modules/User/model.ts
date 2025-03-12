import { Schema, model } from "mongoose";
import { IPocketUser } from "./interface";

const pocketUserSchema = new Schema<IPocketUser>({
    pocketMoniId: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    picture: { type: String, required: false },
    userType: { type: String, required: false },
    isActive: { type: Boolean, required: false },
    isVerified: { type: Boolean, required: false },
    staffType: { type: String, required: false },
    referralCode: { type: String, required: false },
    referralCount: { type: Number, required: false },
    referredBy: { type: String, required: false },
    customerTier: { type: String, required: false },
    extraField: [{ type: String, required: false }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, required: false },
});

const PocketUserModel = model<IPocketUser>('PocketUser', pocketUserSchema);

export { PocketUserModel }
