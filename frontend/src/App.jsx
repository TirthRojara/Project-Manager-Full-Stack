import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import { queryClient } from './utils/http';

import { checkAuthLoader } from './utils/auth';

import RootLayout from './pages/Root';
import Loginpage from './pages/Login';
import Welcomepage from './pages/welcome';
import SignupPage from './pages/Signup';
import DashboardPage from './pages/Dashboard';
// import RootDashboard from './pages/RootDashboard';
import MainTasks from './components/MainTasks';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilepage';
import ProfilePageRoot from './pages/ProfileRoot';
import LogOutPop from './components/LogOutPop';
import LogOutPopAll from './components/LogOutPopAll';
import DeleteUserPop from './components/DeleteUserPop';
import DeleteTP from './components/UI/DeleteTP';
import EditProject from './components/UI/EditProject';
import EnterNewProject from './components/EnterNewProject';
import EditTask from './components/UI/EditTask';
import Error404Page from './pages/Error404';
import Avatar from './components/Avatar';

const router = createBrowserRouter([
  { path: '*', element: <Error404Page /> },
  {
    path: '/',
    element: <RootLayout />,
    // errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Welcomepage /> },
      { path: 'login', element: <Loginpage /> },
      { path: 'signup', element: <SignupPage /> },
      {
        path: 'dashboard',
        element: <DashboardPage />,
        loader: checkAuthLoader,
        // element: <RootDashboard />,
        children: [
          // { index: true, element: <DashboardPage />},
          {
            path: 'profile',
            element: <ProfilePageRoot />,
            children: [
              { index: true, element: <ProfilePage /> },
              { path: 'edit', element: <EditProfilePage /> }
            ]
          },
          { path: 'avatar', element: <Avatar />},
          { path: 'createNewProject', element: <EnterNewProject /> },
          { path: 'task', element: <MainTasks /> },
          { path: 'logout', element: <LogOutPop /> },
          { path: 'logoutall', element: <LogOutPopAll /> },
          { path: 'deleteacc', element: <DeleteUserPop /> },
          {
            path: 'project/:projectId',
            element: <MainTasks />,
            children: [
              { path: 'delete', element: <DeleteTP title="Project" /> },
              { path: 'edit', element: <EditProject /> },
              { path: ':taskId/delete', element: <DeleteTP title='Task' /> },
              { path: ':taskId/edit', element: <EditTask /> },
            ]
          },
          // { path: 'project/:projectId/delete', element: <DeleteTP title={"Project"} /> },
          // { path: 'project/edit/:projectId', element: <EditProject /> },
        ]
      },
    ],
  }
]);



// const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
