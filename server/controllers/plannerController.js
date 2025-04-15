import plannerModel from "../models/plannerModel.js";

//add task
export const addTask = async (req, res) => {
    const {time, description, date} = req.body;

    if(!time || !description || !date){
        return res.json({success: false, message: 'Missing details'});
    }
    try{
        const userId = req.user.id;
        const dateObj = new Date(date);
        dateObj.setUTCHours(0,0,0,0);

        let planner = await plannerModel.findOne({
            userId,
            date: dateObj
        });
        if(!planner){
            planner = new plannerModel({
                userId,
                date: dateObj,
                tasks: []
            });
        }
        planner.tasks.push({
            time,
            description,
            isCompleted: false
        });
        
        await planner.save();
        return res.json({success: true, message: "New task added successfully"});
    }catch(error){
        return res.json({success: false, message: error.message});
    }
}

//get tasks for a date
export const getTask = async (req, res) => {
    const {date} = req.query;
    if(!date){
        return res.json({success: false, message: 'No date provided'});
    }
    try{
        const userId = req.user.id;
        const dateObj = new Date(date);
        dateObj.setUTCHours(0,0,0,0);

        const planner = await plannerModel.findOne({
            userId,
            date: dateObj
        });
        if(!planner){
            return res.json({success:true, tasks: []});
        }

        return res.json({success: true, tasks: planner.tasks});
    }catch(error){
        return res.json({success: false, message: error.message});
    }
}

//update completed for task
export const toggleTaskComplete = async (req, res) => {
    const { taskId, date } = req.body;
    if(!taskId || !date){
        return res.json({success: false, message: 'Missing details'});
    }
    try{
        const userId = req.user.id;
        const dateObj = new Date(date);
        dateObj.setUTCHours(0,0,0,0);

        const planner = await plannerModel.findOne({
            userId,
            date: dateObj
        });
        if(!planner){
            return res.json({success: false, message: 'No task found for this date.'});
        }

        const task = planner.tasks.id(taskId);
        if(!task){
            return res.json({success:false, message: 'No task not found'});
        }

        task.isCompleted = !task.isCompleted;
        await planner.save();

        return res.json({success: true, message: 'Task completion successfully changed'});
    }catch(error){
        return res.json({success: false, message: error.message})
    }
}

export const deleteTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const {date, taskId} = req.body;

        const dateObj = new Date(date);
        dateObj.setUTCHours(0,0,0,0);

        const planner = await plannerModel.findOne({
            userId,
            date: dateObj
        });
        if(!planner){
            return res.json({success: false, message: 'Task not found'});
        }

        planner.tasks = planner.tasks.filter(task=> task._id.toString() !== taskId);
        await planner.save();

        return res.json({success: true, message: 'Task deleted'});
    }catch(error){
        return res.json({success: false, error: error.message});
    }
}