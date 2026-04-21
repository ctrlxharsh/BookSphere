import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

export default function Catalog() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('q') || '';

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState(initialSearch);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, catsRes] = await Promise.all([
          fetch('/api/books'),
          fetch('/api/books/categories')
        ]);
        const booksData = await booksRes.json();
        const catsData = await catsRes.json();
        setBooks(booksData);
        setCategories(catsData);
      } catch (err) {
        console.error('Failed to fetch catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q');
    if (q !== null) setSearch(q);
  }, [location.search]);

  const handleSave = async (book) => {
    if (!user) {
      alert('Please log in to save items.');
      return;
    }

    try {
      const response = await fetch('/api/student/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, title: book.title, itemType: 'Saved Book' }),
      });

      if (response.ok) {
        alert(`"${book.title}" added to your research list.`);
      } else {
        alert('Failed to save item.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving item.');
    }
  };

  const handleRequest = async (book) => {
    if (!user) {
      alert('Please log in to request books.');
      return;
    }

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, bookId: book.id }),
      });

      if (response.ok) {
        alert(`Request for "${book.title}" submitted successfully.`);
        // Log activity
        await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            icon: 'pending_actions',
            iconBg: 'bg-primary/10',
            iconColor: 'text-primary',
            text: `New loan request for "${book.title}".`,
            meta: `By ${user?.name} (${user?.id})`
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

  const filtered = books.filter((b) => {
    const matchCat = activeCategory === 'All' || b.category === activeCategory;
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-surface-container-low border-b border-outline-variant/15 px-6 lg:px-12 py-16 max-w-screen-2xl mx-auto">
        <p className="font-body text-tertiary text-sm tracking-[0.2em] uppercase mb-3 font-semibold">Maulana Azad Library</p>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-primary mb-4">Explore the Catalog</h1>
        <p className="font-body text-on-surface-variant text-lg max-w-2xl mb-8">Browse over 1.5 million volumes, rare manuscripts, and digitized archives.</p>
        <div className="relative max-w-2xl">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-full py-4 pl-12 pr-6 font-body text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-ambient"
            placeholder="Search titles, authors, subjects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-10">
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`font-body text-sm font-semibold px-6 py-2 rounded-full transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-primary text-on-primary shadow-ambient'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/30'
              }`}>
              {cat}
            </button>
          ))}
        </div>
        <p className="font-body text-sm text-on-surface-variant mb-6">
          Showing <span className="text-primary font-semibold">{filtered.length}</span> results
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filtered.map((book) => (
            <div key={book.title} className="group relative flex flex-col">
              <div className="relative aspect-[3/4] bg-surface-container-high rounded-lg mb-3 overflow-hidden arch-frame border border-outline-variant/10 shadow-ambient">
                <img alt={book.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={book.img_url} />
                <span className={`absolute bottom-3 right-3 z-20 text-[10px] uppercase tracking-tighter font-bold px-2.5 py-1 rounded-md shadow-lg ${book.available ? 'bg-primary text-on-primary' : 'bg-error text-on-error'}`}>
                  {book.available ? 'Available' : 'Issued'}
                </span>
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20 gap-3">
                  <button 
                    onClick={() => handleRequest(book)}
                    disabled={!book.available}
                    className={`w-full font-body text-xs px-4 py-2.5 rounded-full font-bold transition-all transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 delay-150 ${book.available ? 'bg-secondary text-on-secondary hover:bg-secondary-container' : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'}`}>
                    {book.available ? 'Request Copy' : 'Currently Unavailable'}
                  </button>
                  <button 
                    onClick={() => handleSave(book)}
                    className="w-full border border-outline-variant/40 text-white font-body text-xs px-4 py-2.5 rounded-full font-semibold hover:bg-white/10 transition-all transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 delay-200 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">bookmark_add</span>
                    <span>Save</span>
                  </button>
                </div>
              </div>
              <h4 className="font-headline font-bold text-on-surface line-clamp-1 text-sm">{book.title}</h4>
              <p className="font-body text-xs text-on-surface-variant mt-0.5">{book.author}</p>
              <span className="font-label text-xs text-tertiary mt-1">{book.category}</span>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-6xl text-outline mb-4 block">search_off</span>
            <p className="font-headline text-xl text-on-surface-variant">No results found</p>
          </div>
        )}
      </div>
    </div>
  );
}
