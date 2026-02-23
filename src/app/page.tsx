import HeroScrollytelling from "@/components/HeroScrollytelling";

export default function Home() {
  return (
    <main className="min-h-screen bg-ink">
      <HeroScrollytelling />

      {/* Spacer section to scroll past the pinned hero and show standard content */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-ink text-center px-4 py-24">
        <h2 className="font-serif text-4xl md:text-6xl text-gold-light mb-8">
          The Collection
        </h2>
        <p className="font-sans text-lg text-foreground/70 max-w-2xl mb-12">
          Discover our curated selection of writing instruments, designed for the modern visionary who respects the traditions of the past.
        </p>

        <button className="px-8 py-4 bg-transparent border border-gold text-gold hover:bg-gold hover:text-ink transition-colors duration-500 font-sans tracking-widest uppercase text-sm">
          Explore the Archive
        </button>
      </section>
    </main>
  );
}
