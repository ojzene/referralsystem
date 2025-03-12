import { Router, Request, Response,  NextFunction } from "express";

import multer from "multer";
import path from 'path';

import { controllerHandler } from "../../shared/controllerHandler";
import { UserController } from './controller';
import { validation } from '../../middleware/validation';
import {OnlySchemas} from "../AuthenticateUser/onlySchema"; 

import { authenticate } from "../AuthenticateUser/authenticate"; 

const router = Router();
const call = controllerHandler;
const User = new UserController();

// router.use(validation(OnlySchemas.UserSchema, true));

router.post("/", validation(OnlySchemas.PocketUserSchema, true), call(User.createPocketUser, (req: Request, res: Response, next: NextFunction) => [req.body]));
router.get('/', call(User.getUsers, (req: Request, res: Response, next: NextFunction) => []));
router.get('/:userId', call(User.getUserById, (req: Request, res: Response, next: NextFunction) => [req.params.userId]));
router.patch('/:userId', call(User.updateUser, (req: Request, res: Response, next: NextFunction) => [req.params.userId, req.body]));
router.get('/:userId/points', call(User.getUserPoints, (req: Request, res: Response, next: NextFunction) => [req.params.userId]));
// router.delete('/:phoneNumber', call(User.deleteUser, (req: Request, res: Response, next: NextFunction) => [req.params.phoneNumber]));

// let buildPath = path.normalize(path.join(__dirname, '../client/build/static/media/uploads'));

const storage = multer.diskStorage({
    // destination: '../client/build/uploads/profile',
    destination: './public',
    filename: function (req, file, cb) {
        // let fileExtension = path.extname(file.originalname).toLowerCase();
        let fileExtension = file.originalname.match(/\.(jpg|jpeg|png|PNG|gif)$/);
        if (fileExtension) {
            cb(null, req.params.userCode+'-'+file.fieldname.toLowerCase() + '-' + Date.now() + path.extname(file.originalname));
        } else {
            cb(new Error("Either jpg, jpeg or png image extension is allowed."), "false")
        }
    },
});
const upload = multer({
    storage: storage,     
    limits: {
      files: 1, // allow up to 5 files per request,
      fileSize: 1 * 1024 * 1024 // 2 MB (max file size)
}});

router.post('/update-profile/:userCode', upload.single('profileImage'),  call(User.uploadProfilePhoto,  (req: Request, res: Response, next: NextFunction) =>  [req.file, req.params.userCode]));

export default router;