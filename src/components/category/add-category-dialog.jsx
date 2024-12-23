import React, { useState } from "react";
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
import $api from "../../utils/api";
import { sweetAlert } from "../../utils/sweetalert";
import { useRenderStore } from "../../stores/rendersStore";

export function AddCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [luxuryRate, setLuxuryRate] = useState("");
  const [image, setImage] = useState(null); // Add image state
  const [errors, setErrors] = useState({});
  const { categoryRenderStore } = useRenderStore();

  const handleOpen = () => setOpen(!open);

  const handleSubmit = async () => {
    // Simple client-side validation for empty fields
    const newErrors = {};
    if (!name) newErrors.name = "Category name is required";
    if (!luxuryRate) newErrors.luxuryRate = "Luxury rate is required";
    if (!image) newErrors.image = "Image is required"; // Validate image
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Use FormData to include image and other fields in the request
    const formData = new FormData();
    formData.append("name", name);
    formData.append("luxuryRate", luxuryRate);
    formData.append("image", image); // Add image file to FormData

    try {
      const response = await $api.post(`/categories/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201) {
        setOpen(false);
        sweetAlert("Category added successfully", "success");
        categoryRenderStore();
        // Reset form fields after successful submission
        setName("");
        setLuxuryRate("");
        setImage(null); // Reset image state
        setErrors({});
      } else {
        sweetAlert("Failed to add category", "error");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error adding category";
      sweetAlert(errorMessage, "error");
      setOpen(false);
    }
  };

  return (
    <>
      <Button onClick={handleOpen} variant="gradient">
        Add Category
      </Button>
      <Dialog
        size="sm"
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>Add New Category</DialogHeader>
        <DialogBody className="space-y-4">
          <Input
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            success={!errors.name && name}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name}</p>
          )}

          <Select
            label="Luxury Rate"
            value={luxuryRate}
            onChange={(value) => setLuxuryRate(value)}
            error={!!errors.luxuryRate}
          >
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
            <Option value="5">5</Option>
          </Select>
          {errors.luxuryRate && (
            <p className="text-red-500 text-sm">{errors.luxuryRate}</p>
          )}

          <Input
            type="file"
            label="Category Image"
            onChange={(e) => setImage(e.target.files[0])} // Set image state
            error={!!errors.image}
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image}</p>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleSubmit}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
