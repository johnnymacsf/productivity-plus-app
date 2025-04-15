import mongoose from "mongoose";

const goalSchema = mongoose.Schema({
    description: {type: String, required: true},
    isCompleted: {type: Boolean, required: true}
})

const goalsSchema = mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    date: {type: Date, required: true},
    goals: [goalSchema]
})

const goalsModel = mongoose.models.goals || mongoose.model("goals", goalsSchema);

export default goalsModel;