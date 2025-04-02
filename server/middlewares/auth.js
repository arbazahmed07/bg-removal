// const jwt= require('jsonwebtoken');
// //middleware func to decode jwt token to get clerk id

// const authUser=async(req,res,next)=>{
//   try {
//     // const {token}=req.headers;
//     const token=req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header
//     console.log("Tokebhbn:",token)
//     if(!token){ 
//       return res.json({success:false,msg:"Unauthorized"});}
//     const token_decode=jwt.decode(token);
    
//     req.body.clerkId=token_decode.clerkId;
//     next();
    
//   } catch (error) {
//     console.log(error.message)
//     res.json({success:false,message:error.message})
    
    
//   }
// }

// module.exports={
//   authUser
// }


const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.decode(token); // Decode token (No verification)

    if (!decoded || !decoded.clerkId) {
      return res.status(401).json({ success: false, msg: "Invalid token" });
    }

    req.user = { clerkId: decoded.clerkId }; // Store in req.user

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

module.exports = { authUser };
