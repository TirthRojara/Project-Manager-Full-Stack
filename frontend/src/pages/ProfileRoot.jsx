import { Outlet } from 'react-router-dom';

function ProfilePageRoot() {

  return (
    <>
      
      <main>
        <Outlet />
      </main>
    </>
  );

}

export default ProfilePageRoot;

