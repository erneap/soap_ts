import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import bookRoutes from "./routes/bookRoutes";
import transRoutes from "./routes/translationRoutes";

if (process.env.MONGO_USER === undefined) {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", bookRoutes);
app.use("/api", transRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});