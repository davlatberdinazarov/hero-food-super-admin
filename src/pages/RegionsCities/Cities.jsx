import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { $axios } from '../../utils';
import Loader from '../../lib/Loader';
import { AddCityDialog } from '../../components/city-region/add-city-dialog';
import { useRenderStore } from '../../stores/rendersStore';

export default function Cities() {
  const { regionId } = useParams();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  const { cityRender, cityRenderStore } = useRenderStore();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await $axios.get(`/cities/region/${regionId}`);
        setCities(response.data);
      } catch (error) {
        console.error('Error fetching cities:', error);
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
      <div className=' flex justify-between items-center'>
        <h2 className="text-2xl font-semibold mb-4">Cities in Region {regionId}</h2>
        <AddCityDialog/>
      </div>
      <ul className="grid grid-cols-3 gap-2">
        {cities.map(city => (
          <li key={city.id} className="p-4 col-span-1 bg-blue-200 rounded-lg shadow-md">
            <p className="text-lg font-medium">{city.name}</p>
            <p className="text-sm text-gray-600">Size: {city.size}</p>
            <p className="text-sm text-gray-600">Region: {city.region.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
