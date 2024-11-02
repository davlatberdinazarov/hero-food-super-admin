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
  IconButton,
} from "@material-tailwind/react";
import { FiUploadCloud } from "react-icons/fi";
import { sweetAlert } from "../../utils/sweetalert";
import $api from "../../utils/api";
import useEstablishmentsStore from "../../stores/establishmentsStore";
import { Spinner } from "@material-tailwind/react";
import { FaPencilAlt } from "react-icons/fa";
import { useRenderStore } from "../../stores/rendersStore";

export function EditFoodEstablishment({ data }) {
  const [title, setTitle] = useState(data?.title || "");
  const [ownerFullName, setOwnerFullName] = useState(data?.ownerFullName || "");
  const [address, setAddress] = useState(data?.address || "");
  const [workingTime, setWorkingTime] = useState(data?.workingTime || "");
  const [phoneNumber, setPhoneNumber] = useState(data?.phoneNumber || "");
  const [sizeOfEstablishment, setSizeOfEstablishment] = useState(
    data?.sizeOfEstablishment || ""
  );
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState(data?.categoryId || "");
  const [cityId, setCityId] = useState(data?.cityId || "");
  const [regionId, setRegionId] = useState(data?.regionId || "");
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);

  const {
    regions,
    cities,
    categories,
    fetchRegions,
    fetchCities,
    fetchCategories,
    clearCities,
  } = useEstablishmentsStore();

  const { foodEstablishmentRenderStore } = useRenderStore();

  useEffect(() => {
    fetchRegions();
    fetchCategories();
    if (regionId) fetchCities(regionId);
  }, [fetchRegions, fetchCategories, fetchCities, regionId]);

  const handleRegionChange = (e) => {
    setRegionId(e);
    fetchCities(e);
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      setBanner(file);
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const handleOpen = () => setOpen((cur) => !cur);


  const validateForm = () => {
    const newErrors = {};
    if (!title) newErrors.title = "Title is required";
    if (!ownerFullName)
      newErrors.ownerFullName = "Owner's full name is required";
    if (!address) newErrors.address = "Address is required";
    if (!workingTime) newErrors.workingTime = "Working time is required";
    if (!phoneNumber) newErrors.phoneNumber = "Phone number is required";
    if (!sizeOfEstablishment)
      newErrors.sizeOfEstablishment = "Size of establishment is required";
    if (!categoryId) newErrors.categoryId = "Category is required";
    if (!cityId) newErrors.cityId = "City is required";
    if (!regionId) newErrors.regionId = "Region is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("ownerFullName", ownerFullName);
    formData.append("address", address);
    formData.append("workingTime", workingTime);
    formData.append("phoneNumber", phoneNumber);
    formData.append("sizeOfEstablishment", sizeOfEstablishment);
    formData.append("category", categoryId);
    formData.append("city", cityId);
    formData.append("region", regionId);
    if (banner) formData.append("banner", banner);

    try {
      const response = await $api.put(
        `/food-establishments/update/${data.id}`,
        formData
      );
      console.log(response);
      if (response.status === 200) {
        sweetAlert("Food establishment updated successfully!", "success");
        setOpen(false);
        clearCities();
        foodEstablishmentRenderStore(); // Refresh food establishment list
      }
    } catch (error) {
      console.error("Error updating food establishment:", error);
      sweetAlert("Failed to update food establishment.", "error");
    }
  };

  return (
    <div>
      <IconButton onClick={handleOpen}>
        <FaPencilAlt size={14} />
      </IconButton>
      <Dialog open={open} size="sm" handler={setOpen}>
        <DialogHeader>Update Food Establishment</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-3">
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errors.title}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}

            <Input
              label="Owner Full Name"
              value={ownerFullName}
              onChange={(e) => setOwnerFullName(e.target.value)}
              error={!!errors.ownerFullName}
            />
            {errors.ownerFullName && (
              <p className="text-red-500 text-sm">{errors.ownerFullName}</p>
            )}

            <Input
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              error={!!errors.address}
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}

            <Input
              label="Working Time"
              value={workingTime}
              onChange={(e) => setWorkingTime(e.target.value)}
              error={!!errors.workingTime}
            />
            {errors.workingTime && (
              <p className="text-red-500 text-sm">{errors.workingTime}</p>
            )}

            <Input
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              error={!!errors.phoneNumber}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
            )}

            <Select
              label="Size of Establishment"
              value={sizeOfEstablishment}
              onChange={(e) => setSizeOfEstablishment(e)}
              error={!!errors.sizeOfEstablishment}
            >
              <Option value="small">Small</Option>
              <Option value="medium">Medium</Option>
              <Option value="huge">Large</Option>
            </Select>
            {errors.sizeOfEstablishment && (
              <p className="text-red-500 text-sm">
                {errors.sizeOfEstablishment}
              </p>
            )}

            <Select
              label="Region"
              value={regionId}
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
              value={cityId}
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
              value={categoryId}
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
                  onChange={handleBannerChange}
                />
                {loading ? <Spinner color="blue" size="sm" /> : "Upload Banner"}
              </label>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button className="mr-2" onClick={handleSubmit} disabled={loading}>
            Update
          </Button>
          <Button color="red" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
