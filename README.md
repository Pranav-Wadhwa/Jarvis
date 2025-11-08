# React + Flask App

A simple full-stack application with a React frontend and Flask backend.

## Setup Instructions

### Backend (Flask)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask server:
   ```bash
   python app.py
   ```

The backend will run on `http://localhost:5000`

### Frontend (React)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

## API Endpoints

- `GET /api/hello` - Returns a hello message
- `POST /api/data` - Accepts JSON data and returns a response

## Features

- React frontend with Vite
- Flask backend with CORS enabled
- Basic API communication between frontend and backend
- Form submission example
