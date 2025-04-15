import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import { format, addDays, subDays } from 'date-fns';
import axios from 'axios';
import {toast} from 'react-toastify';
import { AppContext } from '../context/AppContext';
import TaskCard from '../components/TaskCard';

const DailyPlanner = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const formattedDate = format(currentDate, 'EEEE MMMM d, yyyy');
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState({time: '', description: ''});

    const {backendUrl} = useContext(AppContext);
    axios.defaults.withCredentials = true;

    useEffect(() => {
      const getUtcDateString = (localDate) => {
        const date = new Date(localDate);
        date.setUTCHours(0,0,0,0);
        return date.toISOString();
      }
      const fetchTasks = async () => {
        const isoDate = getUtcDateString(currentDate);
        try{
          const { data } = await axios.get(`${backendUrl}/api/tasks/get-task?date=${isoDate}`);
          if(data.success){
            setTasks(data.tasks);
          }else{
            toast.error(data.message);
          }
        }catch(error){
          toast.error(error.message);
        }
      }
      fetchTasks();
    }, [currentDate, backendUrl])

    const nextDay = () => {
        setCurrentDate(addDays(currentDate,1));
    }

    const prevDay = () => {
        setCurrentDate(subDays(currentDate, 1));
    }

    const handleToggleComplete = async (taskId) => {
      try {
        const { data } = await axios.patch(`${backendUrl}/api/tasks/toggle-complete`, {
          taskId,
          date: format(currentDate, 'yyyy-MM-dd'),
        });
  
        if (data.success) {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task._id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
            )
          );
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    const handleDelete = async (taskId) => {
      try{
        const isoDate = format(currentDate, 'yyyy-MM-dd');
        const {data} = await axios.delete(`${backendUrl}/api/tasks/delete-task`, {
          data: {date: isoDate, taskId}
        });
        if(data.success){
          toast.success('Deleted task');
          setTasks(prev => prev.filter(task => task._id !== taskId));
        }else{
          toast.error(data.message);
        }
      }catch(error){
        toast.error(error.message);
      }
    }

    const handleAddTask = async () => {
      try {
        const isoDate = format(currentDate, 'yyyy-MM-dd');
        const { data } = await axios.post(`${backendUrl}/api/tasks/add-task`, {
          ...newTask,
          date: isoDate,
        });
        if (data.success) {
          toast.success('Task added');
          setShowModal(false);
          setNewTask({ time: '', description: '' });
  
          // Refresh tasks
          const refreshed = await axios.get(`${backendUrl}/api/tasks/get-task?date=${isoDate}`);
          setTasks(refreshed.data.tasks);
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        toast.error(err.message);
      }
    };

    return (
        <div className='min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center relative'>
          <Navbar />
          <div className='absolute top-24 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4'>
            <h1 className='text-4xl font-semibold text-blue-500 underline'>Daily Planner</h1>
            <div className='flex items-center gap-4 mt-4'>
              <button
                onClick={prevDay}
                className='px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600'>
                &lt;
              </button>
              <h1 className='text-2xl font-semibold'>{formattedDate}</h1>
              <button
                onClick={nextDay}
                className='px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600'>
                &gt;
              </button>
            </div>
            <button className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 cursor-pointer' onClick={()=> setShowModal(true)}>
              Add New Task
            </button>
            <div className='mt-6 w-full px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-center'>
              {tasks.length === 0 ? (
                <p className='text-white'>No tasks for today!</p>
                ) : (
                  tasks.map((task) => (
                    <TaskCard key={task._id} task={task} onToggle={handleToggleComplete} onDelete={handleDelete}/>
                  ))
              )}
            </div>
          </div>
          {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white text-black p-6 rounded-2xl w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add New Task</h2>
            <div className="mb-3">
              <label className="block font-semibold mb-1">Time</label>
              <input
                type="time"
                value={newTask.time}
                onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Description</label>
              <input
                type="text"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
    );
}

export default DailyPlanner
