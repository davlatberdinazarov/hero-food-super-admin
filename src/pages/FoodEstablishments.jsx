import { Button } from '@material-tailwind/react'
import React from 'react'
import FoodEstablishmentTable from '../components/foodEstablishments/FoodEstablishmentTable'
import { AddFoodEstablishment } from '../components/foodEstablishments/add-food-establishments'

export default function FoodEstablishments() {
  return (
    <div>
      <header className=' flex items-center justify-between my-3'>
        <h1>Food Establishments</h1>
        <AddFoodEstablishment/>
      </header>

      <div>
        <FoodEstablishmentTable/>
      </div>
    </div>
  )
}
