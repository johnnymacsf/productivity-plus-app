import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    time: {type: String, required: true},
    description: {type: String, required: true},
    isCompleted: {type: Boolean, default: false}
})

const plannerSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    date: {type: Date, required: true},
    tasks: [taskSchema]
})

const plannerModel = mongoose.models.planner || mongoose.model("planner", plannerSchema);

export default plannerModel;