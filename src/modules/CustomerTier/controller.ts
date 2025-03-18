import { BaseController } from "../baseController";
import { CustomerTierService } from './service';

export class CustomerTierController extends BaseController {
    private _customerTierService = new CustomerTierService();

    public createCustomerTier = async (parsedBody: any) => {
        try {
            const customerTier = await this._customerTierService.createCustomerTier(parsedBody);
            return customerTier;
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public getCustomerTiers = async () => {
        try {
            const customerTier = await this._customerTierService.getCustomerTiers();
            return customerTier; 
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public getCustomerTierById = async (tierId:string) => {
        try {
            const customerTier = await this._customerTierService.getCustomerTierById(tierId);
            return customerTier; 
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public updateCustomerTier = async (tierId: any, parsedBody: any) => {
        try {
            const customerTier = await this._customerTierService.updateCustomerTier(tierId, parsedBody);
            return customerTier; 
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public deleteCustomerTier = async (tierId: any) => {
        try {
            const customerTier = await this._customerTierService.deleteCustomerTier(tierId);
            return customerTier; 
        } catch (error) {
            return this.sendResponse(error);
        }
    } 
    
}
