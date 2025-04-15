import journalModel from "../models/journalModel.js";

export const saveEntry = async(req, res) => {
    const userId = req.user.id;
    const {date, entry} = req.body;
    if(!date){
        return res.json({success: false, message: 'Missing date for entry'});
    }

    try{
        const dateObj = new Date(date);
        dateObj.setUTCHours(0, 0, 0, 0);

        const existingEntry = await journalModel.findOne({userId, date: dateObj});
        if(existingEntry){
            existingEntry.entry = entry;
            await existingEntry.save();
        }else{
            await journalModel.create({userId, date: dateObj, entry});
        }
        return res.json({success: true, message: 'Journal entry saved successfully'});
    }catch(error){
        return res.json({success: false, message: error.message});
    }
}

export const getEntry = async (req, res) => {
    const userId = req.user.id;
    const {date} = req.query;
    if(!date){
        return res.json({success: false, message: 'Missing date for requested entry'});
    }

    try{
        const dateObj = new Date(date);
        dateObj.setUTCHours(0, 0, 0, 0);

        const entry = await journalModel.findOne({userId, date: dateObj});

        return res.json({success: true, entry: entry ? entry.entry : ''});
    }catch(error){
        return res.json({success: false, message: error.message});
    }
}