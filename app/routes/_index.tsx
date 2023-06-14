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
      <HeroSection />
      <BenefitsSection />
      <AboutSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </ >
  )
}

export default HomePage