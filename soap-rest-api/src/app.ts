import express from 'express';
import basicRoutes from "./routes/basicRoutes";
import transRoutes from "./routes/translationRoutes";


const app = express();
const port = 3000;

app.use(express.json());
app.use("/", basicRoutes)
app.use("/translations", transRoutes)

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});