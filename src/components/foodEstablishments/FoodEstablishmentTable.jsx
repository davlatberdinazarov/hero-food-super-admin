import React, { useEffect, useState } from "react";
import CustomDataTable from "../../lib/CustomDataTable";
import Loader from "../../lib/Loader";
import {
  Select,
  Option,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import $api from "../../utils/api";
import { BASE_URL } from "../../utils";
import { GrMore } from "react-icons/gr";
import useEstablishmentsStore from "../../stores/establishmentsStore";

function FoodEstablishmentTable() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [establishments, setEstablishments] = useState([]);
  const [regionId, setRegionId] = useState(null);
  const [cityId, setCityId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);

  const {
    regions,
    cities,
    categories,
    loading,
    setLoading,
    fetchRegions,
    fetchCategories,
    fetchCities,
    clearCities,
  } = useEstablishmentsStore();

  const fetchData = () => {
    setLoading(true);
    $api
      .get(`/food-establishments/all`, {
        params: { cityId, categoryId },
      })
      .then((res) => {
        setEstablishments(res.data);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [cityId, categoryId, page, perPage]);

  useEffect(() => {
    fetchRegions();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (regionId) {
      fetchCities(regionId);
    } else {
      clearCities();
    }
  }, [regionId]);

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, width: "70px" },
    { name: "Nomi", selector: (row) => row.title, sortable: true },
    {
      name: "Banner",
      selector: (row) => (
        <div className="w-28 h-12">
          <img
            className="w-full h-full object-cover rounded shadow-md"
            src={row.banner ? `${BASE_URL}${row.banner}` : ""}
            alt="banner"
          />
        </div>
      ),
      sortable: true,
      width: "150px",
    },
    { name: "Manzil", selector: (row) => row.address, sortable: true },
    { name: "Telefon", selector: (row) => row.phoneNumber, sortable: true },
    { name: "Ish vaqti", selector: (row) => row.workingTime, sortable: true },
    { name: "Shahar", selector: (row) => row.city?.name, sortable: true },
    {
      name: "Kategoriya",
      selector: (row) =>
        `${row.category?.name} (${row.category?.luxuryRate}⭐)`,
      sortable: true,
      width: "150px",
    },
    {
      name: "Actions",
      selector: (row) => (
        <div className="flex gap-2">
          <Menu placement="left-start">
            <MenuHandler>
              <IconButton variant="outlined">
                <GrMore className="text-lg" />
              </IconButton>
            </MenuHandler>
            <MenuList>
              <MenuItem>Menu Item 1</MenuItem>
              <MenuItem>Menu Item 2</MenuItem>
              <MenuItem>Menu Item 3</MenuItem>
            </MenuList>
          </Menu>
        </div>
      ),
      sortable: false,
      width: "130px",
    },
  ];

  if (loading) return <Loader loading={loading} />;

  return (
    <div>
      <h2 className="my-2">Tanlang Region | Shahar | Kategoriya</h2>
      <form className="mb-4 flex gap-4 bg-white p-3 shadow-sm">
        <Select label="Region" onChange={(e) => setRegionId(e)}>
          {regions.map((region) => (
            <Option key={region.id} value={region.id}>
              {region.name}
            </Option>
          ))}
        </Select>
        <Select
          label="City"
          onChange={(e) => setCityId(e)}
          disabled={!regionId}
        >
          {cities.map((city) => (
            <Option key={city.id} value={city.id}>
              {city.name}
            </Option>
          ))}
        </Select>
        <Select label="Category" onChange={(e) => setCategoryId(e)}>
          {categories.map((category) => (
            <Option key={category.id} value={category.id}>
              {category.name}
            </Option>
          ))}
        </Select>
      </form>
      <CustomDataTable
        columns={columns}
        data={establishments}
        page={page}
        perPage={perPage}
        setPage={setPage}
        setPerPage={setPerPage}
      />
    </div>
  );
}

export default FoodEstablishmentTable;
