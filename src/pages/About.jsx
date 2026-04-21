export default function About() {
  return (
    <div className="min-h-screen bg-surface">
      <main className="pt-12 pb-24 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto">
        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-32">
          <div className="lg:col-span-7 space-y-8">
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl text-primary leading-tight tracking-wide">
              The Digital Archivist: Preserving the Past, Empowering the Future.
            </h1>
            <p className="font-body text-lg text-on-surface-variant leading-relaxed max-w-2xl">
              Established in 1877 as the Lytton Library, the Maulana Azad Library stands as a monumental
              testament to academic pursuit and cultural preservation at Aligarh Muslim University. We are a
              sanctuary for over 1.5 million scholarly treasures.
            </p>
            <div className="pt-4">
              <button className="bg-surface-container-high text-tertiary font-body text-sm font-semibold py-3 px-8 rounded-full shadow-ambient hover:bg-surface-variant transition-all duration-300">
                Explore Our History
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="aspect-[3/4] w-full arch-mask relative overflow-hidden bg-surface-container-highest shadow-[0_20px_40px_-15px_rgba(27,28,26,0.06)]">
              <img
                alt="Interior of historic library with arched ceilings"
                className="object-cover w-full h-full"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqs9pPRo1UBPQ_9mkU178lIQPVXWAU_eOnekOG-LDs-hqtB1FXgTRmyKuHT7zTmgtG1z2P_Z8E7qHN90UwTMtSNxS2hLM7OwUlHeUShzB-QSr4WNDNOp5ZH628VL0tPzvSA38eZwE2YAS3YHGCCvxIDHwJz5auLqpOQimBbzfeYHnv6uosOjq1rM-KvX_I54tBmvF5tkdMoGXE2KDyqnq9H7E41QJ_I246yHyc3TWmIm22bamUXjLeFSmjulAkRoTdGHV09C557ik"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-fixed-dim rounded-full mix-blend-multiply opacity-20 blur-2xl pointer-events-none"></div>
          </div>
        </section>

        {/* Stats Bento */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
          <div className="bg-surface-container-low rounded-lg p-10 flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-500 shadow-ambient border border-outline-variant/15">
            <div className="mb-12">
              <span className="material-symbols-outlined text-primary text-4xl mb-6 block">library_books</span>
              <h3 className="font-headline text-2xl text-on-surface mb-3">Vast Collections</h3>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                Housing over 1.5 million items, our repository serves as a critical nexus for research across diverse academic disciplines.
              </p>
            </div>
            <div className="border-t border-outline-variant/15 pt-6 mt-auto">
              <p className="font-headline text-4xl text-primary mb-1">1.5M+</p>
              <p className="font-body text-xs text-on-surface-variant uppercase tracking-widest">Total Volumes</p>
            </div>
          </div>

          <div className="rounded-lg p-10 flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-500 shadow-ambient hero-gradient relative overflow-hidden">
            <div className="relative z-10 mb-12">
              <span className="material-symbols-outlined text-tertiary-fixed text-4xl mb-6 block">menu_book</span>
              <h3 className="font-headline text-2xl text-on-primary mb-3">Rare Manuscripts</h3>
              <p className="font-body text-sm text-primary-fixed-dim leading-relaxed">
                A globally significant archive of unique manuscripts, documenting centuries of intellectual and cultural history.
              </p>
            </div>
            <div className="relative z-10 border-t border-primary-container pt-6 mt-auto">
              <p className="font-headline text-4xl text-tertiary-fixed mb-1">16,000+</p>
              <p className="font-body text-xs text-primary-fixed uppercase tracking-widest">Preserved Texts</p>
            </div>
          </div>

          <div className="bg-surface-container-highest rounded-lg overflow-hidden group hover:scale-[1.02] transition-transform duration-500 flex flex-col shadow-ambient border border-outline-variant/15">
            <div className="h-48 overflow-hidden relative">
              <img
                alt="Library building exterior"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDalB9Vo73taGkpoAlChi61gUYnvLo1k3CQHKEDT5PHjiZicokG-qOOoJOTEp49ZaNv2gNG0ApNkLPP3Pgu2yJAnehVhXFW3wsXgDl8N8B8hxu66zHAZiw_tmsI0OB8yLwfzME4388F_Gh2HKpFeoRl1yLPwt1DHIunkzfg_Q_WrnOHnIZOJv510ClWgbmaatCMzkSyzTqBwAzJ0eFevY7PCDt5BFtO0bjpQAXDJs51zs6T8Wt0gE1-RL0PefKxzzpU8s-SyqxoqvM"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-highest to-transparent"></div>
            </div>
            <div className="p-8 flex-grow flex flex-col justify-end">
              <h3 className="font-headline text-2xl text-on-surface mb-3 mt-4">Modernist-Islamic Architecture</h3>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                Our seven-story structure, inaugurated in 1960, is a masterful blend of modernist functionality and subtle Islamic architectural motifs.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="max-w-4xl mx-auto bg-surface-container-low rounded-xl p-12 md:p-20 shadow-ambient border border-outline-variant/15 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-96 h-96 border-4 border-outline-variant/10 rounded-full opacity-50 pointer-events-none"></div>
          <div className="relative z-10 text-center">
            <span className="material-symbols-outlined text-tertiary text-5xl mb-6 block">account_balance</span>
            <h2 className="font-headline text-3xl md:text-4xl text-primary mb-8 tracking-wide">Our Enduring Mission</h2>
            <div className="space-y-6 text-on-surface-variant font-body text-base md:text-lg leading-relaxed">
              <p>
                The Maulana Azad Library is dedicated to supporting the unparalleled academic excellence of Aligarh Muslim University. We serve as the intellectual heart of the campus, providing comprehensive access to global knowledge resources.
              </p>
              <p>
                Beyond academic support, we hold a sacred duty to preserve and curate cultural heritage. Through meticulous conservation and advanced digitization, we ensure that the profound voices of the past remain accessible to inspire the innovations of tomorrow.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
