import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { $axios } from "../../utils";
import Loader from "../../lib/Loader";
import { AddCityDialog } from "../../components/city-region/add-city-dialog";
import { useRenderStore } from "../../stores/rendersStore";
import { IconButton } from "@material-tailwind/react";
import { FaDeleteLeft } from "react-icons/fa6";
import { FaTrashCan } from "react-icons/fa6";
import { FaPencilAlt } from "react-icons/fa";
import { DeleteCityDialog } from "../../components/city-region/delete-city-dialog";
import { EditCityDialog } from "../../components/city-region/edit-city-dialog";

export default function Cities() {
  const { regionId } = useParams();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  const { cityRender } = useRenderStore();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await $axios.get(`/cities/region/${regionId}`);
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [regionId, cityRender]);

  if (loading) {
    return <Loader loading={loading} />;
  }

  return (
    <div>
      <div className=" flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-4">
          Cities in Region {regionId}
        </h2>
        <AddCityDialog />
      </div>
      <ul className="grid grid-cols-3 gap-2">
        {cities.map((city) => (
          <li
            key={city.id}
            className="p-4 mt-3 flex justify-between col-span-1 bg-blue-200 rounded-lg shadow-md"
          >
            <div>
              <p className="text-lg font-medium">{city.name}</p>
              <p className="text-sm text-gray-800">Size: {city.size}</p>
              <p className="text-sm text-gray-800">
                Region: {city.region.name}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <DeleteCityDialog id={city.id}/>
              <EditCityDialog data={city}/>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
