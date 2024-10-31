import React, { useEffect, useState } from "react";
import { $axios } from "../../utils";
import { Card, List, ListItem } from "@material-tailwind/react";
import Loader from "../../lib/Loader";
import { Link } from "react-router-dom";

export default function Regionregions() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await $axios.get("/regions/get");
        if (response.status === 200) {
          setLoading(false);
          setRegions(response.data); // Assuming response.data contains the array of regions
        }
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };

    fetchRegions();
  }, []);

  if (loading) {
    return <Loader loading={loading} />;
  }

  return (
    <Card>
      <h2 className="text-2xl font-semibold mb-4">regions</h2>
      <List className="grid grid-cols-3 gap-2">
        {regions.map((region) => (
          <Link to={`${region.id}`}>
            <ListItem
              key={region.id}
              className="p-4 col-span-1 bg-blue-200 rounded-lg shadow-md"
            >
              {region.name}
            </ListItem>
          </Link>
        ))}
      </List>
    </Card>
  );
}
