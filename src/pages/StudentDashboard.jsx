import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';


export default function StudentDashboard() {
  const { user } = useAuth();
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [reservedItems, setReservedItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [aiMsg, setAiMsg] = useState('');
  const [chat, setChat] = useState([{ from: 'ai', text: `Hello ${user?.name?.split(' ')[0] || 'there'}. How can I assist your research today?` }]);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [issuedRes, savedRes, reservedRes, historyRes] = await Promise.all([
        fetch(`/api/student/issued?userId=${user.id}`),
        fetch(`/api/student/saved?userId=${user.id}`),
        fetch(`/api/requests?userId=${user.id}`),
        fetch(`/api/student/history?userId=${user.id}`)
      ]);
      
      const issuedData = await issuedRes.json();
      const savedData = await savedRes.json();
      const reservedData = await reservedRes.json();
      const historyData = await historyRes.json();
      
      setIssuedBooks(issuedData);
      setSavedItems(savedData);
      setReservedItems(reservedData);
      setHistory(historyData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  const handleRenew = async (loanId) => {
    try {
      const res = await fetch('/api/renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loanId })
      });
      if (res.ok) {
        showNotification('Renewal successful! Due date extended.');
        const loan = issuedBooks.find(l => l.id === loanId);
        fetchData();
        // Log activity
        await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            icon: 'history',
            iconBg: 'bg-secondary/10',
            iconColor: 'text-secondary',
            text: `Loan for "${loan?.title || 'Book'}" renewed.`,
            meta: `By ${user?.name} (${user?.id})`
          })
        });
      } else {
        const data = await res.json();
        showNotification(data.message || 'Renewal failed.');
      }
    } catch (err) {
      showNotification('Connection error.');
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const sendMsg = async () => {
    if (!aiMsg.trim()) return;
    
    const userMsg = { from: 'user', text: aiMsg };
    const newChat = [...chat, userMsg];
    setChat(newChat);
    const currentMsg = aiMsg;
    setAiMsg('');
    
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: currentMsg,
          history: [
            { role: 'user', parts: [{ text: 'Hello' }] },
            ...chat.map(m => ({
              role: m.from === 'ai' ? 'model' : 'user',
              parts: [{ text: m.text }]
            }))
          ]
        }),
      });

      const data = await response.json();
      setChat([...newChat, { from: 'ai', text: data.text }]);
    } catch (err) {
      console.error(err);
      setChat([...newChat, { from: 'ai', text: "I'm having trouble connecting to my scholarly knowledge right now." }]);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col relative">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 right-8 bg-surface-container-highest border border-primary/20 text-on-surface px-6 py-3 rounded-xl shadow-ambient z-50 flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
          <span className="material-symbols-outlined text-primary">check_circle</span>
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}
      <main className="flex-grow w-full max-w-screen-2xl mx-auto px-8 py-12 flex flex-col gap-12">
        {/* Welcome Header */}
        <header className="flex justify-between items-end pb-8 border-b border-outline-variant/15">
          <div>
            <p className="text-on-surface-variant font-label text-sm uppercase tracking-widest mb-2">Student Portal</p>
            <h1 className="font-headline text-4xl md:text-5xl text-primary leading-none tracking-tight">
              Welcome back,<br />{user?.name || 'Scholar'}
            </h1>
          </div>
          <div className="text-right">
            <p className="font-body text-sm text-on-surface-variant mb-1">{user?.details || 'M.A. Scholar'}</p>
            <p className="font-body text-sm text-on-surface-variant">ID: {user?.id}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* My Library */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline text-2xl text-on-surface">My Library</h2>
                <button 
                  onClick={() => setShowHistory(true)}
                  className="font-body text-sm text-tertiary hover:underline underline-offset-4">View History</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {issuedBooks.length === 0 && (
                  <p className="font-body text-sm text-on-surface-variant italic col-span-2 bg-surface-container-low p-6 rounded-lg text-center">You have no books currently issued.</p>
                )}
                {issuedBooks.map((book) => (
                  <div key={book.id} className="bg-surface-container-low rounded-lg p-6 group relative overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                    <div className="flex gap-4">
                      <div className="w-20 h-28 bg-surface-container-highest rounded-md overflow-hidden shrink-0">
                        <img alt={book.title} className="w-full h-full object-cover" src={book.img} />
                      </div>
                      <div className="flex flex-col justify-between">
                        <div>
                          <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mb-1">Issued</p>
                          <h3 className="font-headline text-lg text-on-surface leading-tight mb-1">{book.title}</h3>
                          <p className="font-body text-sm text-on-surface-variant">{book.author}</p>
                        </div>
                        <div className={`flex items-center gap-2 mt-4 ${book.dueUrgent ? 'text-error' : 'text-on-surface-variant'}`}>
                          <span className="material-symbols-outlined text-sm">{book.dueUrgent ? 'schedule' : 'event'}</span>
                          <span className="font-body text-sm font-medium">{book.dueText}</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full glass-panel p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-end gap-3 border-t border-outline-variant/15">
                      <button 
                        onClick={() => showNotification(`Viewing details for "${book.title}"...`)}
                        className="font-body text-sm text-on-surface hover:text-primary transition-colors px-4 py-2">Details</button>
                      <button 
                        onClick={() => handleRenew(book.id)}
                        className="font-body text-sm bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed transition-colors px-4 py-2 rounded-full font-medium">Renew</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Reserved / Pending Requests */}
            <section>
              <h2 className="font-headline text-xl text-on-surface mb-4">Pending Requests & Reservations</h2>
              <div className="flex flex-col gap-4">
                {reservedItems.length === 0 && (
                  <p className="font-body text-sm text-on-surface-variant italic bg-surface-container-low p-6 rounded-lg">No active requests or reservations.</p>
                )}
                {reservedItems.map((item) => (
                  <div key={item.id} className="bg-surface-container-low rounded-lg p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined symbol-fill">local_library</span>
                      </div>
                      <div>
                        <h4 className="font-headline text-md text-on-surface">
                          {item.book_title || item.research_title}
                          {item.research_title && <span className="ml-2 text-[10px] bg-tertiary/10 text-tertiary px-1.5 py-0.5 rounded uppercase tracking-wider">Research</span>}
                        </h4>
                        <p className="font-body text-sm text-on-surface-variant">
                          {item.status === 'approved' ? 'Access granted / Ready for pickup' : 'Waiting for librarian approval'}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full font-label text-xs font-semibold ${item.status === 'approved' ? 'bg-primary/10 text-primary' : 'bg-tertiary-container/20 text-tertiary'}`}>
                      {item.status === 'approved' ? 'Ready for Pickup' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Research Corner */}
            <section className="bg-surface-container-highest rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">bookmark</span>
                <h3 className="font-headline text-lg text-on-surface">Research Corner</h3>
              </div>
              <div className="flex flex-col gap-4">
                {savedItems.map((item, i) => (
                  <div key={i} className="group cursor-pointer">
                    <p className="font-label text-xs text-on-surface-variant mb-1">{item.type}</p>
                    <h4 className="font-body font-medium text-on-surface group-hover:text-primary transition-colors line-clamp-2">{item.title}</h4>
                    {i < savedItems.length - 1 && <div className="h-[1px] w-full bg-outline-variant/15 mt-3"></div>}
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 font-body text-sm text-tertiary bg-surface-container-low rounded-full hover:bg-surface-container-high transition-colors font-medium">
                View All Saved Items
              </button>
            </section>

            {/* Archivist AI */}
            <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 shadow-ambient flex flex-col min-h-[300px]">
              <div className="gradient-primary-bg rounded-t-xl p-4 text-on-primary flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined">smart_toy</span>
                  <h3 className="font-body font-semibold">Archivist AI</h3>
                </div>
                <span className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse"></span>
              </div>
              <div className="p-4 flex-grow flex flex-col gap-3 overflow-y-auto bg-surface-bright max-h-48">
                {chat.map((msg, i) => (
                  <div key={i} className={`p-3 rounded-2xl max-w-[85%] ${msg.from === 'ai' ? 'self-start bg-surface-container-low rounded-tl-sm' : 'self-end bg-primary text-on-primary rounded-tr-sm'}`}>
                    <p className="font-body text-sm">{msg.text}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-surface border-t border-outline-variant/15 rounded-b-xl flex items-center gap-2">
                <input
                  className="flex-grow bg-surface-container-low border-none rounded-full px-4 py-2 text-sm font-body focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Ask about archives, sources..."
                  value={aiMsg}
                  onChange={(e) => setAiMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMsg()}
                />
                <button onClick={sendMsg} className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm">send</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface-container-highest w-full max-w-2xl rounded-2xl shadow-ambient overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-outline-variant/15 flex justify-between items-center">
              <div>
                <h2 className="font-headline text-2xl text-on-surface">Loan History</h2>
                <p className="font-body text-sm text-on-surface-variant">Your past book returns and historical transactions.</p>
              </div>
              <button onClick={() => setShowHistory(false)} className="w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-center py-12 font-body text-on-surface-variant italic">No historical records found.</p>
              ) : (
                <table className="w-full text-left font-body text-sm">
                  <thead className="text-on-surface-variant uppercase text-[10px] tracking-widest border-b border-outline-variant/15">
                    <tr>
                      <th className="pb-4 px-2">Book Title</th>
                      <th className="pb-4 px-2">Loan Date</th>
                      <th className="pb-4 px-2">Return Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {history.map((h) => (
                      <tr key={h.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-4 px-2 font-medium text-on-surface">{h.title}</td>
                        <td className="py-4 px-2 text-on-surface-variant">{new Date(h.loan_date).toLocaleDateString()}</td>
                        <td className="py-4 px-2 text-on-surface-variant">{new Date(h.return_date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="p-6 border-t border-outline-variant/15 bg-surface-container-low flex justify-end">
              <button onClick={() => setShowHistory(false)} className="px-6 py-2 bg-primary text-on-primary rounded-full font-label font-semibold">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
