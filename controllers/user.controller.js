import { validationResult } from "express-validator";
import User from "../models/user.model.js";
import * as userService from "../services/user.service.js";

export const createUserController = async(req , res)=>{

    const errors = validationResult(req);

    if(!errors.isEmpty()){

        // Error present 
        return res.status(400).json({errors: errors.array()})
    }

    try{

        const user = await userService.createUser(req.body);

        // Generate JWT 
        const token = await user.generateJWT();

        delete user._doc.password
    
        res.status(201).json({
            user,
            token
        })
    } catch(err){

        res.status(400).send(err.message);
    }

}

export const loginController = async(req , res)=>{

    const errors = validationResult(req)
    
    if(!errors.isEmpty()){

        // Error present 
        return res.status(400).json({errors: errors.array()})
    }

    try {
        
        const {email , password} = req.body;

        const user = await User.findOne({email}).select("+password");

        if(!user){

            return res.status(401).json({

                errors: "Invalid Credentials"
            })
        }


        
        const isMatching = await user.isValidPassword(password);

        if(!isMatching){

            return res.status(401).json({

                errors: "Invalid Password"
            })
        }

        const token = await user.generateJWT();
        delete user._doc.password
        res.status(200).json({
            user,
            token
        })



    } catch (error) {
        
        res.status(400).send(error.message)
    }

}

export const profileController = async(req , res)=>{

    console.log(req.user);
    res.status(200).json({

        user: req.user
    })
    
}

export const getAllUsersController = async(req , res)=>{

    try {
        
        const loggedInUser = await User.findOne({
            email: req.user.email
        })
        const allUsers = await userService.getAllUsers({userId:loggedInUser._id})

        return res.status(200).json({
            users: allUsers
        })

    } catch (error) {
        
        console.log(error);
        res.status(400).json({
            error: error.message
        })
    }
} 