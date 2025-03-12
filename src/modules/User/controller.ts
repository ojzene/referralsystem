import { BaseController } from "../baseController";
import { UserService } from './service';

export class UserController extends BaseController {
    private _userService = new UserService();

    public createPocketUser = async (parsedBody: any) => {
        try {
            return await this._userService.createPocketUser(parsedBody);
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public getUsers = async () => {
        try {
            const user = await this._userService.getUsers();
            return user; 
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public getUserById = async (userId:string) => {
        try {
            const user = await this._userService.getUserById(userId);
            return user; 
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public updateUser = async (userId: any, parsedBody: any) => {
        try {
            const user = await this._userService.updateUser(userId, parsedBody);
            return user; 
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public deleteUser = async (phoneNumber: number) => {
        try {
            const user = await this._userService.deleteUser(phoneNumber);
            return user; 
        } catch (error) {
            return this.sendResponse(error);
        }
    } 
    
    // upload profile picture
    public uploadProfilePhoto = async (parsedFile: any, userCode: any) => {
        try {
            const user = await this._userService.uploadProfilePhoto(parsedFile, userCode);
            return user; 
        } catch (error) {
            return this.sendResponse(error);
        }
    }

    public getUserPoints = async (userId:string) => {
        try {
            const user = await this._userService.getUserPoints(userId);
            return user; 
        } catch (error) {
            return this.sendResponse(error);
        }
    }

}
