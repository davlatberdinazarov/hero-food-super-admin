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
import { BASE_URL } from "../../utils"; // Tasdiqlang, to'g'ri URL bo'lsa

export default function SeeMoreDialog({ data }) {
  const [open, setOpen] = useState(false);

  // Ma'lumotni ajratib olish uchun destrukturatsiya qilamiz
  const {
    title,
    banner,
    ownerFullName,
    address,
    workingTime,
    phoneNumber,
    sizeOfEstablishment,
    createdAt,
    city,
    region,
    category,
  } = data;

  const formattedCreatedAt = format(
    new Date(createdAt),
    "dd/MM/yyyy hh:mm:ss a",
    { timeZone: "Asia/Tashkent" }
  );

  const handleOpen = () => setOpen((cur) => !cur);

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
              <h1 className="font-semibold text-md">{title}</h1>
            </div>
            <div className="mb-3">
              <img
                className="w-full h-48 rounded-md object-cover shadow-md"
                src={banner ? `${BASE_URL}${banner}` : "/default-image.png"}
                alt="Establishment Banner"
              />
            </div>
            <div className="mb-3">
              <h4 className="text-sm text-gray-600">Egasi</h4>
              <h1 className="font-semibold text-md">{ownerFullName}</h1>
            </div>
            <main className="flex mt-3">
              <div className="w-1/2">
                <h4 className="text-sm text-gray-600">Kategoriya</h4>
                <h1 className="font-semibold text-md">{category.name}</h1>
              </div>
              <div className="w-1/2">
                <h4 className="text-sm text-gray-600">Luxury Rate</h4>
                <h1 className="font-semibold text-md">{category.luxuryRate}</h1>
              </div>
            </main>
            <main className="flex mt-3">
              <div className="w-1/2">
                <h4 className="text-sm text-gray-600">Manzil</h4>
                <h1 className="font-semibold text-md">{address}</h1>
              </div>
              <div className="w-1/2">
                <h4 className="text-sm text-gray-600">Shahar</h4>
                <h1 className="font-semibold text-md">{city.name} ({city.size})</h1>
              </div>
            </main>
            <main className="flex mt-3">
              <div className="w-1/2">
                <h4 className="text-sm text-gray-600">Ish vaqti</h4>
                <h1 className="font-semibold text-md">{workingTime}</h1>
              </div>
              <div className="w-1/2">
                <h4 className="text-sm text-gray-600">Telefon</h4>
                <h1 className="font-semibold text-md">{phoneNumber}</h1>
              </div>
            </main>
            <main className="flex mt-3">
              <div className="w-1/2">
                <h4 className="text-sm text-gray-600">Yaratilgan sana</h4>
                <h1 className="font-semibold text-md">{formattedCreatedAt}</h1>
              </div>
              <div className="w-1/2">
                <h4 className="text-sm text-gray-600">Hajmi</h4>
                <h1 className="font-semibold text-md">{sizeOfEstablishment}</h1>
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
