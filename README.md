Patient Registration App
A frontend-only patient registration application built with Next.js, TypeScript, and PGlite (a lightweight PostgreSQL database running in the browser with IndexedDB persistence). The app currently supports user authentication with email-based login, cookie-based session management, and route protection via Next.js middleware. Future features will include patient registration and a dashboard for managing patient data.
Features

Authentication:
Email-based login (e.g., info@admin.com with password password).
Cookie-based session management, expiring at 23:59:59 IST daily to avoid re-login within the same day.
Protected routes (/register, /dashboard) using Next.js middleware.
Logout functionality to clear session cookies.


Database:
PGlite with IndexedDB (idb://patient-registration-app) for persistent storage.
users table for authentication (email, password).
patients table for future patient data (id, name, email, phone, dob, status, registered_date).


UI:
Ant Design for form components and styling.
SCSS modules for custom styles (form-box.module.scss).



Planned Features

Patient registration form to add patients to the patients table.
Dashboard to view and manage patient data.
Cross-tab synchronization using BroadcastChannel for real-time updates.

Prerequisites

Node.js: v18 or higher.
npm: v9 or higher.
A modern browser (Chrome, Firefox, Edge) with IndexedDB support.

Setup Instructions

Clone the Repository:
git clone https://github.com/your-username/patient-registration-app.git
cd patient-registration-app


Install Dependencies:
npm install

This installs required packages: @electric-sql/pglite, next, react, antd, js-cookie, uuid, nextjs-toploader, and dev dependencies.

Clear IndexedDB (if updating schema):

If you encounter errors like column "email" does not exist, clear the IndexedDB database:
Open your browser’s DevTools (F12).
Go to Application > Storage > IndexedDB.
Find patient-registration and delete it.


Alternatively, run the app and visit /auth to reinitialize the database.


Run the Development Server:
npm run dev

Open http://localhost:3000/auth in your browser.


Usage

Login:

Navigate to http://localhost:3000/auth.
Use the default credentials:
Email: info@admin.com
Password: password


Successful login redirects to /register (currently unimplemented, shows 404).
The session persists until 23:59:59 IST (end of the day) via cookies.


Logout:

On the /auth page, click the “Logout” button to clear the session and stay on /auth.


Route Protection:

Accessing /register or /dashboard without logging in redirects to /auth.
After login, these routes are accessible (though not yet implemented).


Testing:

Verify cookies in DevTools (Application > Cookies) for session_token and email.
Test persistence by closing and reopening the browser within the same day.
Simulate session expiration by editing cookie expiration to a past date.

Dependencies

Core: next@14.2.3, react@18, react-dom@18
Database: @electric-sql/pglite@0.2.2
UI: antd@5.0.0, nextjs-toploader@1.6.12
Auth: js-cookie@3.0.5, uuid@10.0.0
Dev: @types/node@20, @types/react@18, @types/js-cookie@3.0.6, @types/uuid@10.0.0, typescript@5

Contributing

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a Pull Request.

Please ensure code follows the project’s style (TypeScript, SCSS modules) and includes tests for new features.
License
This project is licensed under the MIT License. See the LICENSE file for details.
Contact
For issues or questions, open a GitHub issue or contact vidhu0dev@gmail.com.

Built with ❤️ using Next.js and PGlite.
