import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LibrarianDashboard() {
  const { user } = useAuth();
  const [searchVal, setSearchVal] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [stats, setStats] = useState([]);
  const [books, setBooks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editBook, setEditBook] = useState(null);
  const [researchMaterials, setResearchMaterials] = useState([]);
  const [showAddResearchModal, setShowAddResearchModal] = useState(false);
  const [showEditResearchModal, setShowEditResearchModal] = useState(false);
  const [editResearch, setEditResearch] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, actRes, booksRes, reqRes, repRes, resRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/activities'),
          fetch('/api/books'),
          fetch('/api/requests'),
          fetch('/api/reports'),
          fetch('/api/research')
        ]);
        
        setStats(await statsRes.json());
        setActivities(await actRes.json());
        setBooks(await booksRes.json());
        setRequests(await reqRes.json());
        setReports(await repRes.json());
        setResearchMaterials(await resRes.json());
      } catch (err) {
        console.error('Error fetching librarian data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]); // Refetch on tab change to be fresh

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const bookData = Object.fromEntries(formData);
    
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });
      if (res.ok) {
        setShowAddModal(false);
        setActiveTab('Dashboard'); // Refresh
        // Log activity
        await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            icon: 'add_circle',
            iconBg: 'bg-primary/10',
            iconColor: 'text-primary',
            text: `New asset "${bookData.title}" added to catalogue.`,
            meta: `By ${user?.name}`
          })
        });
      }
    } catch (err) { console.error(err); }
  };

  const handleEditBook = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const bookData = { ...Object.fromEntries(formData), id: editBook.id, available: editBook.available };
    
    try {
      const res = await fetch('/api/books', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });
      if (res.ok) {
        setShowEditModal(false);
        setEditBook(null);
        // Refresh books
        const booksRes = await fetch('/api/books');
        setBooks(await booksRes.json());
        // Log activity
        await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            icon: 'edit',
            iconBg: 'bg-secondary/10',
            iconColor: 'text-secondary',
            text: `Catalogue entry "${bookData.title}" updated.`,
            meta: `By ${user?.name}`
          })
        });
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteBook = async (id) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    const bookToDelete = books.find(b => b.id === id);
    try {
      const res = await fetch(`/api/books?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBooks(books.filter(b => b.id !== id));
        // Log activity
        await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            icon: 'delete',
            iconBg: 'bg-error/10',
            iconColor: 'text-error',
            text: `Asset "${bookToDelete?.title || id}" removed from catalogue.`,
            meta: `By ${user?.name}`
          })
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddResearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const researchData = Object.fromEntries(formData);
    
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(researchData)
      });
      if (res.ok) {
        setShowAddResearchModal(false);
        // Refresh research
        const resRes = await fetch('/api/research');
        setResearchMaterials(await resRes.json());
        // Log activity
        await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            icon: 'microscope',
            iconBg: 'bg-tertiary/10',
            iconColor: 'text-tertiary',
            text: `New research material "${researchData.title}" catalogued.`,
            meta: `By ${user?.name}`
          })
        });
      }
    } catch (err) { console.error(err); }
  };

  const handleEditResearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const researchData = { ...Object.fromEntries(formData), id: editResearch.id };
    
    try {
      const res = await fetch('/api/research', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(researchData)
      });
      if (res.ok) {
        setShowEditResearchModal(false);
        setEditResearch(null);
        // Refresh research
        const resRes = await fetch('/api/research');
        setResearchMaterials(await resRes.json());
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteResearch = async (id) => {
    if (!confirm('Delete this research material?')) return;
    try {
      const res = await fetch(`/api/research?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setResearchMaterials(researchMaterials.filter(m => m.id !== id));
      }
    } catch (err) { console.error(err); }
  };

  const handleRequestAction = async (requestId, status) => {
    try {
      const res = await fetch('/api/requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status })
      });
      if (res.ok) {
        setRequests(requests.filter(r => r.id !== requestId));
        // Also log activity
        await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            icon: status === 'approved' ? 'check_circle' : 'cancel',
            iconBg: status === 'approved' ? 'bg-primary/10' : 'bg-error/10',
            iconColor: status === 'approved' ? 'text-primary' : 'text-error',
            text: `Request #${requestId} was ${status}.`,
            meta: `By ${user?.name}`
          })
        });
      }
    } catch (err) { console.error(err); }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        setShowAddUserModal(false);
        alert('User registered successfully');
        // Log activity
        await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            icon: 'person_add',
            iconBg: 'bg-secondary/10',
            iconColor: 'text-secondary',
            text: `New member "${userData.name}" (${userData.userId}) registered.`,
            meta: `By ${user?.name}`
          })
        });
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Error registering user');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-surface-container-low border-r border-outline-variant/15 flex flex-col">
        <div className="p-8">
          <Link to="/" className="flex items-center space-x-2 mb-10 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-xl">auto_stories</span>
            </div>
            <span className="font-headline font-bold text-xl tracking-tight text-on-surface">BookSphere</span>
          </Link>

          <nav className="space-y-1">
            {['Dashboard', 'Catalogue', 'Research', 'Requests', 'Members', 'Reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-label text-sm font-bold transition-all duration-300 ${
                  activeTab === tab 
                    ? 'bg-primary text-on-primary shadow-xl shadow-primary/25 translate-x-1' 
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined notranslate text-[22px] shrink-0">
                  {tab === 'Dashboard' ? 'dashboard' : 
                   tab === 'Catalogue' ? 'auto_stories' : 
                   tab === 'Research' ? 'science' : 
                   tab === 'Requests' ? 'pending_actions' : 
                   tab === 'Members' ? 'group' : 'analytics'}
                </span>
                <span className="truncate">{tab}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-outline-variant/15 mt-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'LIB'}
            </div>
            <div>
              <p className="font-label font-semibold text-sm text-on-surface">{user?.name || 'Librarian'}</p>
              <p className="font-label text-xs text-on-surface-variant">{user?.details || 'Library Staff'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Dashboard Area */}
      <main className="flex-grow bg-surface overflow-y-auto">
        <header className="px-8 py-6 border-b border-outline-variant/15 flex justify-between items-center bg-surface/80 backdrop-blur-md sticky top-0 z-30">
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface">{activeTab}</h2>
            <p className="font-label text-xs text-on-surface-variant">Librarian Administrative Portal</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center space-x-2 bg-secondary text-on-secondary px-6 py-2.5 rounded-full font-label text-sm font-bold shadow-lg shadow-secondary/20 hover:scale-[1.03] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined notranslate text-[20px]">person_add</span>
              <span>Register Member</span>
            </button>
            <button 
              onClick={() => { activeTab === 'Research' ? setShowAddResearchModal(true) : setShowAddModal(true) }}
              className="flex items-center space-x-2 bg-primary text-on-primary px-6 py-2.5 rounded-full font-label text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined notranslate text-[20px]">add</span>
              <span>Add New {activeTab === 'Research' ? 'Research' : 'Asset'}</span>
            </button>
          </div>
        </header>

        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : activeTab === 'Dashboard' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1400px]">
              <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((s) => (
                  <div key={s.label} className="bg-surface-container-low rounded-xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
                        <span className="material-symbols-outlined symbol-fill">{s.icon}</span>
                      </div>
                      <span className={`font-label text-xs font-semibold px-2 py-1 rounded-full ${s.badgeColor}`}>{s.badge}</span>
                    </div>
                    <h3 className="font-headline text-3xl font-bold text-on-surface mb-1">{s.value}</h3>
                    <p className="font-label text-sm text-on-surface-variant">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-8 bg-surface-container-low rounded-2xl p-8 border border-outline-variant/10">
                <h3 className="font-headline text-lg font-bold text-on-surface mb-8">Recent Library Activity</h3>
                <div className="space-y-6">
                  {activities.map((act, i) => (
                    <div key={i} className="flex space-x-4 items-start group">
                      <div className={`w-10 h-10 rounded-full ${act.iconBg} ${act.iconColor} flex items-center justify-center shrink-0 shadow-sm`}>
                        <span className="material-symbols-outlined text-[18px]">{act.icon}</span>
                      </div>
                      <div className="flex-grow pt-1">
                        <p className="font-body text-sm text-on-surface leading-relaxed">{act.text}</p>
                        <p className="font-label text-xs text-on-surface-variant mt-1.5">
                          {act.meta} • {formatTime(act.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'Catalogue' ? (
            <div className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/10">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-high">
                  <tr>
                    <th className="p-4 font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Book</th>
                    <th className="p-4 font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Author</th>
                    <th className="p-4 font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Status</th>
                    <th className="p-4 font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {books.map(book => (
                    <tr key={book.id} className="hover:bg-surface-container-high/50 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img src={book.img_url} className="w-10 h-14 object-cover rounded shadow-sm" />
                        <span className="font-body text-sm font-semibold text-on-surface">{book.title}</span>
                      </td>
                      <td className="p-4 font-body text-sm text-on-surface-variant">{book.author}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${book.available ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'}`}>
                          {book.available ? 'Available' : 'Issued'}
                        </span>
                      </td>
                      <td className="p-4 space-x-2">
                        <button onClick={() => { setEditBook(book); setShowEditModal(true); }} className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button onClick={() => handleDeleteBook(book.id)} className="text-error hover:bg-error/10 p-2 rounded-full transition-colors">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'Research' ? (
            <div className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/10">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-high">
                  <tr>
                    <th className="p-4 font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Research Material</th>
                    <th className="p-4 font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Type</th>
                    <th className="p-4 font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {researchMaterials.map(m => (
                    <tr key={m.id} className="hover:bg-surface-container-high/50 transition-colors">
                      <td className="p-4 font-body text-sm font-semibold text-on-surface">{m.title}</td>
                      <td className="p-4 font-body text-sm text-on-surface-variant">{m.type}</td>
                      <td className="p-4 space-x-2">
                        <button onClick={() => { setEditResearch(m); setShowEditResearchModal(true); }} className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button onClick={() => handleDeleteResearch(m.id)} className="text-error hover:bg-error/10 p-2 rounded-full transition-colors">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'Requests' ? (
            <div className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/10">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-high">
                  <tr>
                    <th className="px-6 py-4 font-label text-xs font-bold text-on-surface-variant/70 uppercase tracking-widest text-left">Item Requested</th>
                    <th className="px-6 py-4 font-label text-xs font-bold text-on-surface-variant/70 uppercase tracking-widest text-left">Requester</th>
                    <th className="px-6 py-4 font-label text-xs font-bold text-on-surface-variant/70 uppercase tracking-widest text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {requests.map(req => (
                    <tr key={req.id} className="hover:bg-surface-container-high/50">
                      <td className="px-6 py-4 font-body text-sm text-on-surface">
                        {req.book_title || req.research_title}
                        {req.research_title && <span className="ml-2 text-[10px] bg-tertiary/10 text-tertiary px-1.5 py-0.5 rounded uppercase">Research</span>}
                      </td>
                      <td className="px-6 py-4 font-body text-sm text-on-surface-variant">{req.student_name}</td>
                      <td className="px-6 py-4 space-x-2">
                        <button onClick={() => handleRequestAction(req.id, 'approved')} className="text-primary hover:bg-primary/10 p-2 rounded-full"><span className="material-symbols-outlined">check</span></button>
                        <button onClick={() => handleRequestAction(req.id, 'rejected')} className="text-error hover:bg-error/10 p-2 rounded-full"><span className="material-symbols-outlined">close</span></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/10">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-high">
                  <tr>
                    <th className="p-4 font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Book</th>
                    <th className="p-4 font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Issued To</th>
                    <th className="p-4 font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Loan Date</th>
                    <th className="p-4 font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {reports.map(loan => (
                    <tr key={loan.id} className="hover:bg-surface-container-high/50 transition-colors">
                      <td className="p-4 font-body text-sm font-semibold text-on-surface">{loan.book_title}</td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-body text-sm text-on-surface">{loan.student_name}</span>
                          <span className="text-[10px] text-on-surface-variant font-mono">{loan.student_id}</span>
                        </div>
                      </td>
                      <td className="p-4 font-body text-sm text-on-surface-variant">{new Date(loan.loan_date).toLocaleDateString()}</td>
                      <td className="p-4 font-body text-sm font-bold text-error">{new Date(loan.due_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-outline-variant/15 flex justify-between items-center bg-secondary/5">
              <h3 className="font-headline text-xl font-bold text-on-surface">Register Member</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-on-surface-variant hover:bg-surface-container-high p-2 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">User ID (Enrollment)</label>
                  <input name="userId" required className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm focus:ring-2 focus:ring-secondary/20 focus:outline-none" placeholder="e.g. GP5008" />
                </div>
                <div>
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">Full Name</label>
                  <input name="name" required className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm focus:ring-2 focus:ring-secondary/20 focus:outline-none" placeholder="Enter student name" />
                </div>
                <div>
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">Role</label>
                  <select name="role" required className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm focus:ring-2 focus:ring-secondary/20 focus:outline-none">
                    <option value="student">Student</option>
                    <option value="librarian">Librarian</option>
                  </select>
                </div>
                <div>
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">Password</label>
                  <input name="password" type="password" required className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm focus:ring-2 focus:ring-secondary/20 focus:outline-none" placeholder="Set password" />
                </div>
                <div>
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">Details</label>
                  <input name="details" className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm focus:ring-2 focus:ring-secondary/20 focus:outline-none" placeholder="e.g. B.Tech Student, Year 3" />
                </div>
              </div>
              <button type="submit" className="w-full bg-secondary text-on-secondary font-label font-bold py-4 rounded-2xl shadow-lg hover:shadow-secondary/20 transition-all">Create Member Account</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-outline-variant/15 flex justify-between items-center bg-primary/5">
              <h3 className="font-headline text-xl font-bold text-on-surface">Add Library Asset</h3>
              <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:bg-surface-container-high p-2 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddBook} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">Title</label>
                  <input name="title" required className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm" />
                </div>
                <div>
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">Author</label>
                  <input name="author" required className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm" />
                </div>
                <div>
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">Category</label>
                  <select name="category" className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm">
                    <option>History</option>
                    <option>Literature</option>
                    <option>Archives</option>
                    <option>Science</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">Image URL</label>
                  <input name="img_url" required className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm" placeholder="https://..." />
                </div>
                <div className="col-span-2">
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">Description</label>
                  <textarea name="description" rows="3" className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm" />
                </div>
              </div>
              <button type="submit" className="w-full bg-primary text-on-primary font-label font-bold py-4 rounded-2xl shadow-lg transition-all mt-4">Add to Catalogue</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {showEditModal && editBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-outline-variant/15 flex justify-between items-center bg-primary/5">
              <h3 className="font-headline text-xl font-bold text-on-surface">Edit Asset: {editBook.title}</h3>
              <button onClick={() => setShowEditModal(false)} className="text-on-surface-variant hover:bg-surface-container-high p-2 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleEditBook} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">Title</label>
                  <input name="title" defaultValue={editBook.title} required className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm" />
                </div>
                <div>
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">Author</label>
                  <input name="author" defaultValue={editBook.author} required className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm" />
                </div>
                <div>
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">Category</label>
                  <select name="category" defaultValue={editBook.category} className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm">
                    <option>History</option>
                    <option>Literature</option>
                    <option>Archives</option>
                    <option>Science</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">Image URL</label>
                  <input name="img_url" defaultValue={editBook.img_url} required className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">Description</label>
                  <textarea name="description" defaultValue={editBook.description} rows="3" className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm" />
                </div>
              </div>
              <button type="submit" className="w-full bg-primary text-on-primary font-label font-bold py-4 rounded-2xl shadow-lg transition-all mt-4">Save Changes</button>
            </form>
          </div>
        </div>
      )}
      {/* Add Research Modal */}
      {showAddResearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-outline-variant/15 flex justify-between items-center bg-tertiary/5">
              <h3 className="font-headline text-xl font-bold text-on-surface">Catalogue Research Material</h3>
              <button onClick={() => setShowAddResearchModal(false)} className="text-on-surface-variant hover:bg-surface-container-high p-2 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddResearch} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">Title</label>
                  <input name="title" required className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm" />
                </div>
                <div>
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">Author / Contributor</label>
                  <input name="author" required className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm" />
                </div>
                <div>
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">Type</label>
                  <select name="type" className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm">
                    <option>Thesis</option>
                    <option>Manuscript</option>
                    <option>Journal</option>
                    <option>Research Paper</option>
                    <option>Digital Collection</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">Image URL</label>
                  <input name="img_url" required className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm" placeholder="https://..." />
                </div>
                <div className="col-span-2">
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">External Link (Optional)</label>
                  <input name="external_link" className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm" placeholder="https://shodhganga.inflibnet.ac.in/..." />
                </div>
                <div className="col-span-2">
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">Description</label>
                  <textarea name="description" rows="3" className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm" />
                </div>
              </div>
              <button type="submit" className="w-full bg-tertiary text-on-tertiary font-label font-bold py-4 rounded-2xl shadow-lg transition-all mt-4">Catalog Material</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Research Modal */}
      {showEditResearchModal && editResearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-outline-variant/15 flex justify-between items-center bg-tertiary/5">
              <h3 className="font-headline text-xl font-bold text-on-surface">Edit Material: {editResearch.title}</h3>
              <button onClick={() => setShowEditResearchModal(false)} className="text-on-surface-variant hover:bg-surface-container-high p-2 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleEditResearch} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">Title</label>
                  <input name="title" defaultValue={editResearch.title} required className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm" />
                </div>
                <div>
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">Author / Contributor</label>
                  <input name="author" defaultValue={editResearch.author} required className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm" />
                </div>
                <div>
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">Type</label>
                  <select name="type" defaultValue={editResearch.type} className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm">
                    <option>Thesis</option>
                    <option>Manuscript</option>
                    <option>Journal</option>
                    <option>Research Paper</option>
                    <option>Digital Collection</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">Image URL</label>
                  <input name="img_url" defaultValue={editResearch.img_url} required className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">External Link</label>
                  <input name="external_link" defaultValue={editResearch.external_link} className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="font-label text-xs font-bold text-on-surface-variant uppercase mb-2 block">Description</label>
                  <textarea name="description" defaultValue={editResearch.description} rows="3" className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm" />
                </div>
              </div>
              <button type="submit" className="w-full bg-tertiary text-on-tertiary font-label font-bold py-4 rounded-2xl shadow-lg transition-all mt-4">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
