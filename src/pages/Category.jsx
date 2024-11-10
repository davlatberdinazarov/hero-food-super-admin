import React, { useEffect, useState } from "react";
import $api from "../utils/api";
import { useRenderStore } from "../stores/rendersStore";
import Loader from "../lib/Loader";
import { AddCategoryDialog } from "../components/category/add-category-dialog";
import { DeleteCategoryDialog } from "../components/category/delete-category-dialog";
import { EditCategoryDialog } from "../components/category/edit-category-dialog";
import { BASE_URL } from "../utils";

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <AddCategoryDialog />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="col-span-1 p-4 bg-white shadow-lg rounded-lg flex flex-col items-center space-y-3"
          >
            {/* Category Image */}
            {category.image ? (
              <img
                src={`${BASE_URL}/uploads/${category.image}`} // adjust the path as needed
                alt={category.name}
                className="w-full h-48 object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                No Image Available
              </div>
            )}

            {/* Category Name and Luxury Rate */}
            <div className="text-center">
              <h2 className="text-lg font-semibold">{category.name}</h2>
              <span
                className={`inline-block px-3 py-1 mt-2 rounded-full text-white ${getLuxuryRateColor(
                  category.luxuryRate
                )}`}
              >
                Luxury Rate: {category.luxuryRate}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-3 mt-3">
              <DeleteCategoryDialog id={category.id} />
              <EditCategoryDialog data={category} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
