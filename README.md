# OneCalc
Calculator APP to display OneWORLD Revenue/Cost 
# OneWORLD Three-Year Scenario Planner

A comprehensive financial planning tool for the OneWORLD marketplace platform, designed to project costs, revenue streams, and key financial metrics over a three-year period.

## Features

- Interactive dashboard with cost vs. revenue visualization
- Detailed cost projections including employee, tech development, and operational expenses
- Multiple revenue stream modeling (transaction fees, subscriptions, logistics, etc.)
- **Independent calculator functions** for each cost and revenue stream
- Dynamic scenario planning with adjustable parameters
- Lock/Unlock functionality to include/exclude specific modules from dashboard calculations
- Firebase authentication and real-time data storage
- Responsive design optimized for various devices

## Technology Stack

- Frontend: React with Tailwind CSS
- Backend: Firebase (Authentication, Firestore, Functions)
- AI Integration: Google Vertex AI
- Deployment: Vercel
- Charts: Recharts
- State Management: React Context API

## Core Design Principles

- **Modular Calculation Architecture**: Each cost and revenue stream has its own independent calculator function
- **Composable Dashboard**: Results from individual calculators are only combined at the dashboard level
- **Flexible Scenario Planning**: Parameters can be adjusted independently for each module
- **Persistent Configuration**: Settings can be saved and loaded for different scenarios

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up Firebase credentials in `.env.local`
4. Run the development server with `npm run dev`

## Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Main application pages
- `/src/contexts` - Context providers for state management
- `/src/services` - Firebase and API service implementations
- `/src/utils/calculators` - Independent calculator functions for each module
- `/src/utils/helpers` - Utility functions and helpers
