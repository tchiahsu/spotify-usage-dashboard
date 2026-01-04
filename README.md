# Spotify Listening Profile
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

A full-stack web application that lets users authenticate with Spotify and view personalized profile data through a clean web interface.

**Architecture overview**  
The backend handles Spotify OAuth and serves the authenticated data to the frontend.

This project is divided into two main directories:
- **`/server`**: Contains the Express backend logic that manages Spotify OAuth and API communication.
- **`/client`**: Contains the React frontend where users interact with their Spotify data.

## Setup
1. Register a Spotify App: https://developer.spotify.com/dashboard.
2. Add `http://127.0.0.1:3000/auth/callback` as a Redirect URI in the app settings.
3. Create an `.env` file in the **client folder** of the project with the following information:
```bash
VITE_BACKEND_ORIGIN=http://127.0.0.1:3000
```
3. Create an `.env` file in the **server folder** of the project with the following information:
```bash
CLIENT_ID=<Insert Client ID from Spotify App>
CLIENT_SECRET=<Insert Client Secret from Spotify App>
PORT=3000
REDIRECT_URI=http://127.0.0.1:3000/auth/callback
FRONTEND_ORIGIN=http://127.0.0.1:5173
```

## Backend
The backend handles Spotify authentication, secure token management, and data retrieval using the Spotify Web API. It is built with Express.js and TypeScript, providing a clean API layer for the frontend.
```bash
# change the directory into 'server'
cd server

# install all Express.js and Node.js dependencies
npm install

# run the backend server
npm start
```

## Frontend
The frontend is a React + TypeScript application built with Vite that provides a clean, responsive interface for exploring your Spotify listening history and insights.
```bash
# change the directory into 'client'
cd client

# install all Node.js and React dependencies
npm install

# run the development server (via Vite)
npm run dev
```
