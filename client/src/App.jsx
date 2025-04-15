import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DailyPlanner from './pages/DailyPlanner';
import DailyGoals from './pages/DailyGoals';
import DailyJournal from './pages/DailyJournal';

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/email-verify' element={<EmailVerify/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path='/daily-planner' element={<DailyPlanner/>}/>
        <Route path='/daily-goals' element={<DailyGoals/>}/>
        <Route path='/daily-journal' element={<DailyJournal/>}/>
      </Routes>
    </div>
  )
}

export default App
