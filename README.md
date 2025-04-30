Calisthenics Tracker
Description
Calisthenics Tracker is a React-based web application designed to help users track their calisthenics workouts using a calendar interface. Users can add, edit, and view workout sessions, selecting exercises from predefined categories (Push, Pull, Legs). The app features a modal form for adding/editing workouts, with options to set sets and reps for each exercise, and a toggle for recurring weekly workouts. The calendar displays workout sessions, allowing users to click on a date to view or edit details.
Features

Interactive calendar to view and manage workout sessions.
Modal form to add or edit workouts with collapsible exercise categories.
Predefined exercise categories: Push, Pull, Legs.
Option to set sets and reps for each exercise.
Recurring workout scheduling (repeat every week).
Responsive design for mobile and desktop use.

Prerequisites
Before you begin, ensure you have the following installed:

Node.js (version 14 or later)
npm (comes with Node.js)
Git to clone the repository

Steps to Download and Run the Project
1. Clone the Repository
Clone the project from GitHub to your local machine using the following command:
git clone https://github.com/HAN25/Calisthenics-Tracker.git

2. Navigate to the Project Directory
Change into the project directory:
cd Calisthenics-Tracker

3. Install Dependencies
Install the required dependencies using npm:
npm install

This will install all necessary packages, including React, FullCalendar, and other dependencies listed in package.json.
4. Run the Development Server
Start the development server to run the project locally:
npm run dev

This will start the app using Vite (or your configured build tool). You’ll see a message indicating the local server URL, typically http://localhost:5173.
5. Open the App in Your Browser
Open your web browser and navigate to the URL provided by the development server (e.g., http://localhost:5173). You should see the Calisthenics Tracker app running, with a calendar interface to manage your workouts.
Additional Notes

Ensure you have a stable internet connection when installing dependencies.
If you encounter any issues, check the terminal output for error messages and ensure all prerequisites are met.
The app uses FullCalendar for the calendar interface, React for the UI, and TypeScript for type safety.

Contributing
Feel free to fork the repository, make improvements, and submit pull requests. For major changes, please open an issue to discuss your ideas first.
