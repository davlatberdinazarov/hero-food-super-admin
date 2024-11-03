import React from "react";
import { Avatar } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import useProfileStore from "../stores/profileStore"; // Import the profile store
import { BASE_URL } from '../utils'; // Import the BASE_URL

export default function Navbar() {
  const { profile } = useProfileStore(); // Access profile data from Zustand

  return (
    <div className="bg-gray-800 text-white px-4 py-2 shadow-md flex justify-between items-center">
      <h3 className="text-lg font-semibold">Admin Panel</h3>

      <div className="flex items-center space-x-4">
        {/* User Information */}
        <div className="text-right">
          <p className="font-medium">{profile?.fullName || "User Name"}</p>
          <p className="text-sm text-gray-300">{profile?.role || "Role"}</p>
        </div>

        {/* User Image */}
        <Link to="/myprofile">
          <Avatar
            src={profile?.image ? `${BASE_URL}/uploads/${profile.image}` : "/image.png"} // Construct the image URL
            alt="User Image"
            size="md"
            className="border border-white"
          />
        </Link>
      </div>
    </div>
  );
}
