import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/home/Hero";
import ImpactCounter from "@/components/home/ImpactCounter";
import StorySection from "@/components/home/StorySection";
import Testimonials from "@/components/home/Testimonials";
import RewardsFloatingButton from "@/components/RewardsFloatingButton";
import EcoKeywordsCarousel from "@/components/home/EcoKeywordsCarousel";
import VideoTestimonials from "@/components/home/VideoTestimonials";
import ShopifyProducts from "@/components/home/ShopifyProducts";
import FeaturedShopifyCollections from "@/components/home/FeaturedShopifyCollections";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <RewardsFloatingButton />
      <main>
        <Hero />
        <EcoKeywordsCarousel />
        <ShopifyProducts />
        <FeaturedShopifyCollections />
        <ImpactCounter />
        <StorySection />
        <Testimonials />
        <VideoTestimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
