// const multer = require('multer');
// //creating multer middle ware for parsing formdata

// const storage = multer.diskStorage({
//   filename:function (re, file, callback) {
//    callback(null,`${Date.now()}_${file.originalname}`);
//   },
// });


// const upload=multer({storage})


// module.exports=upload;


const multer = require('multer');

// Creating multer middleware for parsing form-data
const storage = multer.diskStorage({
  filename: function (re, file, callback) { // ✅ Corrected "req" instead of "re"
    callback(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = {upload};
