import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Input,
  IconButton,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import $api from "../../utils/api";
import { useParams } from "react-router-dom";
import { useRenderStore } from "../../stores/rendersStore";
import { sweetAlert } from "../../utils/sweetalert";
import { FaPencilAlt } from "react-icons/fa";

export default function EditFood({ data }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const { foodsRenderStore } = useRenderStore();

  // Dialogni ochish yoki yopish
  const handleOpen = () => setOpen(!open);

  // Formani yuborish uchun funksiyani yaratamiz
  const onSubmit = async (formData) => {
    const updateData = new FormData();
    updateData.append("name", formData.name);
    updateData.append("price", formData.price);
    if (formData.banner) updateData.append("banner", formData.banner[0]);
    updateData.append("description", formData.description);
    if (formData.ingredients) updateData.append("ingredients", formData.ingredients);

    try {
      // PUT so'rovini yuboramiz
      await $api.put(`/foods/update/${data.id}`, updateData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      sweetAlert("Taom muvaffaqiyatli yangilandi", "success");
      foodsRenderStore();
      reset();
      handleOpen();
    } catch (error) {
      console.error("Failed to update food:", error);
      alert("Xatolik yuz berdi!");
    }
  };

  // Komponent ochilganda boshlang'ich ma'lumotlarni yuklash
  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        price: data.price,
        description: data.description,
        ingredients: data.ingredients,
      });
    }
  }, [data, reset]);

  return (
    <div>
      <IconButton color="blue" onClick={handleOpen}>
        <FaPencilAlt className="h-4 w-4" />
      </IconButton>
      <Dialog size="sm" open={open} handler={handleOpen}>
        <DialogHeader className="justify-between">
          <Typography variant="h5" color="blue-gray">
            Taomni Tahrirlash
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
              Yangilash
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
