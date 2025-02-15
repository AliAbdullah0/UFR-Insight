import React from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import UfrCalculator from '../components/Calculator'
import About from '../components/About'

const Home = () => {
  return (
     <>
      <main className='w-full'>
        <Hero/>
        <Features/>
        <UfrCalculator/>
        <About/>
      </main>
     </>

  )
}

export default Home