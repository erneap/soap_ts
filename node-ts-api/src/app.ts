import { config } from 'dotenv';
import express from 'express';
import transRoutes from "./routes/translationRoutes";
import userRoutes from "./routes/userRoutes";
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from "./middleware/index.middleware";
import { connectToDB } from './config/mongoconnect';

connectToDB();

const app = express();

app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api", transRoutes);
app.use("/api", userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;