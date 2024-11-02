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

export function DeletePromotionDialog({ id }) {
  const [open, setOpen] = useState(false);
  const { promotionRenderStore } = useRenderStore();

  const handleOpen = () => setOpen(!open);

  const handleDelete = async () => {
    try {
      const response = await $api.delete(`/promotions/delete/${id}`);
      if (response.status === 200) {
        sweetAlert("Promotion deleted successfully", "success");
        promotionRenderStore();
        setOpen(false);
      } else {
        sweetAlert("Failed to delete promotion", "error");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error deleting promotion";
      sweetAlert(errorMessage, "error");
    }
  };

  return (
    <>
      <IconButton onClick={handleOpen} variant="button">
        <FaTrashCan />
      </IconButton>
      <Dialog size="xs" open={open} handler={handleOpen}>
        <DialogHeader>Are you sure you want to delete this promotion?</DialogHeader>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleOpen}>
            Cancel
          </Button>
          <Button variant="gradient" color="green" onClick={handleDelete}>
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
