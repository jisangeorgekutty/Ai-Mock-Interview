import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js";
import mockInterviewRoutes from "./routes/mockinterview.route.js";
import userAnswerRoutes from "./routes/useranswer.route.js";
import emotionsRoutes from "./routes/emotions.route.js";
import emotionFeedbackRoutes from "./routes/emotionfeedback.route.js";

dotenv.config();

const PORT=process.env.PORT || 5000;

const app = express();

 
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({credentials:true,origin:"http://localhost:3000"}));

app.use("/api/auth",authRoutes);
app.use("/api/mockinterview", mockInterviewRoutes);
app.use("/api/useranswer", userAnswerRoutes);
app.use("/api/emotions", emotionsRoutes);
app.use("/api/emotionfeedback", emotionFeedbackRoutes);

app.listen(PORT,()=>{
    console.log("Server Runnng On Port:"+5000);
    connectDB();
});
