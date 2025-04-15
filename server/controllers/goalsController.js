import goalsModel from "../models/goalsModel.js";

export const addGoal = async(req, res) => {
    const {description, date} = req.body;
    if(!description || !date){
        return res.json({success: false, message: 'Missing details'});
    }
    try {
        const userId = req.user.id;
        const dateObj = new Date(date);
        dateObj.setUTCHours(0,0,0,0);
        
        let goalsPlanner = await goalsModel.findOne({
            userId,
            date: dateObj
        });

        if(!goalsPlanner){
            goalsPlanner = new goalsModel({
                userId,
                date: dateObj,
                goals: []
            });
        }

        goalsPlanner.goals.push({
            description,
            isCompleted: false
        });

        await goalsPlanner.save();
        return res.json({success: true, message: 'Daily goal successfully added.'})
    }catch(error){
        return res.json({success: false, message: error.message});
    }
}

export const getGoal = async (req, res) => {
    const {date} = req.query;
    if(!date){
        return res.json({success: false, message: 'No date provided'});
    }
    try{
        const userId = req.user.id;
        const dateObj = new Date(date);
        dateObj.setUTCHours(0,0,0,0);

        const goalsPlanner = await goalsModel.findOne({
            userId,
            date: dateObj
        });
        if(!goalsPlanner){
            return res.json({success:true, goals: []});
        }
        return res.json({success: true, goals: goalsPlanner.goals});
    }catch(error){
        return res.json({success: false, message: error.message});
    }
}

export const toggleGoalComplete = async (req, res) => {
    const { goalId, date } = req.body;
    if(!goalId || !date){
        return res.json({success: false, message: 'Missing details'});
    }
    try{
        const userId = req.user.id;
        const dateObj = new Date(date);
        dateObj.setUTCHours(0,0,0,0);

        const goalPlanner = await goalsModel.findOne({
            userId, 
            date: dateObj
        });
        if(!goalPlanner){
            return res.json({success: false, message: 'No goals found for this date.'});
        }

        const goal = goalPlanner.goals.id(goalId);
        if(!goal){
            return res.json({success:false, message: 'No goal found'});
        }

        goal.isCompleted = !goal.isCompleted;
        await goalPlanner.save();

        return res.json({success: true, message: 'Goal completion successfully changed'});
    }catch(error){
        return res.json({success: false, message: error.message})
    }
}

export const deleteGoal = async (req, res) => {
    try {
        const userId = req.user.id;
        const {date, goalId} = req.body;

        const dateObj = new Date(date);
        dateObj.setUTCHours(0,0,0,0);

        const goalPlanner = await goalsModel.findOne({
            userId,
            date: dateObj
        });
        if(!goalPlanner){
            return res.json({success: false, message: 'Goal not found'});
        }

        goalPlanner.goals = goalPlanner.goals.filter(goal=> goal._id.toString() !== goalId);
        await goalPlanner.save();

        return res.json({success: true, message: 'Goal deleted'});
    }catch(error){
        return res.json({success: false, error: error.message});
    }
}