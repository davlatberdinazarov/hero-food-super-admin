import React, { useEffect, useState } from "react";
import CustomDataTable from "../../lib/CustomDataTable";
import Loader from "../../lib/Loader";
import $api from "../../utils/api";
import { useRenderStore } from "../../stores/rendersStore";
import { Link, useParams } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { AddMenuCategoryDialog } from "../../components/men_category/add-menucategory";
import { EditMenuCategoryDialog } from "../../components/men_category/edit-menucategory";
import { DeleteMenuCategoryDialog } from "../../components/men_category/delete-menycategory";

function MenuCategoryTable() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [menuCategories, setMenuCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { menuCategoryRender } = useRenderStore();

  const { foodEsId } = useParams();

  // Fetch menu categories
  const fetchData = () => {
    setLoading(true);
    $api
      .get(`/menu-categories/by-establishment/${foodEsId}`) // Replace '16' with the dynamic establishment ID if needed
      .then((res) => {
        setMenuCategories(res.data);
      })
      .catch((error) => {
        console.error("Failed to fetch menu categories:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [menuCategoryRender]);

  // Define columns for the table
  const columns = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    {
      name: "Description",
      selector: (row) => row.description || "N/A",
      sortable: true,
    },
    {
      name: "Food Establishment",
      selector: (row) => row.foodEstablishment?.title || "N/A",
      sortable: true,
    },
    {
      name: "Foods",
      selector: (row) => (
        <div>
          <Link className=" underline" to={`${row.id}/foods`}>
            foods
          </Link>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => (
        <div className="flex items-center gap-2">
          <EditMenuCategoryDialog data={row}/>
          <DeleteMenuCategoryDialog id={row.id}/>
        </div>
      ),
      sortable: false,
      width: '130px'
    }
  ];

  if (loading) return <Loader loading={loading} />;

  return (
    <div className="overflow-x-auto">
      <div className="my-4 flex justify-between items-center">
        <h2 className=" text-black font-bold text-xl">Meny Category</h2>

        <AddMenuCategoryDialog/>
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        <CustomDataTable
          columns={columns}
          data={menuCategories}
          page={page}
          perPage={perPage}
          setPage={setPage}
          setPerPage={setPerPage}
        />
      </div>
    </div>
  );
}

export default MenuCategoryTable;
