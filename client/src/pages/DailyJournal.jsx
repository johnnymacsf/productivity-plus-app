import React, { useState, useEffect, useContext } from 'react'
import Navbar from '../components/Navbar';
import { format, addDays, subDays, sub } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const DailyJournal = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const formattedDate = format(currentDate, 'EEEE MMMM d, yyyy');
    const [entry, setEntry] = useState('');
    const [originalEntry, setOriginalEntry] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    
    const {backendUrl} = useContext(AppContext);
    axios.defaults.withCredentials = true;

    const getDateString = (date) => format(date, 'yyyy-MM-dd');
    useEffect(() => {
      const fetchEntry = async () => {
        const dateString = getDateString(currentDate);
        try{
          const { data } = await axios.get(`${backendUrl}/api/journal/get-entry?date=${dateString}`);
          if(data.success){
            setEntry(data.entry);
            setOriginalEntry(data.entry);
          }else{
            toast.error(data.message);
          }
        }catch(error){
          toast.error(error.message);
        }
      }
      fetchEntry();
      setIsEditing(false);
    }, [backendUrl, currentDate]);

    const nextDay = () => {
        setCurrentDate(addDays(currentDate,1));
    }

    const prevDay = () => {
        setCurrentDate(subDays(currentDate, 1));
    }

    const handleCancel = () => {
      setEntry(originalEntry);
      setIsEditing(false);
    }

    const handleSave = async () => {
      const dateString = getDateString(currentDate)
      try{
        const {data} = await axios.post(`${backendUrl}/api/journal/save-entry`, {
          date: dateString,
          entry
        });

        if(data.success){
          toast.success(data.message);
          setOriginalEntry(entry);
          setIsEditing(false);
        }else{
          toast.error(data.message);
        }
      }catch(error){
        toast.error(error.message);
      }
    }
    return (
        <div className='min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center relative'>
          <Navbar />
          <div className='absolute top-24 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4'>
            <h1 className='text-4xl font-semibold text-red-500 underline'>Daily Journal</h1>
            <div className='flex items-center gap-4 mt-4'>
              <button
                onClick={prevDay}
                className='px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600'>
                &lt;
              </button>
              <h1 className='text-2xl font-semibold'>{formattedDate}</h1>
              <button
                onClick={nextDay}
                className='px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600'>
                &gt;
              </button>
            </div>
            <textarea className='w-full h-64 p-4 rounded-xl text-lg resize-none border border-black focus:outline-none focus:ring-2 focus:ring-bue-400' placeholder='Write a new daily journal entry!' 
              value={entry} 
              onChange={(e)=> setEntry(e.target.value)}
              onFocus={() => setIsEditing(true)} 
              readOnly={!isEditing}/>
            {isEditing && (
              <div className='mt-4 flex gap-4'>
                <button className='px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-300' onClick={handleCancel}>Cancel</button>
                <button className='px-6 py-2 bg-green-400 text-white rounded-lg hover:bg-green-600' onClick={handleSave}>Save</button>
              </div>
            )}
          </div>
        </div>
    );
}

export default DailyJournal
