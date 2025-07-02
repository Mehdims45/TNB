import Head from 'next/head';
import { useState } from 'react';
import AddTrackerModal from '../components/AddTrackerModal';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>TracknBuy</title>
      </Head>
      <Header />
      <main className="flex-1 p-4 text-center">
        <h1 className="text-3xl mb-4">Welcome to TracknBuy</h1>
        <button className="bg-gold text-white px-4 py-2 rounded" onClick={() => setOpen(true)}>
          Add New Tracker
        </button>
        <div className="mt-4">
          <a href="/scan" className="text-gold underline">Scan Barcode</a>
        </div>
      </main>
      <Footer />
      <AddTrackerModal open={open} onClose={() => setOpen(false)} onSaved={() => {}} />
    </div>
  );
}
