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
import $api from "../../utils/api";
import { sweetAlert } from "../../utils/sweetalert";
import { useRenderStore } from "../../stores/rendersStore";

export function DeleteCityDialog({id}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleOpen = () => setOpen(!open);
  const { cityRenderStore } = useRenderStore();


  const handleDelete = async () => {
    setLoading(true);
    try {
        const response = await $api.delete(`/cities/${id}`);
        if (response.status === 200) {
            sweetAlert("City deleted successfully", "success");
            setOpen(false);
            setLoading(false);
            cityRenderStore();  // Now you can call it here without issues
        } else {
            sweetAlert("Failed to delete city", "error");
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Error adding city";
        sweetAlert(errorMessage, "error");
        setLoading(false);
        setOpen(false);
    }
    handleOpen();
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
        <DialogHeader>Rostan ham o'chirmoqchimisiz!</DialogHeader>
        <DialogBody></DialogBody>
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
