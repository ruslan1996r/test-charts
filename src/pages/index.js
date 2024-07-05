import { Routes, Route, useNavigate } from "react-router-dom";

import { Chart } from "./chart"
import { D3 } from "./d3"

import React from 'react'

const Home = () => {
  return (
    <div>
      Home
    </div>
  )
}

const Navbar = () => {
  const navigate = useNavigate()

  return (
    <div style={{ margin: '20px 0' }}>
      <button style={{ marginRight: '20px' }} onClick={() => navigate("/")}>Home</button>
      <button style={{ marginRight: '20px' }} onClick={() => navigate("/chart")}>Chart</button>
      <button style={{ marginRight: '20px' }} onClick={() => navigate("/d3")}>D3</button>
    </div>
  )


}

export const App = () => {
  return (
    <div style={{ margin: '20px' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chart" element={<Chart />} />
        <Route path="/d3" element={<D3 />} />
      </Routes>
    </div>
  )
}
