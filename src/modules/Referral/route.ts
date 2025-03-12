import { Router, Request, Response,  NextFunction } from "express";

import { controllerHandler } from "../../shared/controllerHandler";
import { ReferralController } from './controller';

const router = Router();
const call = controllerHandler;
const Referral = new ReferralController();

router.post("/record", call(Referral.recordReferral, (req: Request, res: Response, next: NextFunction) => [req.body]));
router.post("/transaction", call(Referral.recordTransaction, (req: Request, res: Response, next: NextFunction) => [req.body]));
router.post("/transaction-type/seed", call(Referral.seedTransactionType, (req: Request, res: Response, next: NextFunction) => []));
router.post("/gifts/seed", call(Referral.seedGifts, (req: Request, res: Response, next: NextFunction) => []));
router.post("/pointrules/seed", call(Referral.seedPointRules, (req: Request, res: Response, next: NextFunction) => []));
router.post("/transaction-type", call(Referral.createUpdateTransactionType, (req: Request, res: Response, next: NextFunction) => [req.body]));
router.delete("/transaction-type/:transactionTypeId", call(Referral.deleteTransactionType, (req: Request, res: Response, next: NextFunction) => [req.params]));
router.post("/gifts", call(Referral.createUpdateGift, (req: Request, res: Response, next: NextFunction) => [req.body]));
router.delete("/gifts/:giftId", call(Referral.deleteGift, (req: Request, res: Response, next: NextFunction) => [req.params]));
router.post("/gifts/redeem", call(Referral.redeemGift, (req: Request, res: Response, next: NextFunction) => [req.body]));
router.get("/gifts", call(Referral.getGifts, (req: Request, res: Response, next: NextFunction) => []));
router.get("/leaderboard", call(Referral.getLeaderboard, (req: Request, res: Response, next: NextFunction) => []));
export default router;