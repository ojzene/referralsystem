import { Schema, model } from "mongoose";
import { ICustomerTier } from "./interface";

const customerTierSchema = new Schema<ICustomerTier>({
    name: { type: String, required: true, lowerCase: true },
    point: { type: Number, required: false, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, required: false },
});

const CustomerTierModel = model<ICustomerTier>('CustomerTier', customerTierSchema);

export { CustomerTierModel}
