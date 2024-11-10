import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { useRenderStore } from "../../stores/rendersStore";
import { useParams } from "react-router-dom";
import $api from "../../utils/api";
import { sweetAlert } from "../../utils/sweetalert";

export default function AddDetailDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null); // Image is a file object
  const { detailRenderStore } = useRenderStore();
  const { foodEsId } = useParams();

  const handleOpen = () => setOpen(!open);
  
  const handleCreate = async () => {
    // Ensure both name and image are populated
    if (!name || !image) {
      sweetAlert("Please provide both name and image.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);

    console.log(name, image);

    try {
      const response = await $api.post(`/establishment-detail/${foodEsId}`, formData);
      console.log(response)
      if (response.status === 201) {
        sweetAlert("Detail created successfully", "success");
        setOpen(false);
        detailRenderStore();
      } else {
        sweetAlert("Failed to create detail", "error");
      }
    } catch (error) {
      console.log('Error occurred:', error);
      const errorMessage = error.response?.data?.message || "Error creating detail";
      sweetAlert(errorMessage, "error");
    }
  };

  return (
    <>
      <Button onClick={handleOpen}>Add Detail</Button>
      <Dialog size="xs" open={open} handler={handleOpen}>
        <DialogHeader>Add New Detail</DialogHeader>
        <DialogBody className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
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
          <Button variant="gradient" color="green" onClick={handleCreate}>
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
