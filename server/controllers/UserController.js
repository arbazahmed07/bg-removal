const { Webhook } = require("svix");
const UserModel = require("../models/userModel");
const transactionModel = require("../models/transactionModel");
const razorpay = require("razorpay");
//API Controller func to manage clerk user with db

//https://bg-removal-sable.vercel.app/api/user/webhooks
const clerkWebhooks=async(req,res)=>{
  try {
    //create a svix instamce with clerk webhook secret
    const whook=new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    //verify the webhook signature and get the payload
    await whook.verify(JSON.stringify(req.body),{
      "svix-id":req.headers['svix-id'],
      "svix-timestamp":req.headers['svix-timestamp'],
      "svix-signature":req.headers['svix-signature']
    })
    const {data,type}=req.body;
    switch(type){
      case "user.created":{
        const userData={
          clerkId:data.id,
          email:data.email_addresses[0].email_address,
          firstName:data.first_name,
          lastName:data.last_name,
          photo:data.image_url,
  
        }
        await UserModel.create(userData)
        res.json({})
      
        break;
      }

      case "user.updated":{
        const userData={
          email:data.email_addresses[0].email_address,
          firstName:data.first_name,
          lastName:data.last_name,
          photo:data.image_url,
  
        }
        await UserModel.findOneAndUpdate({clerkId:data.id},userData);
        res.json({})

      
        break;
      }

      case "user.deleted":{
        await UserModel.findOneAndDelete({clerkId:data.id});
        res.json({})
      
        break;
      }
      default:{
        
        break;
      }
    }

    
  } catch (error) {
    console.log(error.message)
    res.json({success:false,message:error.message})

    
  }

}

// API controller function to get user avaialabe credits data
const userCredits = async (req, res) => {
  try {
    const { clerkId } = req.user; // Fetch clerkId from req.user

    const userData = await UserModel.findOne({ clerkId });

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, credits: userData.creditBalance });
  } catch (error) {
    console.error("Error fetching user credits:", error.message);
    res.json({ success: false, message: error.message });
  }
};


//gateway initialization
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
//API To make payment for credits
const paymentRazorpay=async(req,res)=>{
  try {
    console.log("ahhh")

    const {clerkId}=req.user;
    const {planId}=req.body;
    // const {clerkId}=req.user;
    console.log(clerkId,planId)
    const userData=await UserModel.findOne({clerkId});
    if(!userData || !planId){
      return res.json({success:false,message:"Invalid user or planId"})
    }
    let credits,plan,amount,date;
    switch(planId){
      case "Basic":
        plan="Basic";
        credits=100;
        amount=10;
        break;
        case "Advanced":
          plan="Advanced";
          credits=500;
          amount=50;
          break;
          case "Business":
            plan="Business";
            credits=5000;
            amount=250;
            break;
      
      
      default:
        break;
      
    }
    date=Date.now();
    //creating transaction
    const transactionData={
      clerkId,
      plan,
      amount,
      credits,
      date
    }
    const newTransaction=await transactionModel.create(transactionData);
    const options={
      amount:amount*100,
      currency:process.env.CURRENCY,
      receipt:newTransaction._id
    }
    await razorpayInstance.orders.create(options,(error,order)=>{
      if(error){
        // console.log(error.message)
        return res.json({success:false,message:error})
      }
      res.json({success:true,order})
    })
  } catch (error) {
    console.log(error.message)
    res.json({success:false,message:error.message})
    
  }

}
//API to verify razor pay payment
const verifyRazorPay=async(req,res)=>{
  try {
    const {razorpay_order_id}=req.body;
    const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id);
    if(orderInfo.status==="paid"){

      const transactionData=await transactionModel.findById(orderInfo.receipt);
      if(transactionData.payment){
        return res.json({success:false,message:"Payment Failed"})
      }
      //adding credirs in user data
      const userData=await UserModel.findOne({clerkId:transactionData.clerkId});
      const creditBalance=userData.creditBalance+transactionData.credits;
      await UserModel.findByIdAndUpdate(userData._id,{creditBalance});

      //making the payment true
      await transactionModel.findByIdAndUpdate(transactionData._id,{payment:true});

      res.json({success:true,message:"Credits Added"})
    }
  } catch (error) {
    console.log(error.message)
    res.json({success:false,message:error.message})
    
  }

}




module.exports={
  clerkWebhooks,
  userCredits,
  paymentRazorpay,
  verifyRazorPay
}