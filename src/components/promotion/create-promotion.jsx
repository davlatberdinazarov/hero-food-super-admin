import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import $api from "../../utils/api";
import { sweetAlert } from "../../utils/sweetalert";
import { useRenderStore } from "../../stores/rendersStore";
import { useParams } from "react-router-dom";

export function CreatePromotionDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [banner, setBanner] = useState(null);
  const { promotionRenderStore } = useRenderStore();
  const { foodEsId } = useParams();

  const handleOpen = () => setOpen(!open);

  const handleCreate = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("discountPercentage", discountPercentage);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("foodEstablishmentId", foodEsId);
    if (banner) formData.append("banner", banner);

    try {
      const response = await $api.post("/promotions/create", formData);
      if (response.status === 201) {
        sweetAlert("Promotion created successfully", "success");
        promotionRenderStore();
        setOpen(false);
      } else {
        sweetAlert("Failed to create promotion", "error");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error creating promotion";
      sweetAlert(errorMessage, "error");
    }
  };

  return (
    <>
      <Button onClick={handleOpen}>Add Promotion</Button>
      <Dialog size="xs" open={open} handler={handleOpen}>
        <DialogHeader>Add New Promotion</DialogHeader>
        <DialogBody className="space-y-4">
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input label="Discount Percentage" type="number" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} />
          <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Input label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <Input label="Banner" type="file" onChange={(e) => setBanner(e.target.files[0])} />
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

/*
Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsam perferendis id error libero dignissimos natus!

*/