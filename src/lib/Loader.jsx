import React from 'react'
import { ScaleLoader } from 'react-spinners'

export default function Loader({ loading }) {
  let color = 'black'

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  return (
    <div className="flex h-80 justify-center items-center">
        <ScaleLoader
          color={color}
          className="text-primary"
          loading={loading}
          cssOverride={override}
          size={60}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
  )
}