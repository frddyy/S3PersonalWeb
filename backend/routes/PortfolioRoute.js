import express from "express";
import {
  createPortfolio,
  getPortfolio,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
} from "../controllers/PortfolioController.js";

const router = express.Router();

// Route to get all education records
router.get("/identities/:identityId/portfolios", getPortfolio);

// Route to get Skill records by user ID
router.get("/identities/:identityId/portfolios/:portfolioId", getPortfolioById);

// Create a portfolio record
router.post("/identities/:identityId/portfolios", createPortfolio);

// Update a portfolio record
router.patch(
  "/identities/:identityId/portfolios/:portfolioId",
  updatePortfolio
);

// Delete a portfolio record
router.delete(
  "/identities/:identityId/portfolios/:portfolioId",
  deletePortfolio
);

export default router;
