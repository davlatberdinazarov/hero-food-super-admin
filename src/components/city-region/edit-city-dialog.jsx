import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
  IconButton,
} from "@material-tailwind/react";
import $api from "../../utils/api";
import { sweetAlert } from "../../utils/sweetalert";
import { useParams } from "react-router-dom";
import { useRenderStore } from "../../stores/rendersStore";
import { FaPencilAlt } from "react-icons/fa";

export function EditCityDialog({ data }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(data.name);
  const [size, setSize] = useState(data.size);
  const [errors, setErrors] = useState({});
  const { regionId } = useParams();

  // Zustand store for re-rendering after update
  const { cityRenderStore } = useRenderStore();

  // Fetch city data when the dialog is opened
  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const response = await $api.get(`/cities/${data.id}`);
        const city = response.data;
        setName(city.name);
        setSize(city.size);
      } catch (error) {
        console.error("Failed to fetch city data", error);
      }
    };

    if (open && data.id) fetchCityData();
  }, [open, data.id]);

  const handleOpen = () => setOpen(!open);

  const handleSubmit = async () => {
    const options = {
      name,
      size,
    };

    // Simple client-side validation
    const newErrors = {};
    if (!name) newErrors.name = "City name is required";
    if (!size) newErrors.size = "City size is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await $api.patch(`/cities/update/${data.id}`, options);
      if (response.status === 200) {
        setOpen(false);
        sweetAlert("City updated successfully", "success");
        cityRenderStore();
      } else {
        sweetAlert("Failed to update city", "error");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error updating city";
      sweetAlert(errorMessage, "error");
      setOpen(false);
    }
  };

  return (
    <>
      <IconButton onClick={handleOpen} variant="button">
        <FaPencilAlt className="text-[17px]" />
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
        <DialogHeader>Update City</DialogHeader>
        <DialogBody className="space-y-4">
          <Input
            label="City Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            success={!errors.name && name}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <Select
            label="City Size"
            value={size}
            onChange={(e) => setSize(e)}
            error={!!errors.size}
          >
            <Option value="SMALL">SMALL</Option>
            <Option value="MEDIUM">MEDIUM</Option>
            <Option value="BIG">BIG</Option>
          </Select>
          {errors.size && <p className="text-red-500 text-sm">{errors.size}</p>}
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
          <Button variant="gradient" color="green" onClick={handleSubmit}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
