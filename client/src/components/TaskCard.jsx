import React from "react";

const TaskCard = ({task, onToggle, onDelete}) => {
    return(
        <div className="relative bg-white text-black p-4 rounded-2xl shadow-md mb-3 w-full max-w-md border border-black">
            <button className="absolute top-2 left-2 text-red-500 hover:text-red-700 font-bold" onClick={()=>onDelete(task._id)}>
                X
            </button>
            <input type="checkbox" checked={task.isCompleted} onChange={()=>onToggle(task._id)} className="absolute top-2 right-2 h-5 w-5 accent-green-500"/>
            <div className="mt-6">
                <p className="text-lg font-semibold text-center">{task.time}</p>
                <p className="text-md">{task.description}</p>
            </div>
        </div>
    )
}

export default TaskCard