import { RequestHandler } from 'express';
import { PocketUserModel } from '../User/model';
import passport from 'passport';

export const login: RequestHandler = async (req, res, next) => {
    const email = (req.body as { email: string }).email?.toLowerCase();
    const password = (req.body as { password: string }).password;
    const loginType = (req.body as { loginType: string }).loginType;
    
    if (!email) {
        return res.status(422).json({ success: false, statusCode: 400, message: 'email address is required', error: 'email address is required', data: null })
    }
    if (!password) {
        return res.status(422).json({ success: false, statusCode: 400, message: 'password is required', error: 'password is required', data: null })
    }
    if(loginType == 'custom' || loginType == 'google') {
        return passport.authenticate('local', { session: false }, async (err: any, passportUser: any, info: any) => {
            if (err) {
                return next(err)
            } 
            if (passportUser) {
                const user = passportUser;
                user.token = passportUser.generateJWT();
                return res.json({ 
                    success: true, 
                    statusCode: 200, 
                    message: 'login successful', 
                    data: { info: user, extra: user.toAuthJSON() } 
                })
            }
            let statusCode = 400;
            if(loginType == 'google') statusCode = 406;
            return res.status(statusCode).json({ success: false, statusCode: statusCode, message: info.errors, data: info.data })
        })(req, res, next)
    }
    else {
        return res.status(400).json({ success: false, statusCode: 400, message: 'login type is not valid', data: null })
    }    
}


export const currentUser: RequestHandler = async (req, res, next) => {
    const id = (req.body as { id: string }).id; 
    // const { payload: { id } } = req
    return PocketUserModel.findById(id).then((user: any) => {
        if (!user) {
            return res.status(400).json({ success: false, statusCode: 400, message: 'failed to retrieve current user', data: null })
        }
        return res.status(200).json({ success: true, statusCode: 200, message: 'current user', data: user.toAuthJSON() })
    })
}


export const googleLogin: RequestHandler = async (req, res, next) => {
    console.log("google login request---->");
    return passport.authenticate("google", {
        scope: ["email", "profile"],
    })
}

export const googleRedirect: RequestHandler = async (req, res, next) => {
    return passport.authenticate("google"), async (req, res) => {
       console.log("repsonse from google redirect--->", res)
       return res.json({success: true, message: "This is the google callback route"});
    }
}