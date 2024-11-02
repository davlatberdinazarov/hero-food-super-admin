import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Input,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import $api from "../../utils/api";
import { useParams } from "react-router-dom";
import { useRenderStore } from "../../stores/rendersStore";
import { sweetAlert } from "../../utils/sweetalert";

export default function AddFoods() {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const { foodEsId } = useParams();
  const { menuId } = useParams();
  const { foodsRenderStore } = useRenderStore()

  const handleOpen = () => setOpen(!open);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    if (data.banner) formData.append("banner", data.banner[0]);
    formData.append("description", data.description);
    if (data.ingredients) formData.append("ingredients", data.ingredients);
    formData.append("menuCategoryId", menuId);
    formData.append("foodEstablishmentId", foodEsId);

    try {
      await $api.post("/foods/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      sweetAlert("Taom muvaffaqiyatli qo'shildi", "success");
      foodsRenderStore();
      reset();
      handleOpen();
    } catch (error) {
      console.error("Failed to add food:", error);
      alert("Xatolik yuz berdi!");
    }
  };

  return (
    <div>
      <Button color="blue" onClick={handleOpen}>
        Yangi Taom Qo'shish
      </Button>
      <Dialog size="lg" open={open} handler={handleOpen}>
        <DialogHeader className="justify-between">
          <Typography variant="h5" color="blue-gray">
            Yangi Taom Qo'shish
          </Typography>
          <Button size="sm" variant="text" color="blue-gray" onClick={handleOpen}>
            <span className="material-icons">close</span>
          </Button>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody divider>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Taom Nomi"
                {...register("name", { required: true })}
                variant="standard"
              />
              <Input
                label="Narxi"
                type="number"
                {...register("price", { required: true })}
                variant="standard"
              />
              <Input
                label="Banner"
                type="file"
                {...register("banner")}
                variant="standard"
              />
              <Input
                label="Tavsif"
                {...register("description", { required: true })}
                variant="standard"
              />
              <Input
                label="Ingredientlar"
                {...register("ingredients")}
                variant="standard"
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="text" color="red" onClick={handleOpen}>
              Bekor qilish
            </Button>
            <Button type="submit" color="blue">
              Qo'shish
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
