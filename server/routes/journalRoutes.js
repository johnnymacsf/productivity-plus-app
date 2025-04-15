import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getEntry, saveEntry } from '../controllers/journalController.js';

const journalRouter = express.Router();

journalRouter.post('/save-entry', userAuth, saveEntry);
journalRouter.get('/get-entry', userAuth, getEntry);

export default journalRouter;