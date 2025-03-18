import { PocketUserModel } from '../User';
import { CustomerTierModel } from '../CustomerTier';
import { GiftModel, PointModel, PointRulesModel, ReferralModel, TransactionModel, TransactionTypeModel } from './model';

export class ReferralService {

    public recordReferral = async (parsedBody: any) => {
        console.log("recordReferral Service");
        const { referralCode, referredUserCode, customerTier } = parsedBody;
    
        if (!referralCode || !referredUserCode || !customerTier) {
            return { success: false, statusCode: 400, message: 'Missing required fields' };
        }
    
        const userTier = await CustomerTierModel.findById(customerTier);
        if (!userTier) {
            return { success: false, statusCode: 400, message: 'Invalid customer tier' };
        }
    
        const points = userTier.point || 0;
        console.log("recordReferral points: ", points);
    
        try {
            const referrer = await PocketUserModel.findOne({ referralCode });
            if (!referrer) {
                console.log("Could not find referrer for: " + referralCode);
                return { success: false, statusCode: 400, message: 'Referrer not found' };
            }
    
            const existingReferral = await ReferralModel.findOne({ referredUserCode, referralCode });
            if (existingReferral) {
                const existingUserTier = await CustomerTierModel.findById(existingReferral.customerTier);
                if (existingUserTier && existingUserTier.id === customerTier) {
                    console.log("User already referred with the same tier: " + referredUserCode);
                    return { success: false, statusCode: 400, message: 'User already referred with the same tier, no update needed' };
                }
                
                // Update referral points
                existingReferral.customerTier = customerTier;
                existingReferral.pointsEarned = points;
                await existingReferral.save();
    
                let userPoints = await PointModel.findOneAndUpdate(
                    { userId: referrer.id },
                    { $inc: { totalPoints: points - (existingUserTier?.point || 0) } },
                    { new: true, upsert: true }
                );
    
                console.log("Referral updated: ", existingReferral);
                return {
                    success: true,
                    statusCode: 200,
                    message: 'Referral updated successfully',
                    data: { referral: existingReferral, totalPoints: userPoints.totalPoints }
                };
            }
    
            const referral = new ReferralModel({
                referralCode,
                referredUserCode,
                customerTier: customerTier,
                pointsEarned: points,
            });
            await referral.save();
            console.log("Referral saved: ", referral);
    
            let userPoints = await PointModel.findOneAndUpdate(
                { userId: referrer.id },
                { $inc: { totalPoints: points } },
                { new: true, upsert: true }
            );
    
            referrer.referralCount += 1;
            await referrer.save();
            console.log("Referrer updated: ", referrer);
    
            return {
                success: true,
                statusCode: 201,
                message: 'Referral recorded successfully',
                data: { referral, totalPoints: userPoints.totalPoints }
            };
        } catch (error) {
            console.error("recordReferral processing error: ", error);
            return { success: false, statusCode: 500, message: 'Error processing referral: '+ error };
        }
    }

