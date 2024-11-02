import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  IconButton,
} from "@material-tailwind/react";
import $api from "../../utils/api";
import { sweetAlert } from "../../utils/sweetalert";
import { useRenderStore } from "../../stores/rendersStore";
import { FaPencilAlt } from "react-icons/fa";

export function EditMenuCategoryDialog({ data }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(data.name);
  const [description, setDescription] = useState(data.description);
  const [errors, setErrors] = useState({});

  // Zustand store for re-rendering after update
  const { menuCategoryRenderStore } = useRenderStore();

  // Fetch category data when the dialog is opened
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await $api.get(`/menu-categories/${data.id}`);
        const category = response.data;
        setName(category.name);
        setDescription(category.description);
      } catch (error) {
        console.error("Failed to fetch category data", error);
      }
    };

    if (open && data.id) fetchCategoryData();
  }, [open, data.id]);

  const handleOpen = () => setOpen(!open);

  const handleSubmit = async () => {
    const options = {
      name,
      description,
    };

    // Simple client-side validation
    const newErrors = {};
    if (!name) newErrors.name = "Category name is required";
    if (!description) newErrors.description = "Description is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await $api.put(`/menu-categories/update/${data.id}`, options);
      if (response.status === 200) {
        setOpen(false);
        sweetAlert("Category updated successfully", "success");
        menuCategoryRenderStore(); // Update render store
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
        <DialogHeader>Update Menu Category</DialogHeader>
        <DialogBody className="space-y-4">
          <Input
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            success={!errors.name && name}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={!!errors.description}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
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
