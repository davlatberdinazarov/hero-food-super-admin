import React, { useEffect, useState } from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter } from '@material-tailwind/react';
import { $axios } from '../utils';
import $api from '../utils/api';

export default function MainPage() {
  const [foodEs, setFoodEs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoodEs = async () => {
      try {
        const response = await $axios.get('/food-establishments/all');
        if (response.status === 200) {
          setFoodEs(response.data);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    }

    const getUsers = async () => {
      try {
        const response = await $api.get('/users/all')
        if (response.status === 200) {
          setUsers(response.data);
          setLoading1(false);
        }
      } catch (error) {
        setLoading1(false);
        setError(error);
      }
    };
    getUsers();
    fetchFoodEs();
  }, [])

  return (
    <div className="flex h-full">

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-semibold">Welcome, Admin</h1>
          <p className="text-gray-600">Manage your restaurants and orders effectively.</p>
        </header>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white p-4 shadow-lg">
            <CardBody>
              <h2 className="text-xl font-semibold mb-2">Umumiy ovqatlanish maskanlari</h2>
              <p className="text-3xl font-bold">{ loading ? 'loading...' : foodEs.length }</p>
            </CardBody>
          </Card>
          <Card className="bg-white p-4 shadow-lg">
            <CardBody>
              <h2 className="text-xl font-semibold mb-2">Total Customers</h2>
              <p className="text-3xl font-bold">{ loading1 ? 'loadng...' : users.length }</p>
            </CardBody>
          </Card>
         
        </section>
      </main>
    </div>
  );
}
