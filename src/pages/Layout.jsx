import React from 'react'
import { Outlet } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

const Layout = () => {
  return (
    <> 
    <SpeedInsights/>
    <Analytics/>
        <Navigation/>
        <main className='overflow-x-hidden'>
        <Outlet/>
        </main>
        <Footer/>
    </>
  )
}

export default Layout