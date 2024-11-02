import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomDataTable from "../../lib/CustomDataTable";
import Loader from "../../lib/Loader";
import $api from "../../utils/api";
import { BASE_URL } from "../../utils";
import { useRenderStore } from "../../stores/rendersStore";
import { IconButton } from "@material-tailwind/react";
import SeeMoreFoods from "./see-more-foods";
import { DeleteFood } from "./delete-foods";
import EditFood from "./edit-foods";

function FoodsTable() {
  const { menuId } = useParams(); // URL’dan menuId ni olish
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { foodsRender } = useRenderStore();

  // Ma'lumotlarni olish uchun fetchData funksiyasi
  const fetchData = () => {
    setLoading(true);
    $api
      .get(`/foods/by-category/${menuId}`, { params: { page, perPage } })
      .then((res) => {
        setFoods(res.data);
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
  }, [menuId, page, perPage, foodsRender]);

  // Jadval ustunlarini belgilash
  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, width: "70px" },
    { name: "Nomi", selector: (row) => row.name, sortable: true },
    {
      name: "Banner",
      selector: (row) => (
        <div className="w-28 h-12">
          <img
            className="w-full h-full object-cover rounded shadow-md"
            src={
              row.banner
                ? `${BASE_URL}/${row.banner}`
                : `${BASE_URL}/default-banner.jpg`
            }
            alt={`${row.name} banner`}
          />
        </div>
      ),
      sortable: false,
      width: "150px",
    },
    {
      name: "Narxi",
      selector: (row) => `${row.price} UZS`,
      sortable: true,
      width: "100px"    ,
    },
    {
      name: "Tavsif",
      selector: (row) => row.description || "-",
      sortable: true,
    },
    {
      name: "Ingredientlar",
      selector: (row) => row.ingredients || "-",
      sortable: true,
    },
    {
      name: "Tashkilot",
      selector: (row) => (
        <div>
          <p>{row.foodEstablishment?.title || "-"}</p>
          <p>{row.foodEstablishment?.address || "-"}</p>
          <p>{row.foodEstablishment?.phoneNumber || "-"}</p>
        </div>
      ),
      sortable: false,
      width: "200px",
    },
    {
        name: "Actions",
        selector: (row) => (
          <div className="flex gap-2">
            <IconButton aria-label="Ko'proq ma'lumot" variant="outlined">
            <SeeMoreFoods data={row} />
            </IconButton>
            <IconButton aria-label="Tahrirlash" variant="outlined">
              <EditFood data={row} />
            </IconButton>
            <IconButton aria-label="O'chirish" variant="outlined">
              <DeleteFood id={row.id}/>
            </IconButton>
          </div>
        ),
        width: "170px",
      },
  ];

  if (loading) return <Loader loading={loading} />;

  return (
    <div>
      <h2 className="my-2">Tanlang: Taom Kategoriya {menuId}</h2>
      <div className="overflow-x-auto">
        <div className=" overflow-auto">
          <CustomDataTable
            columns={columns}
            data={foods}
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

export default FoodsTable;
