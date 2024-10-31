import React, { useState, useEffect } from 'react';
import { Avatar, Input, Button, Card, CardBody } from "@material-tailwind/react";
import useProfileStore from '../stores/profileStore';
import $api from '../utils/api';
import { BASE_URL } from '../utils';

export default function MyProfile() {
  const { profile, setProfile } = useProfileStore();
  const [fullName, setFullName] = useState(profile?.fullName || "");
  const [imagePreview, setImagePreview] = useState("https://via.placeholder.com/150");
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName);
      setImagePreview(profile.image ? `${BASE_URL}/uploads/${profile.image}` : "https://via.placeholder.com/150");
    }
  }, [profile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      if (imageFile) formData.append("image", imageFile);

      const response = await $api.patch("/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setProfile(response.data);
        setImagePreview(response.data.image ? `${BASE_URL}/uploads/${response.data.image}` : "https://via.placeholder.com/150");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    setFullName(profile?.fullName);
    setImagePreview(profile?.image ? `${BASE_URL}/uploads/${profile.image}` : "https://via.placeholder.com/150");
    setImageFile(null);
    setIsEditing(false);
  };

  const handleFileInputClick = () => {
    document.getElementById("file-input").click(); // Inputni bosish uchun chaqirish
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-lg p-6 bg-white shadow-md rounded-lg">
        <CardBody>
          <h2 className="text-2xl font-semibold text-center mb-6">My Profile</h2>

          <div className="flex flex-col items-center space-y-4">
            <Avatar
              src={imagePreview}
              alt="User Profile"
              size="xxl"
              className="border-4 border-gray-200 shadow-lg"
            />
            {isEditing && (
              <div className="mt-4 w-full flex flex-col items-center">
                <label className="block mb-2 text-sm font-medium text-gray-700">Upload a new image</label>
                <Button color="blue" onClick={handleFileInputClick} className="">Upload</Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                  id="file-input"
                />
              </div>
            )}

            <div className="text-center">
              {isEditing ? (
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full mb-4"
                />
              ) : (
                <p className="text-xl font-medium">{profile?.fullName}</p>
              )}
              <p className="text-gray-500 text-sm">{profile?.role}</p>
            </div>

            <div className="flex space-x-4 mt-6">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} color="green" className="w-24">Save</Button>
                  <Button onClick={handleCancel} color="red" className="w-24">Cancel</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} color="blue" className="w-32">Edit Profile</Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
