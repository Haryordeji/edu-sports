# **EduSports**

A web app for managing class schedules, instructors, and student registrations at EduSports Academy.

## **Features**
- Manage class schedules and registrations.
- Track student progress and notes from instructors.
- Multiple user roles: Admin, Instructor, and Golfer.

## **Tech Stack**
- **Frontend:** React with TypeScript  
- **Backend:** Express, Sequelize, PostgreSQL  
- **Database:** PostgreSQL  

## **Setup & Installation**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Haryordeji/edu-sports
   cd edusports
   ```

2. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

   ```bash
   cd client
   npm install
   ```

3. **Configure DB:**
   Read `server/setup.md`

4. **Starting the program** 
Run in two terminals - client and server
- **Frontend:**  
  `npm start` – Runs the React frontend  
- **Backend:**  
  `npx tsc` – compile typescript
  `node dist/index.js` - starts the server  

6. **Access the app:**  
   Visit `http://localhost:3000` for the backend and the React frontend.