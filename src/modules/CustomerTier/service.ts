import { CustomerTierModel } from './model';

export class CustomerTierService {

    public createCustomerTier = async (parsedBody: any) => {
        const { name, point } = parsedBody;
        let tier = await CustomerTierModel.findOne({ name });
        if(tier) {
            return { success: false, statusCode: 409, message: "Tier already exists", data: null };
        } else {
            const parsedTier = {
                name: name.toLowerCase(),
                point
            }
            const newTier = new CustomerTierModel(parsedTier);
            await newTier.save();
            return { success: true, statusCode: 201, message: "Tier created successfully", data: newTier };
        }
    }

    public getCustomerTiers = async () => {
        const tiers = await CustomerTierModel.find({});
        if (tiers) return { success: true, statusCode: 200, message: "All Tiers successfully retrieved!", data: tiers };
        return { success: false, statusCode: 400,  message: "Error in fetching All Tiers", data: null };  
    }

    public getCustomerTierById = async (tierId: any) => {
        const tier = await CustomerTierModel.findById(tierId);
        if (tier) return { success: true, statusCode: 200, message: "Tier successfully retrieved!", data: tier };
        return { success: false, statusCode: 400, message: "Error in fetching Tier Details", data: null };
    }

    public updateCustomerTier = async (tierId: any, parsedBody: any) => {
        let updatedTier = await CustomerTierModel.findOne({ _id: tierId });
        if(updatedTier) {
            let name = parsedBody.name.toLowerCase();
            let point = parsedBody.point;
            
            updatedTier.name = name;
            updatedTier.point = point;
            updatedTier.updatedAt = new Date();
            await updatedTier.save();
            return { success: true, statusCode: 200, message: "Tier information updated", data: updatedTier };
        } else {
            return { success: false, statusCode: 400, message: "Tier not found", data: null };
        }
    }

    public deleteCustomerTier = async (tierId: any) => {
        const tier = await CustomerTierModel.findOneAndDelete({ _id: tierId });
        if(tier) return { success: true, statusCode: 200, message: "Tier successfully deleted!", data: tier };
        return { success: false, statusCode: 400, message: "Error in deleting Tier", data: null };
    }

}