import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

export default function TrackerDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { supabase } = useAuth();
  const [tracker, setTracker] = useState<any>(null);
  const [threshold, setThreshold] = useState('');

  useEffect(() => {
    if (!id) return;
    supabase.from('trackers').select('*').eq('id', id).single().then(({ data }) => {
      if (data) {
        setTracker(data);
        setThreshold(data.threshold_price || '');
      }
    });
  }, [id, supabase]);

  const save = async () => {
    await supabase.from('trackers').update({ threshold_price: Number(threshold) || null }).eq('id', id);
  };

  const del = async () => {
    await supabase.from('trackers').delete().eq('id', id);
    router.push('/dashboard');
  };

  if (!tracker) return null;

  const chartUrl = `${process.env.NEXT_PUBLIC_QUICKCHART_BASE_URL}?c=${encodeURIComponent(JSON.stringify({type:'line',data:{labels:tracker.price_history.map((p:any)=>p.date),datasets:[{label:'Price',data:tracker.price_history.map((p:any)=>p.price)}]}}))}`;

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 space-y-4">
          <h1 className="text-2xl font-bold">{tracker.title}</h1>
          <img src={tracker.image_url} className="w-40" />
          <div>
            <label>Threshold Price</label>
            <input className="border p-2 w-full" value={threshold} onChange={e => setThreshold(e.target.value)} />
          </div>
          <img src={chartUrl} alt="Price history" />
          <div className="space-x-2">
            <button className="bg-gold text-white px-4 py-2 rounded" onClick={save}>Save Changes</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={del}>Delete Tracker</button>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
