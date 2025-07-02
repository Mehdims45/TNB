import { useState } from 'react';
import { useRouter } from 'next/router';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';

interface Props {
  open: boolean;
  onClose(): void;
  onSaved(id: string): void;
}

export default function AddTrackerModal({ open, onClose, onSaved }: Props) {
  const { supabase, user } = useAuth();
  const router = useRouter();
  const [asinOrUrl, setAsinOrUrl] = useState('');
  const [threshold, setThreshold] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [preview, setPreview] = useState<any>(null);

  const fetchInfo = async () => {
    const res = await fetch(`/api/proxy/get-product?url=${encodeURIComponent(asinOrUrl)}`);
    const data = await res.json();
    setPreview(data);
  };

  const save = async () => {
    const { data, error } = await supabase.from('trackers').insert({
      user_id: user?.id,
      marketplace: 'Amazon',
      asin: preview.asin,
      product_url: preview.url,
      title: preview.title,
      image_url: preview.image,
      threshold_price: Number(threshold) || null,
      cost_price: Number(costPrice) || null,
      last_checked_price: preview.price,
      price_history: [{ price: preview.price, date: new Date().toISOString() }]
    }).select().single();
    if (!error && data) {
      onSaved(data.id);
      onClose();
      router.push(`/trackers/${data.id}`);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl mb-4">Add New Tracker</h2>
      <input
        className="border p-2 w-full mb-2"
        placeholder="ASIN or URL"
        value={asinOrUrl}
        onChange={e => setAsinOrUrl(e.target.value)}
      />
      <div className="flex space-x-2">
        <input className="border p-2 w-full" placeholder="Threshold" value={threshold} onChange={e => setThreshold(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Cost" value={costPrice} onChange={e => setCostPrice(e.target.value)} />
      </div>
      <div className="my-2">
        <button className="bg-gold text-white px-4 py-2 rounded" onClick={fetchInfo}>Fetch Info</button>
      </div>
      {preview && (
        <div className="p-2 border my-2">
          <img src={preview.image} className="w-20" />
          <p>{preview.title}</p>
          <p>{preview.price_symbol}{preview.price}</p>
        </div>
      )}
      <div className="mt-4 flex justify-end">
        <button className="bg-navy text-white px-4 py-2 rounded" onClick={save}>Save Tracker</button>
      </div>
    </Modal>
  );
}
