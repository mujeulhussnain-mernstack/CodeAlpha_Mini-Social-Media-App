import React from 'react'
import Sidebar from "./Sidebar"
import { Outlet } from 'react-router-dom'
const MainLayout = () => {
  return (
    <div>
      <Sidebar/>
      <div>
        <Outlet/>
      </div>
    </div>
  )
}

export default MainLayout