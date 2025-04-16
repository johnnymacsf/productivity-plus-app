import React, { useState, useEffect, useContext } from 'react'
import Navbar from '../components/Navbar';
import { format, addDays, subDays } from 'date-fns';
import axios from 'axios';
import {toast} from 'react-toastify';
import { AppContext } from '../context/AppContext';
import GoalCard from '../components/GoalCard';

const DailyGoals = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const formattedDate = format(currentDate, 'EEEE MMMM d, yyyy');
    const [goals, setGoals] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newGoal, setNewGoal] = useState({description: ''});

    const {backendUrl} = useContext(AppContext);
    axios.defaults.withCredentials = true;

    useEffect(() => {
      const getDateString = (date) => format(date, 'yyyy-MM-dd');
  
      const fetchGoals = async () => {
        const dateString = getDateString(currentDate);
        console.log('Querying for date:', dateString);
  
        try {
          const { data } = await axios.get(`${backendUrl}/api/goals/get-goal?date=${dateString}`);
          if (data.success) {
            setGoals(data.goals);
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          toast.error(error.message);
        }
      };
  
      fetchGoals();
    }, [currentDate, backendUrl]);

    const nextDay = () => {
        setCurrentDate(addDays(currentDate,1));
    }

    const prevDay = () => {
        setCurrentDate(subDays(currentDate, 1));
    }

    const handleToggleComplete = async (goalId) => {
      try{
        const {data} = await axios.patch(`${backendUrl}/api/goals/toggle-complete`, {
          goalId,
          date: format(currentDate, 'yyyy-MM-dd'),
        });

        if(data.success){
          setGoals((prevGoals) =>
            prevGoals.map((goal)=> goal._id === goalId ? {...goal, isCompleted: !goal.isCompleted} : goal)
          );
        }else{
          toast.error(data.message);
        }
      }catch(error){
        toast.error(error.message);
      }
    }

    const handleDelete = async (goalId) => {
      try{
        const isoDate = format(currentDate, 'yyyy-MM-dd');
        const {data} = await axios.delete(`${backendUrl}/api/goals/delete-goal`, {
          data: {date: isoDate, goalId}
        });
        if(data.success){
          toast.success('Deleted goal');
          setGoals(prev => prev.filter(goal => goal._id !== goalId));
        }else{
          toast.error(data.message);
        }
      }catch(error){
        toast.error(error.message);
      }
    }

    const handleAddGoal = async () => {
      try {
        const isoDate = format(currentDate, 'yyyy-MM-dd');
        const { data } = await axios.post(`${backendUrl}/api/goals/add-goal`, {
          ...newGoal,
          date: isoDate,
        });
        if (data.success) {
          toast.success('Goal added');
          setShowModal(false);
          setNewGoal({ description: '' });
  
          const refreshed = await axios.get(`${backendUrl}/api/goals/get-goal?date=${isoDate}`);
          setGoals(refreshed.data.goals);
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
          <h1 className='text-4xl font-semibold text-green-500 underline'>Daily Goals</h1>
          <p className='text-xl font-semibold text-black'></p>
          <div className='flex items-center gap-4 mt-4'>
            <button
              onClick={prevDay}
              className='px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600'>
              &lt;
            </button>
            <h1 className='text-2xl font-semibold'>{formattedDate}</h1>
            <button
              onClick={nextDay}
              className='px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600'>
              &gt;
            </button>
          </div>
          <button className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 cursor-pointer' onClick={()=> setShowModal(true)}>
              Add New Goal
            </button>
          <div className='mt-6 w-full px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-center'>
            {goals.length === 0 ? (
              <div className='col-span-full flex justify-center items-center h-40'>
                <p className="text-black text-center text-lg">No goals yet for today, consider making one!</p>
              </div>
            ) : (
              goals.map((goal) => (
                <GoalCard key={goal._id} goal={goal} onToggle={handleToggleComplete} onDelete={handleDelete}/>
              ))
            )}
          </div>
        </div>
          {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white text-black p-6 rounded-2xl w-full max-w-md shadow-lg">
              <h2 className="text-xl font-bold mb-4">Add New Goal</h2>
              <div className="mb-3">
                <label className="block font-semibold mb-1">Description</label>
                <input
                  type="text"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
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
                  onClick={handleAddGoal}
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

export default DailyGoals
