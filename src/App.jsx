import TopLoadingBar from "react-top-loading-bar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import React, { useEffect, useRef, useState } from "react";
import AppLayout from "./layouts/AppLayout";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import MainPage from "./pages/MainPage";
import MyProfile from "./pages/MyProfile";
import FoodEstablishments from "./pages/FoodEstablishments";
import Category from "./pages/Category";
import Users from "./pages/Users";
import Comments from "./pages/Comments";
import RegionCities from "./pages/RegionsCities/RegionCities";
import Cities from "./pages/RegionsCities/Cities";


const AppRoutes = () => {
  const location = useLocation();
  const loadingBar = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleStart = () => setProgress(0);
    const handleComplete = () => setProgress(100);

    handleStart();
    const timer = setTimeout(handleComplete, 800); // Adjust timing as needed

    return () => {
      clearTimeout(timer);
    };
  }, [location]);

  useEffect(() => {
    if (progress === 100) {
      loadingBar.current.complete();
    } else {
      loadingBar.current.continuousStart();
    }
  }, [progress]);

  return (
    <>
      <TopLoadingBar color="#00f" ref={loadingBar} />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<MainPage />} />
            <Route path="regions" element={<RegionCities/>} />
            <Route path="regions/:regionId" element={<Cities />} />
            <Route path="food_establishment" element={<FoodEstablishments/>} />
            <Route path="category" element={<Category/>} />
            <Route path="myprofile" element={<MyProfile />} />
            <Route path="users" element={<Users/>} />
            <Route path="comments*" element={<Comments/>} />
          </Route>
          <Route path="*" element={<NotFound to="/" />} />
        </Route>
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
