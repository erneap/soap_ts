import { config } from 'dotenv';
import express from 'express';
import transRoutes from "./routes/translationRoutes";
import userRoutes from "./routes/userRoutes";
import planRoutes from "./routes/plansRoutes";
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from "./middleware/index.middleware";
import { connectToDB } from './config/mongoconnect';
import { auth } from './middleware/authorization.middleware';

connectToDB();

const app = express();

app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", auth, transRoutes);
app.use('/api', auth, planRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;