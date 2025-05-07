import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js";

dotenv.config();

const PORT=process.env.PORT;

const app = express();

 
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({credentials:true,origin:"http://localhost:3000"}));

app.use("/api/auth",authRoutes);

app.listen(PORT,()=>{
    console.log("Server Runnng On Port:"+5000);
    connectDB();
});