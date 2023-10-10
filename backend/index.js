import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import EducationRoute from "./routes/EducationRoute.js";
import IdentityRoute from "./routes/IdentityRoute.js";
import OrganizationRoute from "./routes/OrganizationRoute.js";
import SkillRoute from "./routes/SkillRoute.js";
import PortfolioRoute from "./routes/PortfolioRoute.js";
import PortfolioImageRoute from "./routes/PortfolioImageRoute.js";

import SequelizeStore from "connect-session-sequelize";
import session from "express-session";
import db from "./config/Database.js";
import dotenv from "dotenv";
import AuthRoute from "./routes/AuthRoute.js";
dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

// (async()=> {
//     await db.sync();
// });

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUnitialized: true,
    store: store,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(UserRoute);
app.use(IdentityRoute);
app.use(AuthRoute);
app.use(EducationRoute);
app.use(OrganizationRoute);
app.use(SkillRoute);
app.use(PortfolioRoute);
app.use(PortfolioImageRoute);

// store.sync();

// app.listen(5000, () => console.log("server up and running..."));

app.listen(process.env.APP_PORT, () => {
  console.log("server up and running...");
});
