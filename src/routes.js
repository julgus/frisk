import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/components/dashboard/BasicLayout';
import MainLayout from 'src/components/MainLayout';
import Launcher from 'src/Launcher';
import Portal from './components/portal/Portal';

/* Code base from Course Lab 4 */ 

const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'launch', element: <Launcher /> },
      { path: '/', element: <Navigate to="/launch" /> },
    ]
  },
  {
    path: '/portal',
    element: <DashboardLayout />,
    children: [
      { path: '/portal', element: <Portal page="home"/> },
      { path: '/portal/messages', element: <Portal /> },
      { path: '/portal/appointments', element: <Portal /> },
      { path: '/portal/medication', element: <Portal page="medication" /> },
      { path: '/portal/conditions', element: <Portal page="conditions" /> },
      { path: '/portal/labresults', element: <Portal page="labresults"/> },
      { path: '/portal/vaccination', element: <Portal page="vaccination" /> },
      { path: '/portal/billing', element: <Portal /> }
    ]
  }
];

export default routes;