    public recordTransaction = async (parsedBody: any) => {
        const { userId, transactionTypeId, amount, beneficiaryId, extraField } = parsedBody;

        const parsedAmount = parseFloat(amount);
        console.log('parsedAmount: ', parsedAmount);

        if (!userId || !transactionTypeId || !amount || !beneficiaryId) {
            return { success: false, statusCode: 400, message: 'Missing required fields' };
        }

        const userModel = await PocketUserModel.findById(userId);
        if (!userModel) {
            return { success: false, statusCode: 400, message: 'User not found' };
        }

        // find if transaction type is in transactionModel
        const transactionTypeData = await TransactionTypeModel.findById(transactionTypeId);
        if (!transactionTypeData) {
            return { success: false, statusCode: 400, message: 'Invalid transaction type' };
        }

        const pointsEarned = await this.calculatePoints(transactionTypeData?.name, parseFloat(amount?.toFixed(2)));

        console.log('pointsEarned: ', pointsEarned);

        try {
            // get referredBy for user model and also retrieve the referredBy user id from PocketUserModel
            const referredBy = await PocketUserModel.findOne({ referralCode: userModel?.referredBy });
            if(referredBy) {
                const referralUserId = referredBy?.id;

                const existingTransaction = await TransactionModel.findOne({
                    userId,
                    transactionType: transactionTypeId,
                    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
                });

                if (existingTransaction) {
                    return { success: false, statusCode: 400, message: 'Transaction already counted within 24 hours' };
                }

                const transaction = new TransactionModel({
                    referralCode: userModel?.referralCode,
                    referralId: referralUserId,
                    userId,
                    transactionType: transactionTypeId,
                    amount,
                    pointsEarned,
                    beneficiaryId,
                    extraField,
                });
                await transaction.save();

                let userPoints = await PointModel.findOne({ userId: referralUserId });
                if (!userPoints) {
                    userPoints = new PointModel({ userId: referralUserId, totalPoints: 0 });
                }
                userPoints.totalPoints += pointsEarned;
                await userPoints.save();

                return { success: true, statusCode: 201, message: 'Transaction recorded successfully', data: { transaction, referral: userPoints } };
            } else {
                return { success: false, statusCode: 400, message: 'Referral code not found, points cannot be awarded' };
            }
        } catch (error) {
            return { success: false, statusCode: 500, message: 'Error processing transaction', data: error };
        }
    }

    // Seed Default Point Rules
    public seedPointRules = async () => {
        const existingRules = await PointRulesModel.countDocuments();
        if (existingRules === 0) {
            const rules = [
                { type: 'transaction', minAmount: 1000, points: 20 },
                { type: 'bills', minAmount: 1000, points: 20 },
                { type: 'credit', minAmount: 1000, maxAmount: 50999.99, points: 20 },
                { type: 'credit', minAmount: 51000, maxAmount: 200999.99, points: 30 },
                { type: 'credit', minAmount: 201000, points: 40 }
            ];
            const seededRules = await PointRulesModel.insertMany(rules);
            console.log('Point rules seeded successfully');
            return { success: true, statusCode: 200, message: 'Point rules seeded successfully', data: seededRules };
        }
    };

    public seedGifts = async () => {
        const gifts = [
          { name: "Ziba Resort", quantity: 1, pointsRequired: 5000 },
          { name: "Oriki spa", quantity: 5, pointsRequired: 3000 },
          { name: "100k Pricepally gift cards", quantity: 5, pointsRequired: 3000 },
          { name: "50k Pricepally gift cards", quantity: 10, pointsRequired: 1500 },
          { name: "Meter token", quantity: 1, pointsRequired: 1500 },
          { name: "20k cash gifts", quantity: 5, pointsRequired: 1000 },
        ];
        await GiftModel.deleteMany({});
        const seededGifts = await GiftModel.insertMany(gifts);
        console.log("Gifts seeded successfully");
        return { success: true, statusCode: 200, message: 'Gifts seeded successfully', data: seededGifts };
    };

    public seedTransactionType = async () => {
        const existingType = await TransactionTypeModel.countDocuments();
        if (existingType === 0) {
            const rules = [
                { name: 'transaction', description: '' },
                { name: 'bills', description: '' },
                { name: 'credit', description: '' }
            ];
            const seededTypes = await TransactionTypeModel.insertMany(rules);
            console.log('Transaction types seeded successfully');
            return { success: true, statusCode: 200, message: 'Transaction types seeded successfully', data: seededTypes };
        }
    };

    public createUpdateTransactionType = async(parsedBody: any) => {
        const { id, name, description } = parsedBody;
        try {
            if (id) {
                const updatedTransactionType = await TransactionTypeModel.findByIdAndUpdate(id, { 
                    name, 
                    description
                }, { new: true });
                return { success: true, statusCode: 200, message: 'Transaction Type updated successfully', data: updatedTransactionType };
            } else {
                const newTransactionType = new TransactionTypeModel({ 
                    name, description 
                });
                await newTransactionType.save();
                return { success: true, statusCode: 201, message: 'Transaction Type created successfully', data: newTransactionType };
            }
        } catch (error) {
            return { success: false, statusCode: 500, message: 'Error processing transaction type', data: error };
        }
    }

