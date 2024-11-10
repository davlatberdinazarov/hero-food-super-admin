import React, { useEffect, useState } from "react";
import { Card, CardBody, Input, Button } from "@material-tailwind/react";
import { PatternFormat } from "react-number-format";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { $axios } from "../utils";
import $api from "../utils/api";
import { sweetAlert } from "../utils/sweetalert";
import { BeatLoader } from "react-spinners";

export default function Login() {
  const [isEyeOff, setIsEyeOff] = useState(true);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("white");
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await $api.get("/profile");
      console.log(res);
      if (res.status === 200) {
        const { role } = res.data;
        if (role === "superAdmin") {
          navigate("/");
          sweetAlert("Admin panelga xush kelibsiz", "success");
        } else {
          handleUnauthorizedAccess();
        }
      }
    } catch (error) {
      console.error("Profilni olishda xatolik:", error);
    }
  };

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleUnauthorizedAccess = () => {
    sweetAlert("Sizda kirish huquqi yo'q", "error");
    handleLogOut();
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const options = {
      phone: "+" + phone.replace(/\D/g, ""),
      password,
    };
    setLoading(true);
    try {
      const response = await $axios.post("/auth/login", options);
      console.log(response);
      if (response.status === 201) {
        localStorage.setItem("access_token", response.data.access_token);
        fetchProfile();
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 bg-white shadow-md">
        <CardBody>
          <form className="max-w-[350px] mx-auto mt-12" onSubmit={handleLogin}>
            <h1 className="text-center text-3xl font-bold">Kirish</h1>

            <div className="my-3">
              <label className="normal-case font-semibold" htmlFor="phone">
                Telefon
              </label>
              <div className="relative w-full bg-white">
                <div className="absolute grid w-8 h-8 place-items-center normal-case top-2/4 right-6 -translate-y-2/4 z-40">
                  <MdOutlinePhoneAndroid className="text-xl text-gray-600" />
                </div>
                <PatternFormat
                  customInput={Input}
                  id="phone"
                  format="+998 ## ### ## ##"
                  required
                  autoComplete="off"
                  allowEmptyFormatting
                  onChange={(e) => setPhone(e.target.value)}
                  valueIsNumericString={true}
                  className={`${
                    error
                      ? "!border-red-600 text-red-600"
                      : "!border-gray-300 text-gray-600"
                  } text-[16px] rounded !border bg-white shadow-sm shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-gray-900/10`}
                  labelProps={{ className: "hidden" }}
                  containerProps={{
                    className: "min-w-[300px] my-2 h-[50px] !rounded",
                  }}
                />
              </div>
              {error && <h2 className="text-red-600">{error}</h2>}
            </div>

            <div className="w-full">
              <label className="normal-case font-semibold" htmlFor="password">
                Parol
              </label>
              <div className="relative w-full bg-white">
                <div
                  onClick={() => setIsEyeOff((prev) => !prev)}
                  className="absolute grid w-8 h-8 place-items-center normal-case top-2/4 right-6 -translate-y-2/4 z-40"
                >
                  {isEyeOff ? (
                    <IoEye className="text-xl text-gray-600" />
                  ) : (
                    <IoEyeOff className="text-xl text-gray-600" />
                  )}
                </div>
                <Input
                  className={`${
                    error
                      ? "!border-red-600 text-red-600"
                      : "!border-gray-300 text-gray-600"
                  } text-[16px] rounded !border bg-white shadow-sm shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-gray-900/10`}
                  id="password"
                  type={isEyeOff ? "password" : "text"}
                  placeholder="Parol"
                  onChange={(e) => setPassword(e.target.value)}
                  labelProps={{ className: "hidden" }}
                  containerProps={{
                    className: "min-w-[300px] w-full my-2 h-[50px]",
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col z-10">
              <Button
                type="submit"
                className="bg-primary h-[50px] rounded-full py-3 active:text-deep-orange-50 capitalize text-md"
              >
                {loading ? (
                  <BeatLoader
                    color={color}
                    loading={loading}
                    size={10}
                    aria-label="Loading Spinner"
                  />
                ) : (
                  "Kirish"
                )}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
