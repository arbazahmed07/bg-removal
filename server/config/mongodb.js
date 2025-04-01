const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();
const dbURI=process.env.MONGO_URI;
const connectDB = async ()=>{


  mongoose.connection.on('connected',()=>{
    console.log('MongoDB connected')
  })

  await mongoose.connect(dbURI)

}


module.exports= connectDB;