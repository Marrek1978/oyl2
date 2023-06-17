import React from 'react'
import AboutSection from '~/components/homePage/AboutSection'
import BenefitsSection from '~/components/homePage/BenefitsSection'
import CTASection from '~/components/homePage/SignUpFormExample'
import Footer from '~/components/homePage/FooterSection'
import HeroSection from '~/components/homePage/HeroSection'
import NavBar from '~/components/homePage/NavBar'
import PricingSection from '~/components/homePage/CTASection'

function HomePage() {
  return (
    <>
      <NavBar />
      <div className='mt-8'>
        <HeroSection />
      </div>
      <div className='mt-8'>
        <BenefitsSection />
      </div>
      <div className='mt-8'>
        <AboutSection />
      </div>
      <div className='mt-8'>
        <PricingSection />
      </div>
      <div className='mt-8'><CTASection />
        <Footer />
      </div>
    </ >
  )
}

export default HomePage