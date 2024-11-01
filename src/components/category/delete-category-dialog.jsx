import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogFooter,
  IconButton,
} from "@material-tailwind/react";
import { FaTrashCan } from "react-icons/fa6";
import $api from "../../utils/api";
import { sweetAlert } from "../../utils/sweetalert";
import { useRenderStore } from "../../stores/rendersStore";

export function DeleteCategoryDialog({ id }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(!open);
  const { categoryRenderStore } = useRenderStore();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await $api.delete(`/categories/delete/${id}`);
      if (response.status === 200) {
        sweetAlert("Category deleted successfully", "success");
        setOpen(false);
        categoryRenderStore(); // Refresh category list
      } else {
        sweetAlert("Failed to delete category", "error");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error deleting category";
      sweetAlert(errorMessage, "error");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <IconButton onClick={handleOpen} variant="button">
        <FaTrashCan className="text-[17px]" />
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
        <DialogHeader>Are you sure you want to delete this category?</DialogHeader>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            loading={loading}
            variant="gradient"
            color="green"
            onClick={handleDelete}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}