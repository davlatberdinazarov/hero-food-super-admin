import React, { useEffect, useState } from "react";
import $api from "../utils/api"; // API utilingizni moslashtiring
import Loader from "../lib/Loader";
import { BASE_URL } from "../utils";
import { Button } from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import { useRenderStore } from "../stores/rendersStore";
import AddDetailDialog from "../components/detail/add-detail";
import { DeleteDetail } from "../components/detail/delete-detail";
import { UpdateDetailDialog } from "../components/detail/update-detail";

export default function EstablishmentDetail() {
  const [establishments, setEstablishments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { foodEsId } = useParams();
  const { detailRender } = useRenderStore()

  useEffect(() => {
    const fetchEstablishments = async () => {
      try {
        const response = await $api.get(
          `/establishment-detail/by-food-establishment/${foodEsId}`
        );
        if (response.status >= 200 && response.status < 300) {
          setEstablishments(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch establishments", error);
        setLoading(false);
      }
    };

    fetchEstablishments();
  }, [detailRender]);

  // if (loading) {
  //   return <Loader loading={loading} />;
  // }

  return (
    <div className="p-4">
      <div className=" flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-6">Establishments Gallary</h1>
        <AddDetailDialog/>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        { loading ? <Loader /> : null}
        {establishments.map((establishment) => (
          <div
            key={establishment.id}
            className="col-span-1 p-4 bg-white shadow-lg rounded-lg flex flex-col items-center space-y-3"
          >
            {/* Establishment Image */}
            {establishment.image ? (
              <img
                src={`${BASE_URL}/${establishment.image}`} // Rasm yo‘li to‘g‘ri keladigan qilib o‘zgartiring
                alt={establishment.name}
                className="w-full h-48 object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                No Image Available
              </div>
            )}

            {/* Establishment Details */}
            <div className="text-center">
              <h2 className="text-lg font-semibold">{establishment.name}</h2>
              <p>
                <strong>Owner:</strong>{" "}
                {establishment.foodEstablishment.ownerFullName}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {establishment.foodEstablishment.address}
              </p>
              <div className=" mt-3 flex gap-3 justify-between">
                <UpdateDetailDialog detail={establishment} />
                <DeleteDetail id={establishment.id} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-3 mt-3">
              {/* Bu joyga Delete va Edit uchun dialoglar qo‘shishingiz mumkin */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
