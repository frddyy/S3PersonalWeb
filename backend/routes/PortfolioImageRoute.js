import express from "express";
import { 
    getPortfolioImage,
    getPortfolioImageByPortfolioId
 } from "../controllers/PortfolioImageController.js";

const router = express.Router();

// Route to get all education records
router.get('/portfolio_images', getPortfolioImage);

// Route to get Skill records by user ID
router.get('/portfolios/:id/portfolio_images', getPortfolioImageByPortfolioId);

export default router;