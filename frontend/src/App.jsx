import React from 'react';
import { Route ,Routes } from 'react-router-dom';
import Home from './pages/Home';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import UserProfile from './pages/UserProfile';
import PartnerLogin from './pages/PartnerLogin';
import PartnerRegister from './pages/PartnerRegister';
import PartnerProfile from './pages/PartnerProfile';
import PartnerProfileUser from './pages/PartnerProfileUser';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/partner/register" element={<PartnerRegister />} />
        <Route path="/partner/login" element={<PartnerLogin />} />
        <Route path="/partner/profile" element={<PartnerProfile />} />
        <Route path="/profile/foodpartner/:id" element={<PartnerProfileUser />} />
      </Routes>
      
    </>
  )
}

export default App
