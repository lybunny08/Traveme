import HeroSection from '@/components/home/HeroSection';
import SearchBar from '@/components/home/SearchBar';
import RecommendedDestinations from '@/components/home/RecommendedDestinations';
import ElevateSection from '@/components/home/ElevateSection';
import FeaturedStay from '@/components/home/FeaturedStay';
import BlogPreview from '@/components/home/BlogPreview';
import Testimonials from '@/components/home/Testimonials';
import ContactCTA from '@/components/home/ContactCTA';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SearchBar />
      <RecommendedDestinations />
      <ElevateSection />
      <FeaturedStay />
      <BlogPreview />
      <Testimonials />
      <ContactCTA />
    </>
  );
}
