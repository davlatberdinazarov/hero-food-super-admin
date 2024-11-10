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
import useEstablishmentsStore from "../../stores/establishmentsStore";
import { Spinner } from "@material-tailwind/react"; // Import a Spinner for loading indication
import { useRenderStore } from "../../stores/rendersStore";

export function AddFoodEstablishment() {
  const [title, setTitle] = useState("");
  const [ownerFullName, setOwnerFullName] = useState("");
  const [address, setAddress] = useState("");
  const [workingTime, setWorkingTime] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [telegram, setTelegram] = useState("");
  const [instagram, setInstagram] = useState("");
  const [sizeOfEstablishment, setSizeOfEstablishment] = useState("");
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for the image upload
  const [categoryId, setCategoryId] = useState("");
  const [cityId, setCityId] = useState("");
  const [regionId, setRegionId] = useState("");
  const [open, setOpen] = useState(false); // Added open state for dialog
  const [errors, setErrors] = useState({}); // Added errors state for validation feedback

  const { foodEstablishmentRenderStore } = useRenderStore();

  const {
    regions,
    cities,
    categories,
    fetchRegions,
    fetchCities,
    fetchCategories,
    clearCities,
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
    const file = e.target.files[0];
    if (file) {
      setLoading(true); // Set loading state to true
      setBanner(file);
      // Simulate upload time delay for demo
      setTimeout(() => setLoading(false), 1000); // Clear loading after 1 second
    }
  };

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
    formData.append("telegram", telegram);
    formData.append("instagram", instagram);
    formData.append("sizeOfEstablishment", sizeOfEstablishment);
    formData.append("category", categoryId);
    formData.append("city", cityId);
    formData.append("region", regionId);
    if (banner) formData.append("banner", banner);

    try {
      const response = await $api.post("/food-establishments/create", formData);
      if (response.status === 201) {
        sweetAlert("Food establishment added successfully!", "success");
        setOpen(false);
        clearCities();
        fetchCities(regionId);
        foodEstablishmentRenderStore(); // Render store to update food establishment list
      }
    } catch (error) {
      console.error("Error creating food establishment:", error);
      sweetAlert("Failed to add food establishment.", "error");
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Food Establishment</Button>
      <Dialog open={open} size="sm" handler={setOpen}>
        <DialogHeader>Add Food Establishment</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-3">
            <div className=" flex gap-2">
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
            </div>

            <Input
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              error={!!errors.address}
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}

            <div className=" flex gap-2">
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
            </div>

            <div className=" flex gap-2">
              <Input
                label="Telegram"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
              />

              <Input
                label="Instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
              />
            </div>

            <Select
              label="Size of Establishment"
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
                  onChange={handleBannerChange}
                />
                {loading ? <Spinner color="blue" size="sm" /> : "Upload Banner"}
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

/* 
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

*/
