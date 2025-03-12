import { PocketUserModel } from '../User';
import { GiftModel, PointModel, PointRulesModel, ReferralModel, TransactionModel, TransactionTypeModel } from './model';

export class ReferralService {

    public recordReferral = async (parsedBody: any) => {
        console.log("recordReferral Service");
        const { referrerId, referredUserId, customerTier } = parsedBody;

        if (!referrerId || !referredUserId || !customerTier) {
            return { success: false, statusCode: 400, message: 'Missing required fields' };
        }
        
        const tierPoints = { bronze: 10, silver: 20, gold: 30 };
        const points = tierPoints[customerTier] || 0;

        console.log("recordReferral points: ", points);
        
        try {
            // check if referrerId exists in ReferralModel
            const referrer = await PocketUserModel.findOne({ referralId: referrerId });
            if (!referrer) {
                console.log("Could not find referrer for: " + referredUserId);
                return { success: false, statusCode: 400, message: 'Referrer not found' };
            }
            // Check if the referred user is already referred by the referrer
            const existingReferral = await ReferralModel.findOne({ referredUserId });
            if (existingReferral) {
                console.log("User already referred: " + referredUserId);
                return { success: false, statusCode: 400, message: 'User already referred' };
            }
        
            const referral = new ReferralModel({
                referrerId,
                referredUserId,
                pointsEarned: points,
            });
            await referral.save();

            console.log("referral saved: " + referral);
        
            let userPoints = await PointModel.findOne({ userId: referrerId });
            if (!userPoints) {
              userPoints = new PointModel({ userId: referrerId, totalPoints: 0 });
            }
            userPoints.totalPoints += points;
            await userPoints.save();
        
            return { success: true, statusCode: 201, message: 'Referral recorded successfully', data: { referral, totalPoints: userPoints.totalPoints } };
        } catch (error) {
            console.log("recordReferral processing error: ", error);
            return { success: false, statusCode: 500, message: 'Error processing referral' };
        }
    }

    public recordTransaction = async (parsedBody: any) => {
        const { userId, transactionType, amount, beneficiaryId } = parsedBody;

        const parsedAmount = parseFloat(amount);
        console.log('parsedAmount: ', parsedAmount);

        if (!userId || !transactionType || !amount || !beneficiaryId) {
            return { success: false, statusCode: 400, message: 'Missing required fields' };
        }
        
        // find if transaction type is in transactionModel
        const transactionTypeModel = await TransactionTypeModel.findOne({ name: transactionType });
        if (!transactionTypeModel) {
            return { success: false, statusCode: 400, message: 'Invalid transaction type' };
        }

        const pointsEarned = await this.calculatePoints(transactionType, parseFloat(amount?.toFixed(2)));

        console.log('pointsEarned: ', pointsEarned);

        try {
            const existingTransaction = await TransactionModel.findOne({
                userId,
                transactionType,
                beneficiaryId,
                createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            });

            if (existingTransaction) {
                return { success: false, statusCode: 400, message: 'Transaction already counted within 24 hours' };
            }

            const transaction = new TransactionModel({
                userId,
                transactionType,
                amount,
                pointsEarned,
                beneficiaryId,
            });
            await transaction.save();

            let userPoints = await PointModel.findOne({ userId });
            if (!userPoints) {
                userPoints = new PointModel({ userId, totalPoints: 0 });
            }
            userPoints.totalPoints += pointsEarned;
            await userPoints.save();

            return { success: true, statusCode: 201, message: 'Transaction recorded successfully', data: { transaction, totalPoints: userPoints.totalPoints } };
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
            const leaderboard = await PointModel.find().sort({ totalPoints: -1 }).limit(10);
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

    // Function to Calculate Points Dynamically
    private calculatePoints = async (transactionType: any, amount: any) => {
        const rules = await PointRulesModel.find({ type: transactionType });
        for (const rule of rules) {
            if (amount >= rule.minAmount && (!rule.maxAmount || amount <= rule.maxAmount)) {
                return rule.points;
            }
        }
        return 0;
    };

}