import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import CategoryCards from "../components/home/CategoryCards";
import NewArrivals from "../components/home/NewArrivals";
import ProductSpotlight from "../components/home/ProductSpotlight";
import VideoReels from "../components/home/VideoReels";
import CustomDesign from "../components/home/CustomDesign";
import BrandStory from "../components/home/BrandStory";
import EditorialJournal from "../components/home/EditorialJournal";
import InstagramGrid from "../components/home/InstagramGrid";
import Footer from "../components/layout/Footer";
import CartDrawer from "../components/cart/CartDrawer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Section 1: Hero Editorial Gallery */}
        <Hero />

        {/* Section 2: Shop by Category */}
        <CategoryCards />

        {/* Section 3: New Arrivals */}
        <NewArrivals />

        {/* Section 5: Featured Product Spotlight */}
        <ProductSpotlight />

        {/* Section 5.5: Stories in Motion (Video Reels) */}
        <VideoReels />

        {/* Section 5.7: Customize Favorite Design Form */}
        <CustomDesign />

        {/* Section 6: Brand Story */}
        <BrandStory />

        {/* Section 6.5: Editorial Craft Chronicles */}
        <EditorialJournal />

        {/* Section 7: Instagram Gallery */}
        <InstagramGrid />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
