const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const userModel = require("../models/userModel");

const removeBgImage = async (req, res) => {
  try {
    const { clerkId } = req.user;
    // console.log("Clerk ID:", clerkId);

    if (!clerkId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await userModel.findOne({ clerkId });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.creditBalance === 0) {
      return res.json({ success: false, message: "Insufficient credits", creditBalance: user.creditBalance });
    }

    const imagePath = req.file.path;
    const imageFile = fs.createReadStream(imagePath);
    const formdata = new FormData();
    formdata.append("image_file", imageFile);
    // console.log("first",process.env.CLIPDROP_API)
    const { data } = await axios.post('https://clipdrop-api.co/remove-background/v1', formdata, {
      headers: {
        "x-api-key": process.env.CLIPDROP_API,
      },
      responseType: 'arraybuffer'
    });
    // console.log("dara",data)
    const base64Image = Buffer.from(data, 'binary').toString('base64');
    const resultImage = `data:${req.file.mimetype};base64,${base64Image}`;

    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1
    });

    return res.json({ success: true, resultImage, creditBalance: user.creditBalance - 1, message: "Background removed successfully" });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

module.exports = { removeBgImage };


// const axios = require("axios");
// const fs = require("fs");
// const FormData = require("form-data");
// const userModel = require("../models/userModel");

// const removeBgImage = async (req, res) => {
//   try {
//     const clerkId = req.user?.clerkId; 
//     console.log("ig",clerkId);
//     const user = await userModel.findOne({ clerkId });

//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }

//     if (user.creditBalance === 0) {
//       return res.json({ success: false, message: "Insufficient credits", creditBalance: user.creditBalance });
//     }

//     const imagePath = req.file.path;
//     const imageFile = fs.createReadStream(imagePath);
//     const formData = new FormData();
//     formData.append("image_file", imageFile);

//     // ✅ Await the API request
//     const { data } = await axios.post('https://clipdrop-api.co/remove-background/v1', formData, {
//       headers: {
//         "x-api-key": process.env.CLIPDROP_API_KEY,
//       },
//       responseType: 'arraybuffer'
//     });

//     const base64Image = Buffer.from(data, 'binary').toString('base64');
//     const resultImage = `data:${req.file.mimetype};base64,${base64Image}`;

//     await userModel.findByIdAndUpdate(user._id, {
//       creditBalance: user.creditBalance - 1
//     });

//     return res.json({ success: true, resultImage, creditBalance: user.creditBalance - 1, message: "Background removed successfully" });

//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };

// // ✅ Correct Export Format
// module.exports = { removeBgImage };
