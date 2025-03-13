import express from 'express'
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from "cors"
import userRoutes from './routes/user.routes.js'
import projectRoutes from './routes/project.routes.js'
import aiRoutes from './routes/ai.routes.js'
import dbConnect from './config/dbConnect.js';

dbConnect();

const app = express();

app.use(morgan('dev'));


// Middlewares
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

// Importing Routes
app.use('/users' , userRoutes);
app.use('/project' , projectRoutes);
app.use('/ai' , aiRoutes);

app.get("/" , (req , res)=>{

    res.send("Hello from default route")
});

export default app;