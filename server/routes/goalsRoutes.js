import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { addGoal, deleteGoal, getGoal, toggleGoalComplete } from '../controllers/goalsController.js';

const goalsRouter = express.Router();

goalsRouter.post('/add-goal', userAuth, addGoal);
goalsRouter.get('/get-goal', userAuth, getGoal);
goalsRouter.patch('/toggle-complete', userAuth, toggleGoalComplete);
goalsRouter.delete('/delete-goal', userAuth, deleteGoal);

export default goalsRouter;