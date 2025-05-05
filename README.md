# Job Done - Freelancing Platform

Job Done is a freelancing platform that connects clients and freelancers. This web application allows users to sign up as freelancers or clients, manage tasks, communicate via messages, and handle payments.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Docker Setup](#docker-setup)
- [Testing](#testing)

---

## Features

- User authentication (JWT-based)
- Freelancer and client dashboards
- Task management (accept/reject tasks)
- Messaging system between clients and freelancers
- Admin panel for managing users
- Email verification and password reset functionality
- Responsive frontend built with React

---

## Technologies Used

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB (Atlas)
- **Authentication**: JWT (JSON Web Tokens)
- **Email Service**: Nodemailer with Gmail SMTP
- **Testing**: Jest, Supertest
- **Containerization**: Docker, Docker Compose

---

## Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Docker](https://www.docker.com/) (optional, for containerized setup)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/job-done.git
cd job-done
## backend directory
cd backend
npm install

### Create .env file in the backend directory:
PORT=5500
JWT_SECRET=yourSecretKey
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password
MONGODB_URI=your-mongodb-connection-string

npm start

## frontend
cd ../frontend

npm install

### create an .env file in frontend:
REACT_APP_BACKEND_URI=http://localhost:5500

npm start

##To run via docker, go to wbd-final directory

docker-compose up --build

docker-compose down

## Testing
### Backend
cd backend
npm test

### frontend
cd ../frontend
npm test
```
