import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
} from "@material-tailwind/react";
import $api from "../../utils/api";
import { sweetAlert } from "../../utils/sweetalert";
import { useParams } from "react-router-dom";
import { useRenderStore } from "../../stores/rendersStore";

export function AddMenuCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const { foodEsId } = useParams(); // URL dan foodEstablishmentId ni olish
  const [loading, setLoading] = useState(false);

  // `menuCategoryRenderStore` ni `useRenderStore` orqali olish
  const { menuCategoryRenderStore } = useRenderStore();

  const handleOpen = () => setOpen(!open);

  const handleSubmit = async () => {
    const options = {
      name,
      description,
      foodEstablishmentId: foodEsId,
    };

    // Oddiy validatsiya
    const newErrors = {};
    if (!name) newErrors.name = "Category name is required";
    if (!description) newErrors.description = "Description is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await $api.post(`/menu-categories/create`, options);
      if (response.status === 201) {
        setOpen(false);
        sweetAlert("Category added successfully", "success");
        menuCategoryRenderStore();  // renderni yangilash uchun chaqirildi
        setName("");
        setDescription("");
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
        Add Menu Category
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
        <DialogHeader>Add New Menu Category</DialogHeader>
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
          <Button variant="gradient" color="green" onClick={handleSubmit} disabled={loading}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
