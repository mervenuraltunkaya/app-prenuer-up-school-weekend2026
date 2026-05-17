export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-ink px-8 py-14 sm:py-16">
      <div className="nomad-hero-grid"></div>
      <div className="hero-cross"></div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="font-dm-mono text-xs tracking-widest text-sand">
          Kültürel Miras Takip Paneli · 2026
        </p>
        <h1 className="font-heading mt-3 text-4xl font-semibold leading-tight text-cream sm:text-5xl">
          Tarihi yapıları <em className="text-crimson not-italic">birlikte</em> koruyoruz
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-cream/60 sm:text-base">
          Vatandaş raporları ve yapay zeka analizi ile Türkiye&apos;nin kültürel mirasını anlık takip edin.
        </p>
      </div>
    </section>
  )
}
