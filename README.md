# Productivity Plus WebApp

A full-stack productivity web application to help users stay organized and focused throughout the day, organize their goals, and write down their thoughts in a journal.

## Features

- User Authentication using JWT cookies
- Clean, responsive user interface
- Email Verification and Password Reset using OTPs
- Protected routes
- Daily planner to track and manage daily tasks
- Daily goals to help the making and achieving of goals
- Daily journal to provide a space for the user to write down their thoughts

## Tech Stack

**Frontend:**
- React
- Tailwind CSS
- React Toastify
- React Router
- Axios
- JavaScript
- HTML

**Backend:**
- MongoDB (mongoose, MongoDB Atlas)
- Express
- Node.js
- JWT (JSON Web Tokens)
- CORS
- cookie-parser

## Getting Started

To access the app, please go to link below to create your account and get started with Productivity Plus!
Link: https://productivity-plus-frontend.onrender.com

## Local Development

Follow the steps listed below to run this application locally.

### Prerequisites
- Node.js and npm installed
- MongoDB

### 1. Clone the repository
```bash
git clone https://github.com/johnnymacsf/productivity-plus-app.git
```
```bash
cd productivity-plus-app
```

### 2. Setup the backend
```bash
cd server
```
```bash
npm install
```
- Create your .env file for the server folder with the following variables:
    - MONGODB_URI=''
    - JWT_SECRET=''
    - NODE_ENV = 'development'
    - EMAIL_USER=''
    - EMAIL_PASS=''
```bash
npm run server
```

### 3. Setup the frontend
```bash
cd client
```
```bash
npm install
```
- Create your .env file for the client folder with the following variables:
    - VITE_BACKEND_URL= 'http://localhost:YOUR_PORT'
- In the AppContext.jsx file, uncomment the first backendUrl line on line 10 and comment the second backendUrl line on line 11
```bash
npm run dev
```
