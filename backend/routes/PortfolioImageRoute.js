import express from "express";
import { 
    getPortfolioImage,
    getPortfolioImageById,
    createPortfolioImage,
    updatePortfolioImage,
    deletePortfolioImage
 } from "../controllers/PortfolioImageController.js";

const router = express.Router();

// Route to get all education records
router.get("/portfolios/:portfolioId/portfolio_images", getPortfolioImage);

// Route to get PortfolioImage records by user ID
router.get("/portfolios/:portfolioId/portfolio_images/:portfolioImageId", getPortfolioImageById);

router.post("/portfolios/:portfolioId/portfolio_images", createPortfolioImage);

router.patch("/portfolios/:portfolioId/portfolio_images/:portfolioImageId", updatePortfolioImage);

router.delete("/portfolios/:portfolioId/portfolio_images/:portfolioImageId", deletePortfolioImage);

export default router;