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
  Spinner,
} from "@material-tailwind/react";
import { FiUploadCloud } from "react-icons/fi";
import { sweetAlert } from "../../utils/sweetalert";
import $api from "../../utils/api";
import useEstablishmentsStore from "../../stores/establishmentsStore";
import { useRenderStore } from "../../stores/rendersStore";

export function AddFoodEstablishment() {
  const [formValues, setFormValues] = useState({
    title: "",
    ownerFullName: "",
    address: "",
    workingTime: "",
    phoneNumber: "",
    telegram: "",
    instagram: "",
    sizeOfEstablishment: "",
    banner: null,
    categoryId: "",
    cityId: "",
    regionId: "",
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  console.log(cities)

  useEffect(() => {
    fetchRegions();
    fetchCategories();
  }, [fetchRegions, fetchCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleRegionChange = (e) => {
    setFormValues((prevValues) => ({ ...prevValues, regionId: e }));
    fetchCities(e);
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      setFormValues((prevValues) => ({ ...prevValues, banner: file }));
      setTimeout(() => setLoading(false), 1000); // Simulate upload
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.title) newErrors.title = "Title is required";
    if (!formValues.ownerFullName)
      newErrors.ownerFullName = "Owner's full name is required";
    if (!formValues.address) newErrors.address = "Address is required";
    if (!formValues.workingTime)
      newErrors.workingTime = "Working time is required";
    if (!formValues.phoneNumber)
      newErrors.phoneNumber = "Phone number is required";
    if (!formValues.sizeOfEstablishment)
      newErrors.sizeOfEstablishment = "Size of establishment is required";
    if (!formValues.categoryId) newErrors.categoryId = "Category is required";
    if (!formValues.cityId) newErrors.cityId = "City is required";
    if (!formValues.regionId) newErrors.regionId = "Region is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const formData = new FormData();
    Object.keys(formValues).forEach((key) => {
      formData.append(key, formValues[key]);
    });

    try {
      const response = await $api.post("/food-establishments/create", formData);
      if (response.status === 201) {
        sweetAlert("Food establishment added successfully!", "success");
        setOpen(false);
        setFormValues({
          title: "",
          ownerFullName: "",
          address: "",
          workingTime: "",
          phoneNumber: "",
          telegram: "",
          instagram: "",
          sizeOfEstablishment: "",
          banner: null,
          categoryId: "",
          cityId: "",
          regionId: "",
        });
        clearCities();
        fetchCities(formValues.regionId);
        foodEstablishmentRenderStore();
      }
    } catch (error) {
      console.error("Error creating food establishment:", error);
      sweetAlert("Failed to add food establishment.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Food Establishment</Button>
      <Dialog open={open} size="sm" handler={setOpen}>
        <DialogHeader>Add Food Establishment</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <Input
                label="Title"
                name="title"
                value={formValues.title}
                onChange={handleChange}
                error={!!errors.title}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}

              <Input
                label="Owner Full Name"
                name="ownerFullName"
                value={formValues.ownerFullName}
                onChange={handleChange}
                error={!!errors.ownerFullName}
              />
              {errors.ownerFullName && (
                <p className="text-red-500 text-sm">{errors.ownerFullName}</p>
              )}
            </div>
            <Input
              label="Address"
              name="address"
              value={formValues.address}
              onChange={handleChange}
              error={!!errors.address}
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}

            <div className="flex gap-3">
              <Input
                label="Working Time"
                name="workingTime"
                value={formValues.workingTime}
                onChange={handleChange}
                error={!!errors.workingTime}
              />
              {errors.workingTime && (
                <p className="text-red-500 text-sm">{errors.workingTime}</p>
              )}
              <Input
                label="Phone Number"
                name="phoneNumber"
                value={formValues.phoneNumber}
                onChange={handleChange}
                error={!!errors.phoneNumber}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )}
            </div>

            <div className="flex gap-3">
              <Input
                label="Telegram"
                name="telegram"
                value={formValues.telegram}
                onChange={handleChange}
              />

              <Input
                label="Instagram"
                name="instagram"
                value={formValues.instagram}
                onChange={handleChange}
              />
            </div>

            <Select
              label="Size of Establishment"
              name="sizeOfEstablishment"
              value={formValues.sizeOfEstablishment}
              onChange={(e) =>
                setFormValues((prevValues) => ({
                  ...prevValues,
                  sizeOfEstablishment: e,
                }))
              }
              error={!!errors.sizeOfEstablishment}
            >
              <Option value="small">Small</Option>
              <Option value="medium">Medium</Option>
              <Option value="large">Large</Option>
            </Select>
            {errors.sizeOfEstablishment && (
              <p className="text-red-500 text-sm">
                {errors.sizeOfEstablishment}
              </p>
            )}

            <Select
              label="Region"
              name="regionId"
              value={formValues.regionId}
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
              name="cityId"
              value={formValues.cityId}
              onChange={(value) =>
                setFormValues((prevValues) => ({
                  ...prevValues,
                  cityId: value,
                }))
              }
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
              name="categoryId"
              value={formValues.categoryId}
              onChange={(e) =>
                setFormValues((prevValues) => ({
                  ...prevValues,
                  categoryId: e,
                }))
              }
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
