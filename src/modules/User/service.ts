import fs from "fs";

import { PocketUserModel } from './model';
import { ReferralService } from "../Referral/service";
import { PointModel } from "../Referral";

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'daky6crds',
    api_key: '535232689428166',
    api_secret: 'edaZV3-JmJzDfWCdohUDivAEjXw'
});

export class UserService {
    private _newReferrer = new ReferralService();

    public createPocketUser = async (parsedBody: any) => {
        const { pocketMoniId, phoneNumber, firstName, lastName, staffType, referredBy, customerTier } = parsedBody;
        const emailAddress = parsedBody.email.toLowerCase();
        let user = await PocketUserModel.findOne({ 
            $or : [
                { email: emailAddress }, 
                { phoneNumber: phoneNumber }, 
                { pocketMoniId: pocketMoniId }
            ] 
        });
        if(user) {
            return { success: false, statusCode: 409, message: "User already exists", data: null };
        } else {
            const createdDate = new Date();
            const userStaffType = (staffType == 'full') ? 'full' : 'aux';
            // create referral id from first two digits of firstname and first two digit of lastname and three random numbers
            const randomNumber = Math.floor(Math.random() * 100) + 100;
            const referralCode = firstName.substring(0, 2).toUpperCase() + lastName.substring(0, 2).toUpperCase() + randomNumber;
            const parsedUser = {
                pocketMoniId,
                phoneNumber,
                firstName,
                lastName,
                email: emailAddress,
                userType: 'user',
                staffType: userStaffType,
                isVerified: true,
                isActive: true,
                referralCode,
                referralCount: 0,
                referredBy,
                customerTier,
                createdDate
            }
            const newUser = new PocketUserModel(parsedUser);
            await newUser.save();

            if(referredBy != null || referredBy != "") {
                // implement recordReferral method from Referral service 
                const parsedReferral = { referralCode: referredBy, referredUserCode: referralCode, customerTier }
                console.log(JSON.stringify(parsedReferral));
                await this._newReferrer.recordReferral(parsedReferral);
                return { success: true, statusCode: 201, message: "Pocket User registered successfully", data: newUser };
            } else {
                return { success: true, statusCode: 201, message: "Pocket User created successfully", data: newUser };
            }
        }
    }

    public getUsers = async () => {
        const users = await PocketUserModel.find({ userType: 'user' });
        if (users) return { success: true, statusCode: 200, message: "All Users successfully retrieved!", data: users };
        return { success: false, statusCode: 400,  message: "Error in fetching All Users", data: null };  
    }

    public getUserById = async (params: any) => {
        const userId = (params as { userId: string }).userId;
        const user = await PocketUserModel.find({ id: userId });
        if (user) return { success: true, statusCode: 200, message: "User successfully retrieved!", data: user };
        return { success: false, statusCode: 400, message: "Error in fetching User Details", data: null };
    }

    public updateUser = async (userId:any, parsedBody: any) => {
        // const requestBodyNotAllowed = ['password', 'accountType', 'registerType', 'email', 'userCode', 'userName', 'subUser', 'isActive', 'isVerified' ]
        // const email = parsedBody.email.trim();
        let email = parsedBody.email;
        let phoneNumber = parsedBody.phoneNumber;

       let updatedUser = await PocketUserModel.findOne({ _id: userId, email: email });
       console.log("updatedUser:::", updatedUser);
       if(updatedUser) {
            if(updatedUser.isVerified === false) return { success: false, statusCode: 400, message: "User is not verified yet", data: null };
            if(updatedUser.isActive === false) return { success: false, statusCode: 400, message: "User is not active", data: null };

            let firstName = parsedBody.firstName.trim();
            let lastName = parsedBody.lastName.trim();
            
            updatedUser.firstName = firstName;
            updatedUser.lastName = lastName;
            updatedUser.updatedAt = new Date();
    
            // don't forget to save!
            await updatedUser.save();
            return { success: true, statusCode: 200, message: "User information updated", data: updatedUser };
        } else {
            return { success: false, statusCode: 400, message: "User not found", data: null };
        }
    }

    public deleteUser = async (phoneNumber: any) => {
        const user = await PocketUserModel.findOneAndDelete({ phoneNumber });
        if(user) return { success: true, statusCode: 200, message: "User successfully deleted!", data: user };
        return { success: false, statusCode: 400, message: "Error in deleting User", data: null };
    }

    public uploadProfilePhoto = async(parsedFile: any, userCode: any) => {
        const uploadFile = parsedFile;
        if (!uploadFile) {
            return { success: false, statusCode: 400, message: "No file is selected!", data: null };
        } else {
            const user = await PocketUserModel.findOne({ pocketMoniId: userCode });
            if(user) {
                // Retrieve uploaded files from request object
                const image = parsedFile;
                // console.log("image--->", image)
                try {
                    const response = await cloudinary.uploader.upload(image?.path, {
                        folder: 'images',
                    })

                    user.picture =  response.secure_url;
                    user.save();
                return { success: true, statusCode: 200, message: "Profile successfully uploaded", data: { user: user, public_id: response.public_id, url: response.secure_url} };
                } catch {
                    return { success: true, statusCode: 500, message: "Error uploading profile picture", data: null }
                } finally {
                    fs.unlinkSync(image.path);
                }
            } else {
                 
                return { success: false, statusCode: 400, message: "No such user found", data: null };   
            }
        }
    }

    public getUserPoints = async (parsedBody: any) => {
        const { userId } = parsedBody;
        try {
            const user = await PointModel.findOne({ userId });
            if (!user) return { success: false, statusCode: 404, message: 'User not found' };
            return { success: true, statusCode: 200, message: 'Gifts successfully fetched', data:{ userId: user.userId, totalPoints: user.totalPoints } };
        } catch (error) {
          return { success: false, statusCode: 500, message: 'Error fetching user points', data: error };
        }
    }

}