    public getTransactionType = async () => {
        try {
            const transactionTypes = await TransactionTypeModel.find();
            return { success: true, statusCode: 200, message: 'Transaction Type successfully fetched', data: transactionTypes };
        } catch (error) {
            return { success: false, statusCode: 500, message: 'Error fetching transaction type', data: error };
        } 
    }

    public deleteTransactionType = async(parsedParams: any) => {
        const { transactionTypeId } = parsedParams;
        try {
            const transactionType = await TransactionTypeModel.findByIdAndDelete(transactionTypeId);
            if (!transactionType) return { success: false, statusCode: 404, message: 'Transaction Type not found' };
            return { success: true, statusCode: 200, message: 'Transaction Type deleted successfully' };
        } catch (error) {
            return { success: false, statusCode: 500, message: 'Error deleting transaction type', data: error };
        }
    }

    public createPointRules = async(parsedBody: any) => {
        const { transactionTypeId, minAmount, maxAmount, points } = parsedBody;
        try {
            const checkPointRule = await PointRulesModel.findOne({ transactionTypeId });
            if(checkPointRule) return { success: false, statusCode: 400, message: 'Rule already exists' };

            const transactionType = await TransactionTypeModel.findById(transactionTypeId);
            if(transactionType) {
                if(points == 0) return { success: false, statusCode: 404, message: 'Point cannot be zero' };
                if(minAmount > maxAmount) return { success: false, statusCode: 404, message: 'Minimum amount cannot be more than maximum amount' };

                const existingRule = await PointRulesModel.findOne({ type: transactionType?.name, minAmount, maxAmount });
                if(existingRule) return { success: false, statusCode: 400, message: 'Rule already exists' };

                const pointrules = new PointRulesModel({
                    transactionTypeId: transactionType?._id,
                    type: transactionType?.name,
                    minAmount,
                    maxAmount,
                    points
                });
                await pointrules.save();

                return { success: true, statusCode: 200, message: 'Point rule set successfully', data: pointrules };
            } else {
                return { success: false, statusCode: 404, message: 'Transaction Type not found' };
            }
        } catch (error) {
            return { success: false, statusCode: 500, message: 'Error processing point rules', data: error };
        }
    }
    
    public getPointRules = async () => {
        try {
            const rules = await PointRulesModel.find();
            return { success: true, statusCode: 200, message: 'Point Rules successfully fetched', data: rules };
        } catch (error) {
            return { success: false, statusCode: 500, message: 'Error fetching point rules', data: error };
        } 
    }

    public deletePointRules = async(parsedParams: any) => {
        const { pointRuleId } = parsedParams;
        try {
            // const transactionType = await TransactionTypeModel.findById(transactionTypeId);
            // if (!transactionType) return { success: false, statusCode: 404, message: 'Transaction Type not found' };
            const pointRules = await PointRulesModel.findByIdAndDelete(pointRuleId);
            return { success: true, statusCode: 200, message: 'Point rules deleted successfully', data: pointRules };
        } catch (error) {
            return { success: false, statusCode: 500, message: 'Error deleting transaction type', data: error };
        }
    }

    public createUpdateGift = async(parsedBody: any) => {
        const { id, name, pointsRequired, quantity } = parsedBody;
        try {
            if (id) {
                const updatedGift = await GiftModel.findByIdAndUpdate(id, { 
                    name, 
                    pointsRequired,
                    quantity 
                }, { new: true });
                return { success: true, statusCode: 200, message: 'Gift updated successfully', data: updatedGift };
            } else {
                const newGift = new GiftModel({ 
                    name, pointsRequired, quantity
                });
                await newGift.save();
                return { success: true, statusCode: 201, message: 'Gift created successfully', data: newGift };
            }
        } catch (error) {
            return { success: false, statusCode: 500, message: 'Error processing gift', data: error };
        }
    }

