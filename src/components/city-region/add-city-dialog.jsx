import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import $api from "../../utils/api";
import { sweetAlert } from "../../utils/sweetalert";
import { useParams } from "react-router-dom";
import { useRenderStore } from "../../stores/rendersStore";

export function AddCityDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [errors, setErrors] = useState({});
  const { regionId } = useParams();

  // Move the Zustand hook call to the top level of the component
  const { cityRender, cityRenderStore } = useRenderStore();

  const handleOpen = () => setOpen(!open);

  const handleSubmit = async () => {
    const options = {
      name,
      size,
      regionId,
    };

    // Simple client-side validation for empty fields
    const newErrors = {};
    if (!name) newErrors.name = "City name is required";
    if (!size) newErrors.size = "City size is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await $api.post(`/cities/create-city`, options);
      if (response.status === 201) {
        setOpen(false);
        sweetAlert("City added successfully", "success");
        cityRenderStore();  // Now you can call it here without issues
      } else {
        sweetAlert("Failed to add city", "error");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error adding city";
      sweetAlert(errorMessage, "error");
      setOpen(false);
    }
  };

  return (
    <>
      <Button onClick={handleOpen} variant="gradient">
        Add City
      </Button>
      <Dialog
        size="sm"
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>Add New City</DialogHeader>
        <DialogBody className="space-y-4">
          <Input
            label="City Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            success={!errors.name && name}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name}</p>
          )}

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
          {errors.size && (
            <p className="text-red-500 text-sm">{errors.size}</p>
          )}
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
