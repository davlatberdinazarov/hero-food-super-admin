import { Button } from '@material-tailwind/react';
import React from 'react';
import RestaurantTable from '../../components/restaurants/RestaurantTable';
import { AddRestaurant } from '../../components/restaurants/AddRestaurant';

export default function Restaurants() {
  return (
    <div>
      <header className='flex items-center justify-between my-3'>
        <h1 className='text-black font-bold text-2xl'>Restaurants</h1>
        <AddRestaurant />
      </header>

      <div>
        <RestaurantTable />
      </div>
    </div>
  );
}

// ---------------------------------------------------

import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { FiUploadCloud } from "react-icons/fi";
import { sweetAlert } from "../../utils/sweetalert";
import $api from "../../utils/api";
import useRestaurantStore from "../../stores/restaurantStore";
import { Spinner } from "@material-tailwind/react"; 
import { useRenderStore } from "../../stores/rendersStore";

export function AddRestaurant() {
  const [name, setName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [location, setLocation] = useState("");
  const [hours, setHours] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [categoryId, setCategoryId] = useState("");
  const [cityId, setCityId] = useState("");
  const [regionId, setRegionId] = useState("");
  const [open, setOpen] = useState(false); 
  const [errors, setErrors] = useState({}); 

  const { restaurantRenderStore } = useRenderStore();

  const {
    regions,
    cities,
    categories,
    fetchRegions,
    fetchCities,
    fetchCategories,
    clearCities,
  } = useRestaurantStore();

  useEffect(() => {
    fetchRegions();
    fetchCategories();
  }, [fetchRegions, fetchCategories]);

  const handleRegionChange = (e) => {
    setRegionId(e);
    fetchCities(e);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true); 
      setImage(file);
      setTimeout(() => setLoading(false), 1000); 
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!ownerName) newErrors.ownerName = "Owner's name is required";
    if (!location) newErrors.location = "Location is required";
    if (!hours) newErrors.hours = "Operating hours are required";
    if (!contactNumber) newErrors.contactNumber = "Contact number is required";
    if (!capacity) newErrors.capacity = "Capacity is required";
    if (!categoryId) newErrors.categoryId = "Category is required";
    if (!cityId) newErrors.cityId = "City is required";
    if (!regionId) newErrors.regionId = "Region is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("ownerName", ownerName);
    formData.append("location", location);
    formData.append("hours", hours);
    formData.append("contactNumber", contactNumber);
    formData.append("capacity", capacity);
    formData.append("category", categoryId);
    formData.append("city", cityId);
    formData.append("region", regionId);
    if (image) formData.append("image", image);

    try {
      const response = await $api.post("/restaurants/create", formData);
      if (response.status === 201) {
        sweetAlert("Restaurant added successfully!", "success");
        setOpen(false);
        clearCities();
        fetchCities(regionId);
        restaurantRenderStore(); 
      }
    } catch (error) {
      console.error("Error creating restaurant:", error);
      sweetAlert("Failed to add restaurant.", "error");
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Restaurant</Button>
      <Dialog open={open} size="sm" handler={setOpen}>
        <DialogHeader>Add Restaurant</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-3">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}

            <Input
              label="Owner Name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              error={!!errors.ownerName}
            />
            {errors.ownerName && (
              <p className="text-red-500 text-sm">{errors.ownerName}</p>
            )}

            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              error={!!errors.location}
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}

            <Input
              label="Operating Hours"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              error={!!errors.hours}
            />
            {errors.hours && (
              <p className="text-red-500 text-sm">{errors.hours}</p>
            )}

            <Input
              label="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              error={!!errors.contactNumber}
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-sm">{errors.contactNumber}</p>
            )}

            <Select
              label="Capacity"
              onChange={(e) => setCapacity(e)}
              error={!!errors.capacity}
            >
              <Option value="small">Small</Option>
              <Option value="medium">Medium</Option>
              <Option value="large">Large</Option>
            </Select>
            {errors.capacity && (
              <p className="text-red-500 text-sm">{errors.capacity}</p>
            )}

            <Select
              label="Region"
              onChange={handleRegionChange}
              error={!!errors.regionId}
            >
              {regions.map((region) => (
                <Option key={region.id} value={region.id}>
                  {region.name}
                </Option>
              ))}
            </Select>
            {errors.regionId && (
              <p className="text-red-500 text-sm">{errors.regionId}</p>
            )}

            <Select
              label="City"
              onChange={(e) => setCityId(e)}
              error={!!errors.cityId}
            >
              {cities.map((city) => (
                <Option key={city.id} value={city.id}>
                  {city.name}
                </Option>
              ))}
            </Select>
            {errors.cityId && (
              <p className="text-red-500 text-sm">{errors.cityId}</p>
            )}

            <Select
              label="Category"
              onChange={(e) => setCategoryId(e)}
              error={!!errors.categoryId}
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
            {errors.categoryId && (
              <p className="text-red-500 text-sm">{errors.categoryId}</p>
            )}

            <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <FiUploadCloud size={24} />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {loading ? <Spinner color="blue" size="sm" /> : "Upload Image"}
              </label>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button className="mr-2" onClick={handleSubmit} disabled={loading}>
            Submit
          </Button>
          <Button color="red" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
