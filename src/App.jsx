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
import Category from "./pages/Category";
import Comments from "./pages/Comments";
import RegionCities from "./pages/RegionsCities/RegionCities";
import Cities from "./pages/RegionsCities/Cities";
import FoodEstablishments from "./pages/FoodEstablishments/FoodEstablishments";
import MenuCategory from "./pages/FoodEstablishments/MenuCategory";
import { Promotions } from "./pages/FoodEstablishments/Promotions";
import Foods from "./pages/FoodEstablishments/Foods";
import Users from "./pages/Users/Users";
import EstablishmentDetail from "./pages/EstablishmentDetail";


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
            <Route path="food_establishment/:foodEsId/menu_category" element={<MenuCategory/>} />
            <Route path="food_establishment/:foodEsId/menu_category/:menuId/foods" element={<Foods/>} />
            <Route path="food_establishment/:foodEsId/promotion" element={<Promotions/>} />
            <Route path="food_establishment/:foodEsId/detail" element={<EstablishmentDetail/>} />
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
