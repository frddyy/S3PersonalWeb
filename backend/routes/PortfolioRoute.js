import express from "express";
import { 
    getPortfolio,
    getPortfolioByUserId
 } from "../controllers/PortfolioController.js";

const router = express.Router();

// Route to get all education records
router.get('/portfolios', getPortfolio);

// Route to get Skill records by user ID
router.get('/users/:id/portfolios', getPortfolioByUserId);

export default router;