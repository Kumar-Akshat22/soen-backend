import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { body } from "express-validator";
import * as projectController from "../controllers/project.controller.js" 
import mongoose from "mongoose";

const router = Router();

router.post('/create' , body('name').isString().withMessage("Name must be String"), authUser, projectController.createProject);

router.get('/all' , authUser , projectController.getAllProject);

router.put('/add-user',
    body('projectId').isString().withMessage('Project Id is not valid'),
    body('users').isArray({min: 1}).withMessage("Users must be an array and contain at least one user."),
    body("users.*").custom((value)=> mongoose.Types.ObjectId.isValid(value)).withMessage("Each user ID must be a valid MongoDB ObjectID."),
     authUser , 
     projectController.addUserToProject);

router.get('/get-project/:projectId' , authUser , projectController.getProjectById)

export default router;