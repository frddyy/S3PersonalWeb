import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import EducationRoute from "./routes/EducationRoute.js";
import IdentityRoute from "./routes/IdentityRoute.js";
import OrganizationRoute from "./routes/OrganizationRoute.js";
import SkillRoute from "./routes/SkillRoute.js";
import PortfolioRoute from "./routes/PortfolioRoute.js";
import PortfolioImageRoute from "./routes/PortfolioImageRoute.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(UserRoute);
app.use(EducationRoute);
app.use(IdentityRoute);
app.use(OrganizationRoute);
app.use(SkillRoute);
app.use(PortfolioRoute);
app.use(PortfolioImageRoute);

app.listen(5000, () => console.log("server up and running..."));