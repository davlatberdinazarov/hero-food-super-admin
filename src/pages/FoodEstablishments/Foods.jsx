import React from 'react'
import FoodsTable from '../../components/foods/foods-table'
import AddFoods from '../../components/foods/add-foods'

export default function Foods() {
  return (
    <div>
      <header className=' flex items-center justify-between my-3'>
        <h1 className='text-black font-bold text-2xl'>Foods</h1>
        <AddFoods/>
      </header>

      <div>
        <FoodsTable/>
      </div>
    </div>
  )
}