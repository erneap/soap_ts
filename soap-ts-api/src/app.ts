import { config } from 'dotenv';
import express from 'express';
import transRoutes from "./routes/translationRoutes";
import userRoutes from "./routes/userRoutes";
import planRoutes from "./routes/plansRoutes";
import bookRoutes from './routes/booksRoutes';
import entriesRoutes from './routes/entriesRoutes';
import helpRoutes from './routes/helpRoutes'
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
app.use(cors({
  origin: ['https://www.soapjournal.org', 'https://soapjournal.org', 'http://localhost:4200', 'https://docker'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  exposedHeaders: ['Content-Type', 'Authorization', 'refreshToken', 'X-Custom-Header']
}));
app.use(express.json({ limit: '10mb'}));

app.use("/api", helpRoutes);
app.use('/api', transRoutes);
app.use('/api', planRoutes);
app.use('/api', userRoutes);
app.use('/api', entriesRoutes);
app.use('/api', bookRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;