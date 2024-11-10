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
import $api from "../../utils/api";
import { sweetAlert } from "../../utils/sweetalert";
import { FaPencilAlt } from "react-icons/fa";
import { useRenderStore } from "../../stores/rendersStore";

export function EditCategoryDialog({ data }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(data.name || "");
  const [luxuryRate, setLuxuryRate] = useState(data.luxuryRate || "");
  const [image, setImage] = useState(null); // New state for image
  const [imagePreview, setImagePreview] = useState(data.image || ""); // Preview existing or selected image
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { categoryRenderStore } = useRenderStore();

  const handleOpen = () => setOpen(!open);

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (open && data.id && (!name || !luxuryRate)) {
        try {
          const response = await $api.get(`/categories/${data.id}`);
          const category = response.data;
          setName(category.name);
          setLuxuryRate(category.luxuryRate);
          setImagePreview(category.image); // Set existing image preview
        } catch (error) {
          console.error("Failed to fetch category data", error);
        }
      }
    };
    fetchCategoryData();
  }, [open, data.id, name, luxuryRate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Show image preview
    }
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Category name is required";
    if (!luxuryRate) newErrors.luxuryRate = "Luxury rate is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("luxuryRate", luxuryRate);
    if (image) formData.append("image", image); // Append image if available

    setIsLoading(true);
    try {
      const response = await $api.patch(`/categories/update/${data.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        sweetAlert("Category updated successfully", "success");
        categoryRenderStore();
        setOpen(false);
      } else {
        sweetAlert("Failed to update category", "error");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error updating category";
      sweetAlert(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <IconButton onClick={handleOpen} variant="button">
        <FaPencilAlt className="text-[17px]" />
      </IconButton>
      <Dialog
        size="sm"
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>Update Category</DialogHeader>
        <DialogBody className="space-y-4">
          <Input
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            success={!errors.name && name}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <Select
            label="Luxury Rate"
            value={luxuryRate}
            onChange={(e) => setLuxuryRate(e)}
            error={!!errors.luxuryRate}
          >
            {[1, 2, 3, 4, 5].map((rate) => (
              <Option key={rate} value={rate.toString()}>
                {rate}
              </Option>
            ))}
          </Select>
          {errors.luxuryRate && <p className="text-red-500 text-sm">{errors.luxuryRate}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input type="file" onChange={handleImageChange} className="mt-1" />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2 w-full h-32 object-cover" />
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Confirm"}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
