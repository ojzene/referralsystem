import express, {urlencoded, Request, Response, NextFunction} from 'express';
import cors from 'cors';
import mongoose, {connect} from "mongoose";
import dotenv from 'dotenv';
import cron from 'node-cron';
import { json } from 'body-parser';
import path from 'path';

import cookieSession from "cookie-session";
import passport from "passport";

import { MONGO_URI, COOKIE_KEY } from './utils/secrets';

import userRoutes from './modules/User/route';
import authRoutes from './modules/AuthenticateUser/route';
import referralRoutes from './modules/Referral/route';
import customerTierRoutes from './modules/CustomerTier/route';

import { PointModel } from './modules/Referral';

dotenv.config();

require('./modules/AuthenticateUser/passportUser');
require('./modules/AuthenticateUser/passportGoogleUser');

const app = express();
app.use(cors());

app.use(json());
app.use(urlencoded({ extended: true, }));

mongoose.set('strictQuery', false);
connect(MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// setting up cookieSession
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [COOKIE_KEY],
  })
);

app.use(require('express-session')({ secret: 'pocketmonisession', resave: true, saveUninitialized: true }));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/referral', referralRoutes);
app.use('/api/customer-tier', customerTierRoutes);

// Monthly Points Reset
cron.schedule('0 0 1 * *', async () => {
  try {
    await PointModel.updateMany({}, { $set: { totalPoints: 0 } });
    console.log('Monthly points reset successful');
  } catch (error) {
    console.error('Error resetting points:', error);
  }
});

const buildPath = path.normalize(path.join(__dirname, '../client/build'));
app.use(express.static(buildPath));

// app.use(express.static(__dirname));

app.get('/', (req: any, res: any) => {
    res.send('Welcome to PocketMoni Referral Campaign Service');
});

// app.get('(/*)?', async (req, res, next) => {
//     res.sendFile(path.join(buildPath, 'index.html'));
// });

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use((err: Error, req: Request, res:Response, next: NextFunction) => {
    res.status(500).json({ success: false,  statusCode: 500, message: err.message, data: null });
});

// JSON Request Body Examples
const apiDocumentation = {
  "POST /addPoints": {
    "description": "Add points to a user",
    "requestBody": {
      "userId": "string",
      "points": "number",
      "email": "string"
    }
  },
  "POST /redeemGift": {
    "description": "Redeem a gift",
    "requestBody": {
      "userId": "string",
      "giftId": "string"
    }
  },
  "GET /leaderboard": {
    "description": "Get the leaderboard ranking",
    "requestBody": "None"
  },
  "GET /admin/dashboard": {
    "description": "Get admin campaign statistics",
    "requestBody": "None"
  }
};

app.get('/api/docs', (req, res) => {
  res.json(apiDocumentation);
});


const port = process.env.PORT || 3003;
app.listen(port, () => console.log(`PocketMoni Referral Server is running on Port ${port}`));
