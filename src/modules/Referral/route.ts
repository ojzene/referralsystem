import { Router, Request, Response,  NextFunction } from "express";

import { controllerHandler } from "../../shared/controllerHandler";
import { ReferralController } from './controller';

const router = Router();
const call = controllerHandler;
const Referral = new ReferralController();

router.post("/record", call(Referral.recordReferral, (req: Request, res: Response, next: NextFunction) => [req.body]));
router.post("/transaction", call(Referral.recordTransaction, (req: Request, res: Response, next: NextFunction) => [req.body]));
router.get("/transactions", call(Referral.getTransactions, (req: Request, res: Response, next: NextFunction) => []));
router.post("/seed/transaction-type", call(Referral.seedTransactionType, (req: Request, res: Response, next: NextFunction) => []));
router.post("/seed/customer-tier", call(Referral.seedCustomerTier, (req: Request, res: Response, next: NextFunction) => []));
router.post("/seed/gifts", call(Referral.seedGifts, (req: Request, res: Response, next: NextFunction) => []));
router.post("/seed/point-rules", call(Referral.seedPointRules, (req: Request, res: Response, next: NextFunction) => []));
router.post("/point-rules", call(Referral.createPointRules, (req: Request, res: Response, next: NextFunction) => [req.body]));
router.get("/point-rules", call(Referral.getPointRules, (req: Request, res: Response, next: NextFunction) => []));
router.delete("/point-rules/:pointRuleId", call(Referral.deletePointRules, (req: Request, res: Response, next: NextFunction) => [req.params]));
router.post("/transaction-type", call(Referral.createUpdateTransactionType, (req: Request, res: Response, next: NextFunction) => [req.body]));
router.get("/transaction-type", call(Referral.getTransactionType, (req: Request, res: Response, next: NextFunction) => []));
router.delete("/transaction-type/:transactionTypeId", call(Referral.deleteTransactionType, (req: Request, res: Response, next: NextFunction) => [req.params]));
router.post("/gifts", call(Referral.createUpdateGift, (req: Request, res: Response, next: NextFunction) => [req.body]));
router.delete("/gifts/:giftId", call(Referral.deleteGift, (req: Request, res: Response, next: NextFunction) => [req.params]));
router.post("/gifts/redeem", call(Referral.redeemGift, (req: Request, res: Response, next: NextFunction) => [req.body]));
router.get("/gifts", call(Referral.getGifts, (req: Request, res: Response, next: NextFunction) => []));
router.get("/leaderboard", call(Referral.getLeaderboard, (req: Request, res: Response, next: NextFunction) => []));
router.get("/points", call(Referral.getUserPoints, (req: Request, res: Response, next: NextFunction) => []));
export default router;