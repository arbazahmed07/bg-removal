const express=require('express');
const { clerkWebhooks, paymentRazorpay, verifyRazorPay } = require('../controllers/UserController');
const userRouter=express.Router();
const authUser=require('../middlewares/auth').authUser;
const  userCredits  = require('../controllers/UserController').userCredits;

userRouter.post('/webhooks',clerkWebhooks)

userRouter.get('/credits',authUser,userCredits)
userRouter.post('/pay-razor',authUser,paymentRazorpay)
userRouter.post('/verify-razor',verifyRazorPay)
module.exports=userRouter;