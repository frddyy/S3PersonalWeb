import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import EducationRoute from "./routes/EducationRoute.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(UserRoute);
app.use(EducationRoute);

app.listen(5000, () => console.log("server up and running..."));