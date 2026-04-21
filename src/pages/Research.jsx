import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Research() {
  const [query, setQuery] = useState('');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchMaterials();
  }, []);

  const fetchMaterials = async (searchTerm = '') => {
    try {
      setLoading(true);
      const res = await fetch(`/api/research?q=${searchTerm}`);
      const data = await res.json();
      setMaterials(data);
    } catch (err) {
      console.error('Error fetching research:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMaterials(query);
  };

  const handleRequest = async (item) => {
    if (!user) {
      alert('Please log in to request research materials.');
      return;
    }

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.userId, researchId: item.id }),
      });

      if (response.ok) {
        alert(`Access request for "${item.title}" submitted successfully.`);
        // Log activity
        await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            icon: 'microscope',
            iconBg: 'bg-tertiary/10',
            iconColor: 'text-tertiary',
            text: `New research access request for "${item.title}".`,
            meta: `By ${user.name} (${user.userId})`
          })
        });
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to submit request.');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting request.');
    }
  };

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
          <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto bg-surface-container-lowest rounded-full shadow-ambient border border-outline-variant/15 flex items-center p-2 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <span className="material-symbols-outlined text-primary ml-4 opacity-50">search</span>
            <input
              className="w-full bg-transparent border-none text-on-surface font-body text-lg focus:ring-0 px-4 py-3 placeholder-on-surface-variant/50 outline-none"
              placeholder="Search specialized databases, theses, or journals..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="bg-gradient-primary text-on-primary rounded-full px-8 py-3 font-label font-semibold hover:opacity-90 transition-opacity shrink-0">
              Explore
            </button>
          </form>
        </header>

        {/* Dynamic Results Grid */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline text-3xl text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-tertiary">travel_explore</span>
              {query ? 'Search Results' : 'Featured Collections'}
            </h2>
            <p className="font-label text-on-surface-variant">{materials.length} items found</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {materials.map((item) => (
                <div key={item.id} className="bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden group hover:shadow-xl transition-all duration-500 flex flex-col h-full">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img src={item.img_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                      {item.type}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-headline text-lg text-on-surface mb-2 line-clamp-2 h-14">{item.title}</h3>
                    <p className="font-body text-xs text-on-surface-variant mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">person</span>
                      {item.author}
                    </p>
                    <p className="font-body text-sm text-on-surface-variant mb-6 line-clamp-3 flex-grow">
                      {item.description}
                    </p>
                    <div className="flex gap-2 mt-auto">
                      {item.external_link && (
                        <a href={item.external_link} target="_blank" rel="noopener noreferrer" className="flex-1 bg-surface-container-high text-on-surface-variant font-label text-xs font-bold py-2.5 rounded-lg text-center hover:bg-surface-dim transition-colors">
                          View External
                        </a>
                      )}
                      <button 
                        onClick={() => handleRequest(item)}
                        className="flex-1 bg-primary text-on-primary font-label text-xs font-bold py-2.5 rounded-lg hover:shadow-lg transition-all active:scale-95"
                      >
                        Request Access
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Support Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-7xl mx-auto">
          <div className="md:col-span-8 bg-surface-container-low rounded-2xl p-10 border border-outline-variant/15 flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-grow">
              <h2 className="font-headline text-3xl text-on-surface mb-4">Can't find what you need?</h2>
              <p className="font-body text-on-surface-variant text-lg mb-8 leading-relaxed">
                Our archival team can help you source rare manuscripts and scholarly papers from our global partner networks.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/student" className="bg-secondary text-on-secondary px-8 py-3 rounded-full font-label font-bold flex items-center gap-2 hover:shadow-lg transition-all">
                  <span className="material-symbols-outlined">smart_toy</span> Consult AI Assistant
                </Link>
                <button className="border border-outline px-8 py-3 rounded-full font-label font-bold flex items-center gap-2 hover:bg-surface-container-high transition-all">
                  <span className="material-symbols-outlined">mail</span> Email Archivist
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden shadow-ambient">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuABRrqflFTRH7qji6wdbetUgacwqlFAo3n56PfOGNLXe_SNYgsMx-CHEnE_6XD-NDs-UULfzk2p8mx0myK4j5NFJ1VTg0CGsRR6FB1vJ7-f5ZPCuoSk9hs5uY7tocbO1AKkmY50udX7qhsZsWTnG2ccgHri_1Rqzu3wfVQD5RDyTvsoT9SsZvhVKPAtF68q0Csm9eu7ycVE3ZoB4-K6PV9hCuSghtb4wOHkId3e4tEFTj6EMtWLYVTTzObV6AwxcOGx-Go_nEVfAic" className="w-full h-full object-cover" alt="Library Archive" />
            </div>
          </div>
          
          <div className="md:col-span-4 bg-primary rounded-2xl p-10 text-on-primary flex flex-col justify-center text-center">
            <span className="material-symbols-outlined text-6xl mb-6 opacity-30">history_edu</span>
            <h3 className="font-headline text-3xl mb-4">Legacy of Knowledge</h3>
            <p className="font-body opacity-80 leading-relaxed mb-8">
              AMU's Maulana Azad Library houses over 1.4 million books and thousands of rare Persian, Arabic, and Urdu manuscripts.
            </p>
            <div className="h-1 w-20 bg-on-primary/20 mx-auto rounded-full"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
