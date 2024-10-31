import React, { useEffect, useState } from "react";
import $api from "../utils/api";
import { useRenderStore } from "../stores/rendersStore";
import Loader from "../lib/Loader";
import { AddCategoryDialog } from "../components/category/add-category-dialog";
import { DeleteCategoryDialog } from "../components/category/delete-category-dialog";
import { EditCategoryDialog } from "../components/category/edit-category-dialog";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const { categoryRender } = useRenderStore();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await $api.get("/categories/all");
        if (response.status === 200) {
          setCategories(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, [categoryRender]);

  const getLuxuryRateColor = (luxuryRate) => {
    switch (luxuryRate) {
      case 1:
        return "bg-gray-500";
      case 2:
        return "bg-green-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-orange-500";
      case 5:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return <Loader loading={loading} />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-2xl font-bold mb-4">Categories</h1>
        <AddCategoryDialog />
      </div>
      <div className=" grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex justify-between col-span-1 items-center space-x-4 p-4 bg-white shadow-md rounded-lg"
          >
            <div className="flex gap-4">
              <span className="text-lg font-semibold">{category.name}</span>
              <span
                className={`px-3 py-1 rounded-full text-white ${getLuxuryRateColor(
                  category.luxuryRate
                )}`}
              >
                Luxury Rate: {category.luxuryRate}
              </span>
            </div>

            <div className=" flex gap-2">
              <DeleteCategoryDialog id={category.id} />
              <EditCategoryDialog data={category} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
