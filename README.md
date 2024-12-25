﻿# YouTube_Clone
A YouTube clone application built with React, Redux, Express.js, MongoDB, Multer, and Cloudinary for handling media uploads. The project mimics key features of YouTube including video uploads, user authentication, and video playback.

# Table of Contents
Project Overview
Features
Technologies
Installation
File Structure

-- Project Overview
This project is a YouTube clone designed to simulate the core functionalities of YouTube. Users can sign up, sign in, upload videos, view channels, watch videos, and more. The project uses React for the frontend, Express.js for the backend, and MongoDB for database management. Video files are uploaded and managed through Multer and Cloudinary for cloud storage.

-- Features
Authentication: User registration and login with JWT tokens.
Video Upload: Users can upload videos, which are stored on Cloudinary.
Video Playback: Users can watch videos uploaded by others.
Channel Management: Users can create and manage their own channels.
Search: Search for videos based on title and description.
Responsive Design: Fully responsive frontend using Tailwind CSS.
State Management: Redux for managing application state.

-- Technologies
Frontend:

React: For building the user interface.
React Router: For navigation between pages.
Redux: For global state management.
Tailwind CSS: For responsive design.
Lucide Icons: For icons used in the application.
Backend:

Express.js: For building the server and API routes.
MongoDB: For storing user data, videos, and metadata.
Mongoose: For interacting with MongoDB.
JWT: For secure user authentication.
File Upload:

Multer: For handling video file uploads.
Cloudinary: For storing uploaded video files in the cloud.

Other Tools:
Vite: For fast development and build.
Axios: For making HTTP requests to the backend.

# Installation
1] Clone the Repository
Open your terminal and run the following command to clone the repository:
        git clone https://github.com/Rucha-Kulkarni-10/YouTube_Clone.git

Frontend Setup
2] Navigate to the Frontend Directory
   cd youtubeFrontend

3] Install Dependencies
   npm install

4] Start the Development Server
   npm run dev

5] Open the Application in Your Browser
   http://localhost:5173

Backend Setup

1] Navigate to the Backend Directory
  cd youtubeBackend

2] Install Dependencies  
  npm install

3] Start the Development Server

# File Structure
/backend
    /config
        - cloudinary.js
        - db.js
    /controllers
        - videoController.js
        - userController.js
    /models
        - videoModel.js
        - userModel.js
    /routes
        - videoRoutes.js
        - userRoutes.js
    /utils
        - multer.js
    - server.js
    - .env
/frontend
    /src
        /components
            /Header
            /Navigation
            /Sidebar
            /Loader
        /pages
            - Landing.jsx
            - SignIn.jsx
            - SignUp.jsx
            - Channel.jsx
            - Watch.jsx
        /redux
            - store.js
        /utilities
            - utils.js
        - App.jsx
        - main.jsx
    - .env
    - index.css
    - package.json
    - vite.config.js
