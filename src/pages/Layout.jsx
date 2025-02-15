import React from 'react'
import { Outlet } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

const Layout = () => {
  return (
    <>
        <Navigation/>
        <main className='overflow-x-hidden'>
        <Outlet/>
        </main>
        <Footer/>
    </>
  )
}

export default Layout