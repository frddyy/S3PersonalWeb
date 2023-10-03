import express from "express";
import { 
    createPortfolio,
    getPortfolio,
    getPortfolioByIdentityId,
    updatePortfolio,
    deletePortfolio
 } from "../controllers/PortfolioController.js";

const router = express.Router();

// Route to get all education records
router.get('/portfolios', getPortfolio);

// Route to get Skill records by user ID
router.get('/users/:userId/identities/:identityId/portfolios', getPortfolioByIdentityId);

// Create a portfolio record
router.post('/users/:userId/identities/:identityId/portfolios', createPortfolio);

// Update a portfolio record
router.patch('/users/:userId/identities/:identityId/portfolios', updatePortfolio);

// Delete a portfolio record
router.delete('/users/:userId/identities/:identityId/portfolios', deletePortfolio);


export default router;