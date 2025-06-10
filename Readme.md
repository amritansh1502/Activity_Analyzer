# Activity Analyzer

Activity Analyzer is a full-stack web application designed to help users monitor and improve their productivity by tracking activities in real-time, scoring productivity, and providing insightful analytics.

## Features

- **Real-time Activity Tracking:** Monitor your activities live to stay focused.
- **Scoring System:** Get productivity scores based on your activity data.
- **Insights & Analytics:** Receive detailed reports and insights to improve focus.
- **User Authentication:** Secure login and signup with JWT-based authentication.
- **User Profile Management:** Manage your profile and view personalized data.
- **Responsive Design:** Works seamlessly on desktop and mobile devices.

## Technology Stack

- **Frontend:** React, React Router, Redux Toolkit, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js, MongoDB (assumed from models)
- **State Management:** Redux Toolkit for authentication, user profile, and activity data
- **API Communication:** RESTful API with Axios

## Project Structure

- `frontend/` - React frontend application
  - `src/components/` - Reusable UI components
  - `src/pages/` - Page components including Home, Login, Signup, Dashboard, Profile
  - `src/store/` - Redux store and slices for state management
  - `src/assets/` - Static assets like images
- `backend/` - Express backend API
  - `routes/` - API route handlers
  - `models/` - Database models
  - `middleware/` - Authentication and other middleware

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance (local or cloud)





## Usage

- Visit the home landing page to learn about the app.
- Use the Signup page to create a new account.
- Login to access your dashboard and profile.
- Track your activities and view productivity insights in real-time.

## State Management

The app uses Redux Toolkit to manage global state for:

- Authentication (login status, token management)
- User profile data
- Activity tracking data


