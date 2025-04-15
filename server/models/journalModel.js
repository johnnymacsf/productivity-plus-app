import mongoose from "mongoose";

const journalSchema = mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    date: {type: Date, required: true},
    entry: {
        type: String,
        default: ''
    }
});

const journalModel = mongoose.models.entries || mongoose.model('journals', journalSchema);

export default journalModel;