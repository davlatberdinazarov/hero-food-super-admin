import React from 'react';
import { FaHome, FaUtensils, FaUsers, FaCity, FaCommentAlt } from 'react-icons/fa';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { TbCategoryPlus } from "react-icons/tb";
import { RiLogoutBoxLine } from "react-icons/ri";
import { Link, useLocation } from 'react-router-dom';
import { IoLogoReact } from "react-icons/io5";

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`h-screen bg-blue-600 text-white transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } p-4 shadow-lg flex flex-col justify-between fixed z-50`}
    >
      <div>
        <h2
          className={`text-2xl font-semibold text-center mb-8 ${
            isCollapsed ? 'hidden' : ''
          }`}
        >
          Admin Panel
        </h2>
        <div
          className={`text-2xl font-semibold text-center flex items-center justify-center mb-8 ${
            isCollapsed ? '' : 'hidden'
          }`}
        >
          <IoLogoReact className='animate-spin'/>
        </div>
        <ul className="space-y-2">
          <Link
            to="/"
            className={`flex items-center gap-4 p-2 hover:bg-blue-700 cursor-pointer ${
              location.pathname === '/' ? 'bg-blue-700' : ''
            }`}
          >
            <FaHome className="text-xl" />
            {!isCollapsed && <span className="text-lg">Asosiy</span>}
          </Link>
          <Link
            to="/regions"
            className={`flex items-center gap-4 p-2 hover:bg-blue-700 cursor-pointer ${
              location.pathname === '/cities' ? 'bg-blue-700' : ''
            }`}
          >
            <FaCity className="text-xl" />
            {!isCollapsed && <span className="text-lg">Viloyat/Shaharlar</span>}
          </Link>
          <Link
            to="/food_establishment"
            className={`flex items-center gap-4 p-2 hover:bg-blue-700 cursor-pointer ${
              location.pathname === '/food_establishment' ? 'bg-blue-700' : ''
            }`}
          >
            <FaUtensils className="text-xl" />
            {!isCollapsed && <span className="text-lg">Ovqatlanish maskanlari</span>}
          </Link>
          <Link
            to="/category"
            className={`flex items-center gap-4 p-2 hover:bg-blue-700 cursor-pointer ${
              location.pathname === '/category' ? 'bg-blue-700' : ''
            }`}
          >
            <TbCategoryPlus className="text-xl" />
            {!isCollapsed && <span className="text-lg">Kategoriyalar</span>}
          </Link>
          <Link
            to="/users"
            className={`flex items-center gap-4 p-2 hover:bg-blue-700 cursor-pointer ${
              location.pathname === '/users' ? 'bg-blue-700' : ''
            }`}
          >
            <FaUsers className="text-xl" />
            {!isCollapsed && <span className="text-lg">Foydalanuvchilar</span>}
          </Link>
          <Link
            to="/comments"
            className={`flex items-center gap-4 p-2 hover:bg-blue-700 cursor-pointer ${
              location.pathname === '/comments' ? 'bg-blue-700' : ''
            }`}
          >
            <FaCommentAlt className="text-xl" />
            {!isCollapsed && <span className="text-lg">Fikrlar</span>}
          </Link>
          <li className="flex items-center gap-4 p-2 hover:bg-blue-700 cursor-pointer">
            <RiLogoutBoxLine className="text-xl" />
            {!isCollapsed && <span className="text-lg">Chiqish</span>}
          </li>
        </ul>
      </div>

      {/* Collapse Button */}
      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center p-2 mt-6 bg-blue-500 hover:bg-blue-700 focus:outline-none"
      >
        {isCollapsed ? <MdChevronRight className="text-2xl" /> : <MdChevronLeft className="text-2xl" />}
      </button>
    </div>
  );
}
