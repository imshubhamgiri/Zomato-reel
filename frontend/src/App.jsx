import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Reel from './pages/Reel';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import UserProfile from './pages/UserProfile';
import PartnerLogin from './pages/PartnerLogin';
import PartnerRegister from './pages/PartnerRegister';
import PartnerProfile from './pages/PartnerProfile';
import PartnerProfileUser from './pages/PartnerProfileUser';
import Addfood from './pages/Addfood';
import LandingPage from './pages/LandingPgae';
import NotFound from './pages/NotFound';
import BottomNav from './components/BottomNav';

function App() {
  const location = useLocation();
  const hideBottomNavPaths = ['/user/login', '/user/register', '/partner/login', '/partner/register'];
  const showNav = !hideBottomNavPaths.includes(location.pathname);

  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/reel" element={<Reel />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/partner/register" element={<PartnerRegister />} />
        <Route path="/partner/login" element={<PartnerLogin />} />
        <Route path="/partner/profile" element={<PartnerProfile />} />
        <Route path="/profile/foodpartner/:id" element={<PartnerProfileUser />} />
        <Route path='/partner/addfood' element={<Addfood/>}/>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showNav && <BottomNav />}
    </>
  )
}

export default App;
