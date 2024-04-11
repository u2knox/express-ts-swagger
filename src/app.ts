import express, { Application } from "express";
import cors from "cors";
import router from "./routes";

const PORT = process.env.PORT || 8000;

const app: Application = express();

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

router(app);

app.listen(PORT, () => {
  console.log(`Server is running | http://localhost:${PORT}`);
});
