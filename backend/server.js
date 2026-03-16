import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
dotenv.config({});
const app = express();
const __dirname = path.resolve()
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

app.use("/api/v1/user", userRoute)
app.use("/api/v1/post", postRoute)

app.use(express.static(path.join(__dirname, '/frontend/dist')))
app.use(/.*/, (_, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'))
})

const PORT = process.env.PORT || 2020;
import dbConnection from "./utils/dbConnection.js";

app.listen(PORT, async () => {
  if (await dbConnection()) {
    console.log(`Server is running at http://localhost:${PORT}`);
  }
});
