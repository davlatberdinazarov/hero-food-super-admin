import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import $api from "../../utils/api";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { BASE_URL } from "../../utils";
import { useRenderStore } from "../../stores/rendersStore";
import { CreatePromotionDialog } from "../../components/promotion/create-promotion";
import { EditPromotionDialog } from "../../components/promotion/edit-promotions";
import { DeletePromotionDialog } from "../../components/promotion/delete-promotion";

export function Promotions() {
  const { foodEsId } = useParams();
  const [promotions, setPromotions] = useState([]);

  const { promotionRender } = useRenderStore();

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await $api.get(
          `/promotions/all?foodEstablishmentId=${foodEsId}`
        );
        if (response.status === 200) {
          setPromotions(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch promotions:", error);
      }
    };

    fetchPromotions();
  }, [foodEsId, promotionRender]);

  return (
    <div>
      <div className="my-3 flex justify-between items-center px-2">
        <h1 className="text-2xl font-bold mb-6">Promotions</h1>
        <CreatePromotionDialog/>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {promotions.map((promotion) => (
          <Card key={promotion.id} className="shadow-lg">
            {promotion.banner && (
              <CardHeader floated={false} className="h-48">
                <img
                  src={`${BASE_URL}/uploads/${promotion.banner}`}
                  alt={promotion.title}
                  className="w-full h-full object-cover"
                />
              </CardHeader>
            )}
            <CardBody className="text-center">
              <Typography variant="h5" className="mb-2">
                {promotion.title}
              </Typography>
              <Typography color="gray" className="text-sm mb-4">
                {promotion.description}
              </Typography>
              <Typography variant="h6" color="green">
                {promotion.discountPercentage}% off
              </Typography>
              <Typography color="blue-gray" className="text-xs">
                Valid from: {new Date(promotion.startDate).toLocaleDateString()}{" "}
                to {new Date(promotion.endDate).toLocaleDateString()}
              </Typography>

              <div className=" flex justify-between my-3">
                <EditPromotionDialog promotion={promotion} />
                <DeletePromotionDialog id={promotion.id} />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
