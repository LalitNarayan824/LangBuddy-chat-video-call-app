import mongoose from 'mongoose';

export const connectDB = async ()=>{
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDb Connected :" + conn.connection.host);
  } catch (error) {
    console.log("error in connecting to mongodb : "+error);
    process.exit(1);
  }
}