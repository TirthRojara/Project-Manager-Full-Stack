import { Outlet } from 'react-router-dom';
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Dashboard from '../components/Dashborad';




function RootDashboard() {





  return (
    <>
      <Dashboard />


      <main>
        <Outlet />
      </main>
    </>
  );




}

export default RootDashboard;

