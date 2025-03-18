import { Router, Request, Response,  NextFunction } from "express";
import { controllerHandler } from "../../shared/controllerHandler";
import { CustomerTierController } from './controller';

const router = Router();
const call = controllerHandler;
const CustomerTier = new CustomerTierController();

router.post("/", call(CustomerTier.createCustomerTier, (req: Request, res: Response, next: NextFunction) => [req.body]));
router.get('/', call(CustomerTier.getCustomerTiers, (req: Request, res: Response, next: NextFunction) => []));
router.get('/:tierId', call(CustomerTier.getCustomerTierById, (req: Request, res: Response, next: NextFunction) => [req.params.tierId]));
router.patch('/:tierId', call(CustomerTier.updateCustomerTier, (req: Request, res: Response, next: NextFunction) => [req.params.tierId, req.body]));
router.delete('/:tierId', call(CustomerTier.deleteCustomerTier, (req: Request, res: Response, next: NextFunction) => [req.params.tierId]));

export default router;