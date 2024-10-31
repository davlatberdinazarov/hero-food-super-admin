import React from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter } from '@material-tailwind/react';

export default function MainPage() {
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
              <h2 className="text-xl font-semibold mb-2">Total Orders</h2>
              <p className="text-3xl font-bold">1,234</p>
            </CardBody>
          </Card>
          <Card className="bg-white p-4 shadow-lg">
            <CardBody>
              <h2 className="text-xl font-semibold mb-2">Total Customers</h2>
              <p className="text-3xl font-bold">567</p>
            </CardBody>
          </Card>
          <Card className="bg-white p-4 shadow-lg">
            <CardBody>
              <h2 className="text-xl font-semibold mb-2">Top Dish</h2>
              <p className="text-lg">Spicy Chicken</p>
            </CardBody>
          </Card>
        </section>

        {/* Restaurants Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Restaurants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example restaurant card */}
            <Card className="bg-white shadow-lg">
              <CardHeader color="blue" className="relative h-56">
                <img src="/restaurant-image.jpg" alt="Restaurant" className="h-full w-full object-cover" />
              </CardHeader>
              <CardBody className="text-center">
                <h2 className="text-lg font-bold">Restaurant Name</h2>
                <p className="text-gray-600">Location: Downtown</p>
              </CardBody>
              <CardFooter divider className="flex items-center justify-between py-3">
                <Button color="blue" size="sm">Edit</Button>
                <Button color="red" size="sm">Delete</Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
