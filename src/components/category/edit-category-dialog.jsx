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
  const [name, setName] = useState(data.name);
  const [luxuryRate, setLuxuryRate] = useState(data.luxuryRate);
  const [errors, setErrors] = useState({});

  const { categoryRenderStore } = useRenderStore();

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await $api.get(`/categories/${data.id}`);
        const category = response.data;
        setName(category.name);
        setLuxuryRate(category.luxuryRate);
      } catch (error) {
        console.error("Failed to fetch category data", error);
      }
    };

    if (open && data.id) fetchCategoryData();
  }, [open, data.id]);

  const handleOpen = () => setOpen(!open);

  const handleSubmit = async () => {
    const options = { name, luxuryRate };

    const newErrors = {};
    if (!name) newErrors.name = "Category name is required";
    if (!luxuryRate) newErrors.luxuryRate = "Luxury rate is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await $api.patch(`/categories/update/${data.id}`, options);
      if (response.status === 200) {
        setOpen(false);
        sweetAlert("Category updated successfully", "success");
        categoryRenderStore();
      } else {
        sweetAlert("Failed to update category", "error");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error updating category";
      sweetAlert(errorMessage, "error");
      setOpen(false);
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
            onChange={(value) => setLuxuryRate(value)}
            error={!!errors.luxuryRate}
          >
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
            <Option value="5">5</Option>
          </Select>
          {errors.luxuryRate && <p className="text-red-500 text-sm">{errors.luxuryRate}</p>}
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
