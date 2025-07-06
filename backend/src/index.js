import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import "dotenv/config";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/users.route.js";
import chatRouter from "./routes/chat.route.js";
import morgan from "morgan"
import { connectDB } from "./utils/connectDB.js";
import cookieParser from 'cookie-parser'
import cors from 'cors'


const app = express();
const PORT = process.env.PORT;

// const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve();

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
}))
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth' , authRouter);
app.use('/api/users' , userRouter);
app.use('/api/chat', chatRouter);

if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*" , (req, res)=>{
    res.sendFile(path.join(__dirname , "../frontend/dist/index.html"));
  })
}


app.listen(PORT  ,()=>{
  console.log(`Server is runnning on : ${PORT}`);
  connectDB();

})
