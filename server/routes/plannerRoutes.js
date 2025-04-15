import express from 'express'
import { addTask, deleteTask, getTask, toggleTaskComplete } from '../controllers/plannerController.js';
import userAuth from '../middleware/userAuth.js';

const plannerRouter = express.Router();

plannerRouter.post('/add-task', userAuth, addTask);
plannerRouter.get('/get-task', userAuth, getTask);
plannerRouter.patch('/toggle-complete', userAuth, toggleTaskComplete);
plannerRouter.delete('/delete-task', userAuth, deleteTask);

export default plannerRouter;