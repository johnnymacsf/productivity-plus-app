import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js"
import userRouter from "./routes/userRoutes.js";
import plannerRouter from "./routes/plannerRoutes.js";
import goalsRouter from "./routes/goalsRoutes.js";
import journalRouter from "./routes/journalRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

connectDB();

const allowedOrigins = ['http://localhost:5173'];

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));

// API endpoints
app.get('/', (req, res) => res.send("API Working fine!"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/tasks', plannerRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/journal', journalRouter);

app.listen(port, () => console.log(`Server started on PORT: ${port}`));