import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import EducationRoute from "./routes/EducationRoute.js";
import IdentityRoute from "./models/IdentityModel.js";
import SocialMediaRoute from "./models/SocialMediaModel.js";
import OrganizationRoute from "./models/OrganizationModel.js";
import SkillRoute from "./models/SkillModel.js";
import PortfolioRoute from "./models/PortfolioModel.js";
import PortfolioImageRoute from "./models/PortfolioImageModel.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(UserRoute);
app.use(EducationRoute);
app.use(IdentityRoute);
app.use(SocialMediaRoute);
app.use(OrganizationRoute);
app.use(SkillRoute);
app.use(PortfolioRoute);
app.use(PortfolioImageRoute);

app.listen(5000, () => console.log("server up and running..."));