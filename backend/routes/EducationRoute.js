import express from "express";
import { 
    getEducation,
    getEducationByUserId
 } from "../controllers/EducationController.js";

const router = express.Router();

// Route to get all education records
router.get('/educations', getEducation);

// Route to get education records by user ID
router.get('/users/:id/educations', getEducationByUserId);

export default router;