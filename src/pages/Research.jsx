import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Research() {
  const [query, setQuery] = useState('');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow pt-12 pb-24 px-6 md:px-12 lg:px-24">
        {/* Hero */}
        <header className="mb-20 text-center max-w-4xl mx-auto">
          <h1 className="font-headline text-5xl md:text-6xl text-primary mb-6 leading-tight tracking-wide">
            Scholarly Pursuits &amp;<br />Digital Archives
          </h1>
          <p className="font-body text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
            Empowering academic discovery through comprehensive digital repositories and specialized librarian support.
          </p>
          {/* Search Bar */}
          <div className="relative max-w-3xl mx-auto bg-surface-container-lowest rounded-full shadow-ambient border border-outline-variant/15 flex items-center p-2 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <span className="material-symbols-outlined text-primary ml-4 opacity-50">search</span>
            <input
              className="w-full bg-transparent border-none text-on-surface font-body text-lg focus:ring-0 px-4 py-3 placeholder-on-surface-variant/50 outline-none"
              placeholder="Search specialized databases, theses, or journals..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="bg-gradient-primary text-on-primary rounded-full px-8 py-3 font-label font-semibold hover:opacity-90 transition-opacity shrink-0">
              Explore
            </button>
          </div>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {/* Digital Resources */}
          <div className="md:col-span-8 bg-surface-container-low rounded-xl p-8 lg:p-12 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500 border border-outline-variant/15 flex flex-col justify-between min-h-[400px]">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-tertiary text-3xl">database</span>
                <h2 className="font-headline text-3xl text-on-surface">Digital Resources</h2>
              </div>
              <p className="font-body text-on-surface-variant text-lg mb-8 max-w-md">
                Access premium academic databases, institutional repositories, and national scholarly networks.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: 'book_4', name: 'Shodhganga', desc: 'Reservoir of Indian Theses' },
                  { icon: 'menu_book', name: 'e-ShodhSindhu', desc: 'Consortium for Higher Education' },
                  { icon: 'account_balance', name: 'Institutional Repository', desc: "AMU's scholarly output" },
                ].map((db) => (
                  <div key={db.name} className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary mt-1">{db.icon}</span>
                    <div>
                      <h3 className="font-headline text-xl text-primary font-bold mb-1">{db.name}</h3>
                      <p className="font-body text-on-surface-variant text-sm">{db.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-1/2 h-full opacity-20 pointer-events-none mix-blend-multiply">
              <img
                alt="Library interior"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuABRrqflFTRH7qji6wdbetUgacwqlFAo3n56PfOGNLXe_SNYgsMx-CHEnE_6XD-NDs-UULfzk2p8mx0myK4j5NFJ1VTg0CGsRR6FB1vJ7-f5ZPCuoSk9hs5uY7tocbO1AKkmY50udX7qhsZsWTnG2ccgHri_1Rqzu3wfVQD5RDyTvsoT9SsZvhVKPAtF68q0Csm9eu7ycVE3ZoB4-K6PV9hCuSghtb4wOHkId3e4tEFTj6EMtWLYVTTzObV6AwxcOGx-Go_nEVfAic"
              />
            </div>
          </div>

          {/* Research Support */}
          <div className="md:col-span-4 bg-surface-container-highest rounded-xl p-8 flex flex-col justify-between relative overflow-hidden group border border-outline-variant/15 hover:shadow-ambient transition-all duration-500 min-h-[400px]">
            <div>
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">smart_toy</span>
              </div>
              <h2 className="font-headline text-2xl text-on-surface mb-4">Research Support</h2>
              <p className="font-body text-on-surface-variant mb-6 leading-relaxed">
                Navigate complex academic inquiries with dedicated tools and expert guidance.
              </p>
            </div>
            <div className="space-y-4">
              <Link to="/student" className="w-full bg-surface-container-low text-tertiary font-label font-semibold py-4 px-6 rounded-lg flex justify-between items-center hover:bg-surface-dim transition-colors group/btn">
                Consult Archivist AI
                <span className="material-symbols-outlined transform group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              <button className="w-full border border-outline-variant/30 text-on-surface font-label font-semibold py-4 px-6 rounded-lg flex justify-between items-center hover:bg-surface-container-low transition-colors group/btn">
                Librarian Assistance
                <span className="material-symbols-outlined transform group-hover/btn:translate-x-1 transition-transform">person_search</span>
              </button>
            </div>
          </div>

          {/* Small collection cards */}
          {[
            { icon: 'article', title: 'Academic Journals', desc: 'Access thousands of peer-reviewed journals across disciplines, updated daily.', cta: 'Browse Journals', bg: 'bg-surface' },
            { icon: 'description', title: 'Research Papers', desc: 'Explore faculty publications, pre-prints, and collaborative research outputs.', cta: 'View Papers', bg: 'bg-surface-container-low' },
            { icon: 'school', title: 'Doctoral Theses', desc: "A century of AMU's academic legacy, digitized and preserved for the future.", cta: 'Search Archive', bg: 'bg-surface' },
          ].map((card) => (
            <div key={card.title} className={`md:col-span-4 ${card.bg} rounded-xl p-8 border border-outline-variant/15 hover:-translate-y-1 transition-transform duration-300 shadow-ambient flex flex-col`}>
              <span className="material-symbols-outlined text-secondary text-3xl mb-4">{card.icon}</span>
              <h3 className="font-headline text-xl text-on-surface mb-2">{card.title}</h3>
              <p className="font-body text-on-surface-variant text-sm mb-6 flex-grow">{card.desc}</p>
              <a href="#" className="font-label text-primary font-bold text-sm uppercase tracking-wider hover:text-primary-container transition-colors flex items-center gap-2">
                {card.cta} <span className="material-symbols-outlined text-sm">east</span>
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
