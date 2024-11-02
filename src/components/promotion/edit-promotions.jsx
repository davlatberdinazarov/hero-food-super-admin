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

export function EditPromotionDialog({ promotion }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(promotion.title);
  const [description, setDescription] = useState(promotion.description);
  const [discountPercentage, setDiscountPercentage] = useState(promotion.discountPercentage);
  const [startDate, setStartDate] = useState(promotion.startDate);
  const [endDate, setEndDate] = useState(promotion.endDate);
  const [banner, setBanner] = useState(null);
  const { promotionRenderStore } = useRenderStore();

  const handleOpen = () => setOpen(!open);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("discountPercentage", discountPercentage);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    if (banner) formData.append("banner", banner);

    try {
      const response = await $api.put(`/promotions/update/${promotion.id}`, formData);
      if (response.status === 200) {
        sweetAlert("Promotion updated successfully", "success");
        promotionRenderStore();
        setOpen(false);
      } else {
        sweetAlert("Failed to update promotion", "error");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error updating promotion";
      sweetAlert(errorMessage, "error");
    }
  };

  return (
    <>
      <Button onClick={handleOpen} variant="button">
        <FaPencilAlt />
      </Button>
      <Dialog size="xs" open={open} handler={handleOpen}>
        <DialogHeader>Edit Promotion</DialogHeader>
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
          <Button variant="gradient" color="green" onClick={handleUpdate}>
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
