import React from "react";

const GoalCard =({goal, onToggle, onDelete}) => {
    return (
        <div className="relative bg-white text-black p-4 rounded-2xl shadow-md mb-3 w-full max-w-md border border-black">
            <button className="absolute top-2 left-2 text-red-500 hover:text-red-700 font-bold" onClick={()=>onDelete(goal._id)}>
                X
            </button>
            <input type="checkbox" className="absolute top-2 right-2 h-5 w-5 accent-green-500" onClick={() => onToggle(goal._id)}/>
            <div className="mt-6">
                <p className="text-md">{goal.description}</p>
            </div>
        </div>
    )
}

export default GoalCard;