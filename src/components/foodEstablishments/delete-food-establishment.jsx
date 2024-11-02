import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
} from "@material-tailwind/react";
import { FaTrashCan } from "react-icons/fa6";
import $api from "../../utils/api"; // Adjust the path as needed
import { sweetAlert } from "../../utils/sweetalert"; // Adjust the path as needed
import { useRenderStore } from "../../stores/rendersStore"; // Adjust the path as needed

export function DeleteFoodEstablishment({ id }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { foodEstablishmentRenderStore } = useRenderStore(); // For rendering updates

  const handleOpen = () => setOpen(!open);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await $api.delete(`/food-establishments/delete/${id}`); // Using the specified API endpoint
      if (response.status === 200) {
        sweetAlert("Food establishment deleted successfully", "success");
        setOpen(false);
        foodEstablishmentRenderStore(); // Call the store method to refresh the data
      } else {
        sweetAlert("Failed to delete food establishment", "error");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error deleting food establishment";
      sweetAlert(errorMessage, "error");
    } finally {
      setLoading(false);
      handleOpen(); // Ensure the dialog closes regardless of success or error
    }
  };

  return (
    <>
      <IconButton onClick={handleOpen} variant="text">
        <FaTrashCan className="text-[17px]" />
      </IconButton>
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>Rostan ham o'chirmoqchimisiz!</DialogHeader>
        <DialogBody>
          <p>Are you sure you want to delete this food establishment?</p>
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
          <Button loading={loading} variant="gradient" color="green" onClick={handleDelete}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
