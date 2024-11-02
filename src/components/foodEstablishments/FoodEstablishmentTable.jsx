import React, { useEffect, useState } from "react";
import CustomDataTable from "../../lib/CustomDataTable";
import Loader from "../../lib/Loader";
import { Select, Option, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import $api from "../../utils/api";
import { BASE_URL } from "../../utils";
import useEstablishmentsStore from "../../stores/establishmentsStore";
import { useRenderStore } from "../../stores/rendersStore";
import SeeMoreDialog from "./see-more-dialog";
import { EditFoodEstablishment } from "./edit-food-establishment";
import { DeleteFoodEstablishment } from "./delete-food-establishment";
import { GrMore } from "react-icons/gr";
import { Link } from "react-router-dom";

function FoodEstablishmentTable() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [establishments, setEstablishments] = useState([]);
  const [regionId, setRegionId] = useState(null);
  const [cityId, setCityId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const { foodEstablishmentRender } = useRenderStore();

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

  // Fetch food establishments data
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
  }, [cityId, categoryId, page, perPage, foodEstablishmentRender]);

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

  // Define columns for the data table
  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, width: "70px" },
    { name: "Nomi", selector: (row) => row.title, sortable: true },
    {
      name: "Banner",
      selector: (row) => (
        <div className="w-28 h-12">
          <img
            className="w-full h-full object-cover rounded shadow-md"
            src={row.banner ? `${BASE_URL}${row.banner}` : `${BASE_URL}/default-banner.jpg`}
            alt={`${row.title} banner`}
          />
        </div>
      ),
      sortable: false,
      width: "150px",
    },
    { name: "Telefon", selector: (row) => row.phoneNumber || "-", sortable: true },
    { name: "Shahar", selector: (row) => row.city?.name || "-", sortable: true },
    {
      name: "Kategoriya",
      selector: (row) => `${row.category?.name || "-"} (${row.category?.luxuryRate || 0}⭐)`,
      sortable: true,
      width: "140px",
    },
    {
      name: "More",
      selector: (row) => (
        <Menu placement="left-start">
          <MenuHandler>
            <IconButton className="bg-blue-300" variant="text" aria-label="Ko'proq">
              <GrMore className="text-xl" />
            </IconButton>
          </MenuHandler>
          <MenuList>
            <MenuItem>
              <Link className=" w-full" to={`${row.id}/menu_category`}>
                Menu Category
              </Link>
            </MenuItem>
            <MenuItem>
              <Link className=" w-full" to={`${row.id}/promotion`}>
                Promotion
              </Link>
            </MenuItem>

            {/* <MenuItem>Menu Item 3</MenuItem> */}
          </MenuList>
        </Menu>
      ),
      width: "90px",
    },
    {
      name: "Actions",
      selector: (row) => (
        <div className="flex gap-2">
          <IconButton aria-label="Ko'proq ma'lumot" variant="outlined">
            <SeeMoreDialog data={row} />
          </IconButton>
          <IconButton aria-label="Tahrirlash" variant="outlined">
            <EditFoodEstablishment data={row} />
          </IconButton>
          <IconButton aria-label="O'chirish" variant="outlined">
            <DeleteFoodEstablishment id={row.id} />
          </IconButton>
        </div>
      ),
      width: "170px",
    },
  ];

  if (loading) return <Loader loading={loading} />;

  return (
    <div>
      <h2 className="my-2">Tanlang: Region | Shahar | Kategoriya</h2>
      <form className="mb-4 flex gap-4 bg-white p-3 shadow-sm rounded">
        <Select label="Region" onChange={(e) => setRegionId(e)}>
          {regions.map((region) => (
            <Option key={region.id} value={region.id}>
              {region.name}
            </Option>
          ))}
        </Select>
        <Select label="Shahar" onChange={(e) => setCityId(e)} disabled={!regionId}>
          {cities.map((city) => (
            <Option key={city.id} value={city.id}>
              {city.name}
            </Option>
          ))}
        </Select>
        <Select label="Kategoriya" onChange={(e) => setCategoryId(e)}>
          {categories.map((category) => (
            <Option key={category.id} value={category.id}>
              {category.name}
            </Option>
          ))}
        </Select>
      </form>

      <div className="overflow-x-auto">
        <div className="max-h-[500px] overflow-y-auto">
          <CustomDataTable
            columns={columns}
            data={establishments}
            page={page}
            perPage={perPage}
            setPage={setPage}
            setPerPage={setPerPage}
          />
        </div>
      </div>
    </div>
  );
}

export default FoodEstablishmentTable;
