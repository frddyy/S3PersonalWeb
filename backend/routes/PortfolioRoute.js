import express from "express";
import { 
    getPortfolio,
    getPortfolioByIdentityId
 } from "../controllers/PortfolioController.js";

const router = express.Router();

// Route to get all education records
router.get('/portfolios', getPortfolio);

// Route to get Skill records by user ID
router.get('/users/:userId/identities/:identityId/portfolios', getPortfolioByIdentityId);

export default router;