import express from "express";
import routes from "./src/routers/index.js";
import connectDB from "./src/config/db.js";
import env from "./src/config/config.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());

connectDB();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Cho phép gửi cookies & headers
  })
);

app.use("/api", routes);

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

app.listen(env.PORT, () => {
  console.log(`Server is running on: http://localhost:${env.PORT}/api`);
});
