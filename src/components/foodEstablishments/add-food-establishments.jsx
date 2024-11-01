import React, { useState, useEffect } from 'react';
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
import $api from '../../utils/api';
import useEstablishmentsStore from '../../stores/establishmentsStore';

export function AddFoodEstablishment() {
  const [title, setTitle] = useState('');
  const [ownerFullName, setOwnerFullName] = useState('');
  const [address, setAddress] = useState('');
  const [workingTime, setWorkingTime] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sizeOfEstablishment, setSizeOfEstablishment] = useState('');
  const [banner, setBanner] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [cityId, setCityId] = useState('');
  const [regionId, setRegionId] = useState('');
  const [open, setOpen] = useState(false); // Added open state for dialog
  const [errors, setErrors] = useState({}); // Added errors state for validation feedback

  const {
    regions,
    cities,
    categories,
    fetchRegions,
    fetchCities,
    fetchCategories,
    clearCities
  } = useEstablishmentsStore();

  useEffect(() => {
    fetchRegions();
    fetchCategories();
  }, [fetchRegions, fetchCategories]);

  const handleRegionChange = (e) => {
    setRegionId(e);
    fetchCities(e);
  };

  const handleBannerChange = (e) => {
    setBanner(e.target.files[0]);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title) newErrors.title = "Title is required";
    if (!ownerFullName) newErrors.ownerFullName = "Owner's full name is required";
    if (!address) newErrors.address = "Address is required";
    if (!workingTime) newErrors.workingTime = "Working time is required";
    if (!phoneNumber) newErrors.phoneNumber = "Phone number is required";
    if (!sizeOfEstablishment) newErrors.sizeOfEstablishment = "Size of establishment is required";
    if (!categoryId) newErrors.categoryId = "Category is required";
    if (!cityId) newErrors.cityId = "City is required";
    if (!regionId) newErrors.regionId = "Region is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('ownerFullName', ownerFullName);
    formData.append('address', address);
    formData.append('workingTime', workingTime);
    formData.append('phoneNumber', phoneNumber);
    formData.append('sizeOfEstablishment', sizeOfEstablishment);
    formData.append('category', categoryId);
    formData.append('city', cityId);
    formData.append('region', regionId);
    if (banner) formData.append('banner', banner);

    try {
      const response = await $api.post('/food-establishments/create', formData);
      if (response.status === 201) {
        sweetAlert("Food establishment added successfully!", "success");
        setOpen(false);
        clearCities();
        fetchCities(regionId);
      }
    } catch (error) {
      console.error("Error creating food establishment:", error);
      sweetAlert("Failed to add food establishment.", "error");
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Food Establishment</Button>
      <Dialog open={open} size="lg" handler={setOpen}>
        <DialogHeader>Add Food Establishment</DialogHeader>
        <DialogBody>
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!errors.title}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

          <Input
            label="Owner Full Name"
            value={ownerFullName}
            onChange={(e) => setOwnerFullName(e.target.value)}
            error={!!errors.ownerFullName}
          />
          {errors.ownerFullName && <p className="text-red-500 text-sm">{errors.ownerFullName}</p>}

          <Input
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={!!errors.address}
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}

          <Input
            label="Working Time"
            value={workingTime}
            onChange={(e) => setWorkingTime(e.target.value)}
            error={!!errors.workingTime}
          />
          {errors.workingTime && <p className="text-red-500 text-sm">{errors.workingTime}</p>}

          <Input
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            error={!!errors.phoneNumber}
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}

          <Select
            label="Size of Establishment"
            onChange={(e) => setSizeOfEstablishment(e)}
            error={!!errors.sizeOfEstablishment}
          >
            <Option value="small">Small</Option>
            <Option value="medium">Medium</Option>
            <Option value="huge">Large</Option>
          </Select>
          {errors.sizeOfEstablishment && <p className="text-red-500 text-sm">{errors.sizeOfEstablishment}</p>}

          <Select
            label="Region"
            onChange={handleRegionChange}
            error={!!errors.regionId}
          >
            {regions.map((region) => (
              <Option key={region.id} value={region.id}>{region.name}</Option>
            ))}
          </Select>
          {errors.regionId && <p className="text-red-500 text-sm">{errors.regionId}</p>}

          <Select
            label="City"
            onChange={(e) => setCityId(e)}
            error={!!errors.cityId}
          >
            {cities.map((city) => (
              <Option key={city.id} value={city.id}>{city.name}</Option>
            ))}
          </Select>
          {errors.cityId && <p className="text-red-500 text-sm">{errors.cityId}</p>}

          <Select
            label="Category"
            onChange={(e) => setCategoryId(e)}
            error={!!errors.categoryId}
          >
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>{category.name}</Option>
            ))}
          </Select>
          {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId}</p>}

          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <FiUploadCloud size={24} />
              <input type="file" className="hidden" onChange={handleBannerChange} />
              Upload Banner
            </label>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleSubmit}>Submit</Button>
          <Button color="red" onClick={() => setOpen(false)}>Cancel</Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
