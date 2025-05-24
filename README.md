# Patient Registration App

![Patient Registration App](https://img.shields.io/badge/Next.js-14.2.5-black) ![PGlite](https://img.shields.io/badge/PGlite-0.2.15-blue) ![License](https://img.shields.io/badge/License-MIT-green)

A frontend-only patient registration application built with **Next.js**, **PGlite** (a WebAssembly-based PostgreSQL database), and **Ant Design**. The app allows users to register, list, update, and delete patient records, with data persisted in the browser using IndexedDB. It supports real-time synchronization across multiple browser tabs using PGlite's multi-tab worker and BroadcastChannel for seamless data updates.

This project demonstrates a modern, client-side approach to managing patient data without a backend server, making it lightweight and suitable for offline-first scenarios.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Deployment](#deployment)
- [Challenges Faced](#challenges-faced)
- [Contributing](#contributing)
- [References](#references)
- [License](#license)

## Features
- **Patient Registration**: Register new patients with details like name, email, phone, date of birth, gender, address, medical history, and status.
- **Persistent Storage**: Uses PGlite with IndexedDB to persist patient data across page refreshes.
- **Multi-Tab Synchronization**: Ensures real-time updates across browser tabs using PGlite's multi-tab worker and BroadcastChannel.
- **Patient Management**: View, update, and delete patient records through an intuitive Ant Design-based UI.
- **Client-Side Only**: Runs entirely in the browser, eliminating the need for a backend server.
- **Error Handling**: Robust error handling for database operations and user input validation.

## Tech Stack
- **Next.js**: React framework for building the frontend, with TypeScript support.
- **PGlite**: Lightweight PostgreSQL implementation in WebAssembly, using IndexedDB for persistence.
- **Ant Design**: UI component library for forms, tables, and modals.
- **SCSS**: CSS preprocessor for modular styling.
- **BroadcastChannel**: Browser API for synchronizing data across tabs.
- **TypeScript**: Ensures type safety for database operations and UI components.

## Setup Instructions
Follow these steps to set up and run the project locally.

### Prerequisites
- **Node.js**: Version 18.x or higher
- **Yarn**: Version 1.x or higher
- **Modern Browser**: Chrome, Firefox, or Edge for IndexedDB and Web Worker support

### Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/VidhuPrakash/patient-registration-app.git
   cd patient-registration-app
   ```

2. **Install Dependencies**:
   ```bash
   yarn install
   ```
   Required dependencies include:
   - `next`, `react`, `react-dom`
   - `@electric-sql/pglite`, `@electric-sql/pglite/worker`
   - `antd`, `dayjs`, `nextjs-toploader`
   - `sass`
   - `@types/node`, `@types/react`, `typescript`

3. **Run the Development Server**:
   ```bash
   yarn dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Build for Production**:
   ```bash
   yarn build
   yarn start
   ```

## Usage
1. **Authenticate**:
   - Navigate to `http://localhost:3000/` to log in (default credentials: `info@admin.com`, `password`).

2. **Register a Patient**:
   - Go to `http://localhost:3000/register`.
   - Fill out the form with patient details (name, email, phone, date of birth, etc.).
   - Submit to add the patient to the database.

3. **View and Manage Patients**:
   - Visit `http://localhost:3000/dashboard` to see the patient list.
   - Click a patient row to open a modal for updating or deleting.
   - Updates and deletions are reflected across all open tabs in real-time.

4. **Multi-Tab Testing**:
   - Open the registration page (`/register`) in one tab and the dashboard (`/dashboard`) in another.
   - Register a patient in the registration tab and verify it appears in the dashboard tab without refreshing.
   - Update or delete a patient and confirm changes propagate across tabs.

5. **Inspecting IndexedDB**:
   - Open Chrome DevTools (`Ctrl + Shift + I` or `Command + Option + I`).
   - Go to the **Application** tab, expand **IndexedDB**, and select `idb://patient-registration-app`.
   - Click the `patients` object store and refresh to view the latest data.

## Deployment
The app is deployed to Vercel for public access at:  
**[https://patient-care-three.vercel.app](https://patient-care-three.vercel.app)** 

### Deployment Steps
1. **Push to GitHub**:
   ```bash
   git push origin main
   ```
2. **Set Up Vercel**:
   - Create a Vercel account and link your GitHub repository.
   - Configure the project with default Next.js settings.
   - Add the following to `next.config.js` for PGlite compatibility:
     ```javascript
     const nextConfig = {
       swcMinify: false,
       transpilePackages: ['@electric-sql/pglite'],
     };
     export default nextConfig;
     ```
3. **Deploy**:
   - Deploy the app via Vercel’s dashboard or CLI (`vercel --prod`).
   - Verify the deployed URL in multiple tabs to confirm real-time synchronization.

## Challenges Faced
During development, several challenges were encountered and resolved:
1. **Web Worker SSR Issue**:
   - **Problem**: The `Worker` API was undefined during Next.js server-side rendering, causing errors in `db.ts`.
   - **Solution**: Implemented lazy initialization with `getDB()` to ensure client-side only execution.

2. **Multi-Tab Synchronization**:
   - **Problem**: Registering a patient in one tab didn’t update the dashboard in another tab without refreshing.
   - **Solution**: Used PGlite’s multi-tab worker to share a single database instance across tabs, supplemented by BroadcastChannel with a 200ms delay for notifications.

3. **Data Consistency Delays**:
   - **Problem**: Fetched data was sometimes outdated due to transaction timing.
   - **Solution**: Ensured all database operations used transactions (`BEGIN`, `COMMIT`, `ROLLBACK`) and added a delay in the `useListPatients` hook’s event handler.

4. **Type Safety with Optional Fields**:
   - **Problem**: Optional fields like `gender`, `address`, and `medicalHistory` caused type mismatches.
   - **Solution**: Handled `undefined` and `null` consistently in `Patient` interfaces and database queries.

5. **IndexedDB Debugging**:
   - **Problem**: Verifying database updates required manual refreshes in Chrome DevTools.
   - **Solution**: Documented the process to inspect IndexedDB, emphasizing the need to refresh the view.


## References
- [PGlite Documentation](https://pglite.dev/docs)
- [PGlite Multi-Tab Worker Example](https://pglite.dev/docs/multi-tab-worker)
- [PGlite Bundler Support](https://pglite.dev/docs/bundler-support)
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Chrome DevTools: View and Change IndexedDB Data](https://developer.chrome.com/docs/devtools/storage/indexeddb)

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ by [Vidhu Prakash T P](https://linkedin.com/in/fullstack-dev-vidhuprakashtp).*
