import React from 'react'

import { Bar } from "./bar"
import { Pie } from "./pie"
import { BrushableScatterplotMatrix } from "./matrix"

export const D3 = () => {
  return (
    <div>
      <Bar />
      <Pie />
      <BrushableScatterplotMatrix />
    </div>
  )
}
