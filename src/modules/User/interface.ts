export interface IPocketUser {
    pocketMoniId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    staffType: "full" | "aux";
    userType: "user" | "admin";
    isVerified: boolean;
    isActive: boolean;
    picture: any;
    extraField: any;
    referralCode: string;
    referralCount: number;
    referredBy: string;
    customerTier: string;
    createdAt: any;
    updatedAt: any;
}