    public deleteGift = async(parsedParams: any) => {
        const { giftId } = parsedParams;
        try {
            const gift = await GiftModel.findByIdAndDelete(giftId);
            if (!gift) return { success: false, statusCode: 404, message: 'Gift not found' };
            return { success: true, statusCode: 200, message: 'Gift deleted successfully' };
        } catch (error) {
            return { success: false, statusCode: 500, message: 'Error deleting gift', data: error };
        }
    }

    public redeemGift = async (parsedBody: any) => {
        const { userId, giftId } = parsedBody;
        try {
            const userPoints = await PointModel.findOne({ userId });
            if (!userPoints) return { success: false, statusCode: 404, message: 'User not found' };
        
            const gift = await GiftModel.findById(giftId);
            if (!gift) return { success: false, statusCode: 404, message: 'Gift not found' };
        
            if (userPoints.totalPoints < gift.pointsRequired) {
                return { success: false, statusCode: 400, message: 'Not enough points to redeem this gift' };
            }

            if (gift.quantity <= 0) {
                return { success: false, statusCode: 400, message: 'Gift is out of stock' };
            }
        
            userPoints.totalPoints -= gift.pointsRequired;
            gift.quantity -= 1;
            gift.claimedBy.push(userId);
            await userPoints.save();
            await gift.save();

            return { success: true, statusCode: 200,  message: 'Gift redeemed successfully', data: { gift, remainingPoints: userPoints.totalPoints } };
        } catch (error) {
            return { success: false, statusCode: 500, message: 'Error processing gift redemption', data: error };
        }
    }

    public getLeaderboard = async () => {
        try {
            const leaderboard = await PointModel.find().populate({
                path: 'userId',
                model: 'PocketUser',
                select: 'firstName lastName email phoneNumber',
            }).sort({ totalPoints: -1 }).limit(20);
            return { success: true, statusCode: 200, message: 'Leaderboard successfully fetched', data: leaderboard };
        } catch (error) {
            return { success: false, statusCode: 500, message: 'Error fetching leaderboard', data: error };
        } 
    }

    public getGifts = async () => {
        try {
            const gifts = await GiftModel.find();
            return { success: true, statusCode: 200, message: 'Gifts successfully fetched', data: gifts };
        } catch (error) {
            return { success: false, statusCode: 500, message: 'Error fetching gifts', data: error };
        } 
    }

    public getTransactions = async () => {
        try {
            const transaction = await TransactionModel.find();
            return { success: true, statusCode: 200, message: 'Transactions successfully fetched', data: transaction };
        } catch (error) {
            return { success: false, statusCode: 500, message: 'Error fetching transaction', data: error };
        } 
    }

    public getUserPoints = async () => {
        try {
            const points = await PointModel.find()
                .populate({
                    path: 'userId',
                    model: 'PocketUser', // Ensure this matches your User model name
                    select: 'firstName lastName email phoneNumber', // Specify the fields you need
                });
    
            return { 
                success: true, 
                statusCode: 200, 
                message: 'Points successfully fetched', 
                data: points 
            };
        } catch (error) {
            return { 
                success: false, 
                statusCode: 500, 
                message: 'Error fetching points', 
                data: error 
            };
        } 
    }
    
    // Function to Calculate Points Dynamically
    private calculatePoints = async (transactionType: any, amount: any) => {
        const rules = await PointRulesModel.find({ type: transactionType });
        console.log("point rules: ", rules);
        for (const rule of rules) {
            if (amount >= rule.minAmount && (!rule.maxAmount || amount <= rule.maxAmount)) {
                return rule.points;
            }
        }
        return 0;
    };

}