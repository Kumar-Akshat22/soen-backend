import mongoose from "mongoose";
import Project from "../models/project.model.js";

export const createProject = async({
    name,userId
})=>{

    if(!name){

        throw new Error("Project Name is required");
    }

    if(!userId){

        throw new Error("User is required");
    }


    const project = await Project.create({
        name,
        users:[userId]
    })


    return project;
}

export const getAllProjectByUserId = async ({userId}) => {

    if(!userId){

        throw new Error('UserId is required');
    }

    const allUserProject = await Project.find({
        users: userId
    })

    return allUserProject;
    
}

export const addUsersToProject = async ({projectId , users , userId}) => {

    if(!projectId){

        throw new Error("Project ID is required");
    }

    if(!users){

        throw new Error("Users are required");
    }
    
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error("Invalid Project ID");
    }
    
    if(!Array.isArray(users) || users.some(userId=>!mongoose.Types.ObjectId.isValid(userId))){
        
        throw new Error("Invalid userIDs in Users array");
        
    } 
    
    if(!userId){
        
        throw new Error("UserID is required");

    }

    if(!mongoose.Types.ObjectId.isValid(userId)){

        throw new Error("Invalid UserID");
    }

    const project = await Project.findOne({
        
        _id: projectId,
        users: userId,
    })

    if(!project){

        throw new Error("User does not belong to this Project");
    }

    const updatedProject = await Project.findOneAndUpdate({

        _id: projectId
    } , {

        $addToSet:{
            users:{
                $each: users
            }
        }
    } , {
        new: true
    });

    return updatedProject;

}

export const getProjectById = async ({projectId}) => {
    if(!projectId){

        throw new Error("Project ID is required");
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error("Invalid Project Id");
    }

    const project = await Project.findOne({
        _id: projectId
    }).populate('users');

    return project
}