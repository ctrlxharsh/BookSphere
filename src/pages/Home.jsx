import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, statsRes] = await Promise.all([
          fetch('/api/books'),
          fetch('/api/public-stats')
        ]);
        
        const booksData = await booksRes.json();
        const statsData = await statsRes.json();
        
        setBooks(booksData.slice(0, 4));
        setStats(statsData);
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 lg:px-12 max-w-screen-2xl mx-auto overflow-hidden">
        {/* Watermark icon */}
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-[0.03]">
          <span className="material-symbols-outlined" style={{ fontSize: '40rem' }}>local_library</span>
        </div>
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          <p className="font-body text-tertiary text-sm tracking-[0.2em] uppercase mb-4 font-semibold">
            Aligarh Muslim University
          </p>
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-gradient-primary tracking-tight leading-[1.1] mb-8">
            Gateway to Centuries of Knowledge
          </h1>
          <p className="font-body text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Welcome to one of the largest libraries in Asia, home to over 1.5 million volumes and a
            world-renowned collection of rare manuscripts, providing premier resources for global
            academic research and excellence.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-3xl relative">
            <div className="relative flex items-center bg-surface-container-lowest rounded-[3rem] p-2 border border-outline-variant/30 shadow-ambient group hover:border-primary/30 transition-colors">
              <span className="material-symbols-outlined text-primary ml-6 mr-3">search</span>
              <input
                className="w-full bg-transparent border-none outline-none focus:ring-0 font-body text-on-surface placeholder:text-on-surface-variant/50 text-lg py-4"
                placeholder="Search the Catalog, Archives, or Repositories..."
                type="text"
              />
              <Link
                to="/catalog"
                className="bg-gradient-primary text-on-primary font-body font-semibold px-8 py-4 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity ml-2 shrink-0"
              >
                <span>Discover</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="px-6 lg:px-12 py-16 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-auto">

          {/* Manuscript of the Month — 8 cols */}
          <article className="md:col-span-8 relative rounded-xl bg-surface-container-low overflow-hidden group shadow-ambient shadow-ambient-hover transition-all duration-500 hover:scale-[1.01] min-h-96">
            <div className="absolute inset-0 z-0">
              <img
                alt="Ancient illuminated manuscript"
                className="w-full h-full object-cover opacity-80"
                src={stats?.featured?.img_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuB0pjUzv0qMqRrEYLFP-xeEqmCZQt0Vz6A_hDuqBpnIARt3PCUA9sAbqUZTUrssWSx5DrtdQ9luI_NqToONXC_hVeHJfQnQUefD_nzy4MzXY3j4KVdYr1mrH2g5ue7r2TG-MMcDm59y0mOn7XPXKk1tyYQKK6Mv9HKpcdwbgCYKzrbK5GAYFsDVskDeQeEeMEU2VjFXfIWdRfbTMFJw8UsnS211PZ0oLJwnDLeMYlOXLpOGMJPbnapOqBPKucsTR2dxpp4OxJ3ZxMY"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1a]/90 via-[#1b1c1a]/40 to-transparent"></div>
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12 min-h-96">
              <span className="inline-flex items-center gap-2 bg-surface/20 backdrop-blur-md text-surface-bright px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 w-fit border border-surface-bright/20">
                <span className="material-symbols-outlined text-[14px]">stars</span> {stats?.featured ? 'Featured Highlights' : 'Manuscript of the Month'}
              </span>
              <h2 className="font-headline text-3xl md:text-4xl text-surface-bright font-bold mb-2">
                {stats?.featured?.title || 'Tariq-e-Firoz Shahi'}
              </h2>
              <p className="font-body text-surface-bright/80 max-w-xl mb-6">
                {stats?.featured?.desc || 'A 14th-century chronicle detailing the history of the Delhi Sultanate, preserved with its original gold-leaf illuminations and Nastaʿlīq script.'}
              </p>
              <div className="flex gap-6 border-t border-surface-bright/20 pt-4 mt-2">
                <div>
                  <p className="font-body text-xs text-surface-bright/60 uppercase tracking-wide">Category</p>
                  <p className="font-body text-sm text-surface-bright font-medium">{stats?.featured?.category || 'Archives'}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-surface-bright/60 uppercase tracking-wide">Status</p>
                  <p className="font-body text-sm text-surface-bright font-medium">{stats?.featured?.available ? 'Available' : 'Issued'}</p>
                </div>
                <Link to="/catalog" className="ml-auto text-tertiary-fixed hover:text-tertiary-fixed-dim font-body text-sm font-semibold flex items-center gap-1 transition-colors">
                  Explore Catalog <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                </Link>
              </div>
            </div>
          </article>

          {/* Statistics — 4 cols */}
          <div className="md:col-span-4 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between border border-outline-variant/15 shadow-ambient relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
              <span className="material-symbols-outlined text-9xl">account_balance</span>
            </div>
            <div>
              <h3 className="font-headline text-2xl text-primary font-bold mb-8">The Collection at a Glance</h3>
              <div className="space-y-6">
                {[
                  { icon: 'menu_book', value: stats?.totalVolumes || '1.5M+', label: 'Total Volumes' },
                  { icon: 'history_edu', value: stats?.totalManuscripts || '16,000', label: 'Rare Manuscripts' },
                  { icon: 'layers', value: '7', label: 'Library Floors' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-tertiary text-3xl symbol-fill">{stat.icon}</span>
                    <div>
                      <p className="font-headline text-3xl font-bold text-on-surface">{stat.value}</p>
                      <p className="font-body text-sm text-on-surface-variant font-medium uppercase tracking-wide">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/catalog" className="font-body text-primary font-semibold text-sm hover:text-primary-container transition-colors inline-flex items-center gap-1 mt-4">
              View Complete Holdings <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </Link>
          </div>

          {/* New Arrivals — full width */}
          <div className="md:col-span-12 rounded-xl border border-outline-variant/15 p-8 relative overflow-hidden bg-surface">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="font-headline text-3xl text-primary font-bold">New Arrivals</h3>
                <p className="font-body text-on-surface-variant mt-2">Recently acquired and digitized academic volumes.</p>
              </div>
              <Link to="/catalog" className="font-body text-tertiary font-semibold hover:text-tertiary-container transition-colors flex items-center gap-2">
                Browse All <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {books.map((book) => (
                <div key={book.title} className="group relative flex flex-col items-center">
                  <div className="w-full aspect-[3/4] bg-surface-container-high rounded-lg mb-4 shadow-ambient overflow-hidden relative arch-frame border border-outline-variant/10">
                    <img
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={book.img_url}
                    />
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20 gap-3">
                      <p className="font-body text-sm text-center text-white/90 mb-6 leading-relaxed line-clamp-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-200">{book.desc}</p>
                      <button className="bg-primary text-on-primary font-body text-xs px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-primary-container transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-300 shadow-lg">
                        <span className="material-symbols-outlined text-[16px]">bookmark_add</span> 
                        <span>Save to Research</span>
                      </button>
                    </div>
                  </div>
                  <h4 className="font-headline font-bold text-on-surface text-center line-clamp-1">{book.title}</h4>
                  <p className="font-body text-xs text-on-surface-variant mt-1 text-center">{book.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
