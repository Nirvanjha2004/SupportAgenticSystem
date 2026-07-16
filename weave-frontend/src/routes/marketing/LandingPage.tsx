import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Navbar from '../../components/marketing/Navbar'
import Hero from '../../components/marketing/Hero'
import FeatureGrid from '../../components/marketing/FeatureGrid'
import Integrations from '../../components/marketing/Integrations'
import SocialProof from '../../components/marketing/SocialProof'
import ProductShowcase from '../../components/marketing/ProductShowcase'
import HowItWorks from '../../components/marketing/HowItWorks'
import AICapabilities from '../../components/marketing/AICapabilities'
import Stats from '../../components/marketing/Stats'
import CTA from '../../components/marketing/CTA'
import Footer from '../../components/marketing/Footer'

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-[#5E6B3F]"
      style={{ scaleY, opacity: scrollYProgress }}
    />
  )
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative min-h-screen bg-[#F5F1E8]">
      {/* Scroll progress bar */}
      {mounted && <ScrollProgress />}

      <Navbar />

      <main>
        <Hero />
        <SocialProof />
        <FeatureGrid />
        <ProductShowcase />
        <HowItWorks />
        <AICapabilities />
        <Integrations />
        <Stats />
        <CTA />
      </main>

      <Footer />
    </div>
  )
}
