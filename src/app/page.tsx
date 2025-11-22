import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import WhyChooseUs from '@/components/WhyChooseUs'
import FavoriteCakes from '@/components/FavoriteCakes'
import DiscountBanner from '@/components/DiscountBanner'
import FAQ from '@/components/FAQ'
import Testimonials from '@/components/Testimonials'
import FinalCTA from '@/components/FinalCTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <WhyChooseUs />
      <FavoriteCakes />
      <DiscountBanner />
      <FAQ />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  )
}
