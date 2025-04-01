const { Webhook } = require("svix");
const UserModel = require("../models/userModel");

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


module.exports={
  clerkWebhooks
}