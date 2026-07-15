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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <Hero />
      <SocialProof />
      <FeatureGrid />
      <ProductShowcase />
      <HowItWorks />
      <AICapabilities />
      <Integrations />
      <Stats />
      <CTA />
      <Footer />
    </div>
  )
}