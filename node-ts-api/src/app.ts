import { config } from 'dotenv';
import express from 'express';
import transRoutes from "./routes/translationRoutes";
import userRoutes from "./routes/userRoutes";
import planRoutes from "./routes/plansRoutes";
import bookRoutes from './routes/booksRoutes';
import entriesRoutes from './routes/entriesRoutes';
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
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  exposedHeaders: ['Content-Type', 'Authorization', 'refreshToken', 'X-Custom-Header']
}));
app.use(express.json());

app.use("/api", userRoutes);
app.use('/api', auth, bookRoutes);
app.use("/api", auth, transRoutes);
app.use('/api', auth, planRoutes);
app.use('/api', auth, entriesRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;