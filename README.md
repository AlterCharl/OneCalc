# OneCalc - Financial Projection Tool

OneCalc is a comprehensive financial projection tool designed for the OneWORLD platform. It allows users to model business scenarios, calculate costs and revenues, and visualize financial projections.

## Features

- **Schema Calculator**: Define your business model schema with custom nodes for costs and revenues
- **Transaction Fees Module**: Calculate revenue from transaction fees
- **Employee Costs Module**: Calculate costs associated with employees
- **Dashboard Summary**: Visualize financial projections with interactive charts

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/OneWorldPlatform/onecalc.git
cd onecalc
```

2. Install dependencies
```
npm install
```

3. Set up Firebase credentials
```
cp .env.example .env.local
```
Then edit the `.env.local` file to add your Firebase project credentials:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. Start the development server
```
npm run dev
```

The application will be available at http://localhost:3000

## Usage

1. Use the Schema Calculator to define your business model
2. Configure the Transaction Fees and Employee Costs modules
3. View the compiled results in the Dashboard Summary

## Technologies Used

- React
- Tailwind CSS
- Recharts for data visualization
- Context API for state management
- Firebase for authentication and data storage

## Performance Optimization

The application includes several performance optimizations:

1. **Firebase Service Memoization**: Firebase services are lazily loaded and cached for improved performance.

2. **Dashboard Compilation Caching**: Financial projections calculations are cached to prevent unnecessary recalculations.

3. **Production Build Optimization**: Use the production build command for optimized deployment:
```
npm run build:prod
```

4. **Bundle Analysis**: Analyze the application bundle size:
```
npm run analyze
```

5. **Environment-specific Configuration**: Development and production environments are configured separately in .env.local and .env.production files.

6. **Web Workers**: Heavy calculations are offloaded to Web Workers to prevent UI blocking.
```javascript
// Example of running a calculation in a worker
import { runCalculation } from './utils/workerService';

// Run calculation in the worker with automatic fallback if workers aren't supported
const result = await runCalculation('schema', {
  schemaData,
  useMaxValues
});

// You can also disable caching if needed
const freshResult = await runCalculation('transactionFees', {
  volumeData
}, false);
```

7. **React.lazy and Suspense**: Components are loaded only when needed to reduce initial load time.

8. **Component Virtualization**: Resource-intensive UI components like charts are only rendered when visible in the viewport.

9. **Debounced Calculations**: Input changes trigger calculations after a delay to prevent excessive recalculation.

10. **Memoized Rendering**: React.memo is used to prevent unnecessary component re-renders.
