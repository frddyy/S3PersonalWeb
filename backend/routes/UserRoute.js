import express from "express";
import { 
    getUsers,
    getUsersById,
    createUser,
    updateUser,
    deleteUser

 } from "../controllers/UserController.js";
 import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', verifyUser, adminOnly, getUsersById);
router.post('/users', verifyUser, adminOnly, createUser);
router.patch('/users/:id', verifyUser, adminOnly, updateUser);
router.delete('/users/:id', verifyUser, adminOnly, deleteUser);


export default router;