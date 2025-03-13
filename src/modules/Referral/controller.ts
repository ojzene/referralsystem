import { BaseController } from "../baseController";
import { ReferralService } from './service';

export class ReferralController extends BaseController {
    private _referralService = new ReferralService();

    public recordReferral = async (parsedBody: any) => {
        try {
            return await this._referralService.recordReferral(parsedBody);
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public recordTransaction = async (parsedBody: any) => {
        try {
            return await this._referralService.recordTransaction(parsedBody);
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public seedTransactionType = async () => {
        try {
            return await this._referralService.seedTransactionType();
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public seedGifts = async () => {
        try {
            return await this._referralService.seedGifts();
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public seedPointRules = async () => {
        try {
            return await this._referralService.seedPointRules();
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public createUpdateTransactionType = async (parsedBody: any) => {
        try {
            return await this._referralService.createUpdateTransactionType(parsedBody);
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public getTransactionType = async () => {
        try {
            return await this._referralService.getTransactionType();
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public createPointRules = async (parsedBody: any) => {
        try {
            return await this._referralService.createPointRules(parsedBody);
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public getPointRules = async () => {
        try {
            return await this._referralService.getPointRules();
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public deletePointRules = async (parsedParams: any) => {
        try {
            return await this._referralService.deletePointRules(parsedParams);
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public deleteTransactionType = async (parsedParams: any) => {
        try {
            return await this._referralService.deleteTransactionType(parsedParams);
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public createUpdateGift = async (parsedBody: any) => {
        try {
            return await this._referralService.createUpdateGift(parsedBody);
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public deleteGift = async (parsedParams: any) => {
        try {
            return await this._referralService.deleteGift(parsedParams);
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public redeemGift = async (parsedBody: any) => {
        try {
            return await this._referralService.redeemGift(parsedBody);
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public getLeaderboard = async () => {
        try {
            return await this._referralService.getLeaderboard();
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public getGifts = async () => {
        try {
            return await this._referralService.getGifts();
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public getUserPoints = async () => {
        try {
            return await this._referralService.getUserPoints();
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public getTransactions = async () => {
        try {
            return await this._referralService.getTransactions();
        } catch (error) {
            return this.sendResponse(error);
        }
    }

}
