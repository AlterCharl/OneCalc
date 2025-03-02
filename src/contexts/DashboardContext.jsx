/**
 * This file is maintained for backward compatibility.
 * The actual implementation has been moved to the dashboard/ directory.
 */

import { 
  DashboardContext, 
  DashboardProvider, 
  useDashboard 
} from './dashboard';

export { DashboardProvider, useDashboard };
export default DashboardContext; 