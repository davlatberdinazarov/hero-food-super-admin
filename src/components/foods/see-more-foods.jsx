import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
  Typography,
} from "@material-tailwind/react";

import { FaEye } from "react-icons/fa";
import { format } from "date-fns-tz";
import { BASE_URL } from "../../utils";

export default function SeeMoreFoods({ data }) {
  const [open, setOpen] = useState(false);

  // Ma'lumotni ajratib olish uchun destrukturatsiya qilamiz
  const {
    name,
    banner,
    price,
    description,
    ingredients,
    menuCategory,
    foodEstablishment,
  } = data;

  const formattedCreatedAt = format(
    new Date(foodEstablishment.createdAt),
    "dd/MM/yyyy hh:mm:ss a",
    { timeZone: "Asia/Tashkent" }
  );

  const handleOpen = () => setOpen(!open);

  return (
    <div>
      <IconButton onClick={handleOpen} variant="text">
        <FaEye className="h-4 w-4" />
      </IconButton>
      <Dialog size="sm" open={open} handler={handleOpen}>
        <DialogHeader className="justify-between">
          <Typography variant="h5" color="blue-gray">
            Batafsil ma'lumot
          </Typography>
          <IconButton
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={handleOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </DialogHeader>
        <DialogBody className="px-5 text-black">
          <div className="text-sm">
            <div className="mb-3">
              <h4 className="text-sm text-gray-600">Nomi</h4>
              <h1 className="font-semibold text-md">{name}</h1>
            </div>
            <div className="mb-3">
              <img
                className="w-full h-48 rounded-md object-cover shadow-md"
                src={banner ? `${BASE_URL}/${banner}` : "/default-image.png"}
                alt="Taom Banner"
              />
            </div>
            <div className="mb-3">
              <h4 className="text-sm text-gray-600">Narxi</h4>
              <h1 className="font-semibold text-md">{price} so'm</h1>
            </div>
            <main className="flex mt-3">
              <div className="w-1/2">
                <h4 className="text-sm text-gray-600">Kategoriya</h4>
                <h1 className="font-semibold text-md">{menuCategory.name}</h1>
              </div>
              <div className="w-1/2">
                <h4 className="text-sm text-gray-600">Ta'rif</h4>
                <h1 className="font-semibold text-md">{description}</h1>
              </div>
            </main>
            <main className="flex mt-3">
              <div className="w-1/2">
                <h4 className="text-sm text-gray-600">Ingredientlar</h4>
                <h1 className="font-semibold text-md">{ingredients}</h1>
              </div>
              <div className="w-1/2">
                <h4 className="text-sm text-gray-600">Yaratilgan sana</h4>
                <h1 className="font-semibold text-md">{formattedCreatedAt}</h1>
              </div>
            </main>
            <main className="flex mt-3">
              <div className="w-1/2">
                <h4 className="text-sm text-gray-600">Egasi</h4>
                <h1 className="font-semibold text-md">{foodEstablishment.ownerFullName}</h1>
              </div>
              <div className="w-1/2">
                <h4 className="text-sm text-gray-600">Telefon</h4>
                <h1 className="font-semibold text-md">{foodEstablishment.phoneNumber}</h1>
              </div>
            </main>
            <main className="flex mt-3">
              <div className="w-1/2">
                <h4 className="text-sm text-gray-600">Manzil</h4>
                <h1 className="font-semibold text-md">{foodEstablishment.address}</h1>
              </div>
              <div className="w-1/2">
                <h4 className="text-sm text-gray-600">Hajmi</h4>
                <h1 className="font-semibold text-md">{foodEstablishment.sizeOfEstablishment}</h1>
              </div>
            </main>
          </div>
        </DialogBody>
        <DialogFooter className="justify-between gap-2">
          <Button variant="text" onClick={handleOpen}>
            Yopish
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
