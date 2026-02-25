import HeroScrollytelling from "@/components/HeroScrollytelling";
import AnatomySection from "@/components/AnatomySection";
import CollectionScroll from "@/components/collection-section/CollectionScroll";
import HeritageSection from "@/components/HeritageSection";
import SignatureCTA from "@/components/SignatureCTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-ink">
      {/* 
        Phase 1 & 2: The Scrollytelling Hero 
      */}
      <HeroScrollytelling />

      {/* 
        Phase 8: Anatomy of Craftsmanship 
      */}

      <AnatomySection />

      {/* 
        Phase 9: The Collection (Horizontal Carousel) 
      */}
      <CollectionScroll />

      {/* 
        Phase 10: The Heritage / Art of Writing
      */}
      <HeritageSection />

      {/* 
        Phase 11: The Signature (Interactive Engraving CTA)
      */}
      <SignatureCTA />

    </main>
  );
}
