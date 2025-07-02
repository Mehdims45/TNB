import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AddTrackerModal from '../components/AddTrackerModal';
import TrackerCard from '../components/TrackerCard';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { supabase, user } = useAuth();
  const [trackers, setTrackers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('trackers').select('*').eq('user_id', user.id).then(({ data }) => setTrackers(data || []));
  }, [supabase, user]);

  const handleSaved = (id: string) => {
    supabase.from('trackers').select('*').eq('id', id).single().then(({ data }) => {
      if (data) setTrackers(prev => [...prev, data]);
    });
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 space-y-4">
          <button className="bg-gold text-white px-4 py-2 rounded" onClick={() => setOpen(true)}>
            Add New
          </button>
          <div className="grid gap-4">
            {trackers.map(t => (
              <TrackerCard key={t.id} tracker={t} />
            ))}
          </div>
        </main>
        <Footer />
        <AddTrackerModal open={open} onClose={() => setOpen(false)} onSaved={handleSaved} />
      </div>
    </ProtectedRoute>
  );
}
