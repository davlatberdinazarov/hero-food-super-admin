import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { FaPencilAlt } from "react-icons/fa";
import $api from "../../utils/api";
import { sweetAlert } from "../../utils/sweetalert";
import { useRenderStore } from "../../stores/rendersStore";

export function UpdateDetailDialog({ detail }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(detail.name);
  const [image, setImage] = useState(null); // Image is a file object

  const { detailRenderStore } = useRenderStore();

  const handleOpen = () => setOpen(!open);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);

    try {
      const response = await $api.patch(
        `/establishment-detail/${detail.id}`,
        formData
      );
      if (response.status === 200) {
        sweetAlert("detail updated successfully", "success");
        detailRenderStore();
        setOpen(false);
      } else {
        sweetAlert("Failed to update detail", "error");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error updating detail";
      sweetAlert(errorMessage, "error");
    }
  };

  return (
    <>
      <Button onClick={handleOpen} variant="button">
        <FaPencilAlt />
      </Button>
      <Dialog size="xs" open={open} handler={handleOpen}>
        <DialogHeader>Edit detail</DialogHeader>
        <DialogBody className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Image"
            type="file"
            onChange={(e) => setImage(e.target.files[0])} // Store the file object
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleOpen}>
            Cancel
          </Button>
          <Button variant="gradient" color="green" onClick={handleUpdate}>
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
