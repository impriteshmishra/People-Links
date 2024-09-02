import React from 'react'
import { Outlet } from 'react-router-dom'
import Leftsidebar from './Leftsidebar'

function MainLayout() {
  return (
    <div>
      <Leftsidebar/>
      <Outlet/>   {/*remember that the Outlet is use to render the children of MainLayout*/}
    </div>
  )
}

export default MainLayout
