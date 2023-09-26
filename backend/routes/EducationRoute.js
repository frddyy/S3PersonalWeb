import express from "express";
import { 
    getEducation,
    getEducationByUserId,
    createEducation,
    updateEducation,
    deleteEducation,
 } from "../controllers/EducationController.js";

const router = express.Router();

// Route to get all education records
router.get('/educations', getEducation);

// Route to get education records by user_id
router.get('/users/:user_id/educations', getEducationByUserId);

// Route to create a new education record for a user
router.post('/users/:user_id/educations', createEducation);

// Route to update an education record by education_id and user_id
router.patch('/users/:user_id/educations/:education_id', updateEducation);

// Route to delete an education record by education_id and user_id
router.delete('/users/:user_id/educations/:education_id', deleteEducation);


export default router;