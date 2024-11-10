import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import $api from '../utils/api';
import useProfileStore from '../stores/profileStore';

export default function MainLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { profile, setProfile, clearProfile } = useProfileStore();
  const [render, setRender] = useState(0);
  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    } else {
      fetchProfile();
    }
  }, [accessToken, render]);

  const fetchProfile = async () => {
    try {
      const res = await $api.get("/profile");
      console.log(res);
      if (res.status === 200) {
        const { role } = res.data;
        if (role === "superAdmin") {
          setProfile(res.data);
        } else {
          handleUnauthorizedAccess();
        }
      }
    } catch (error) {
      console.error("Profilni olishda xatolik:", error);
    }
  };

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleUnauthorizedAccess = () => {
    sweetAlert('You have no access to this page', 'error');
    handleLogOut();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div
        className={`transition-width duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} handleLogOut={handleLogOut} />
      </div>

      {/* Main content area */}
      <div className={`${isCollapsed ? 'w-[calc(100% - 80px)]' : 'w-[calc(100%-316px)]'} flex flex-1 flex-col`}>
        {/* Navbar */}
        <Navbar />

        {/* Scrollable Content */}
        <div className={` flex-1 overflow-y-auto p-4`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
