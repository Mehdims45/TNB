import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Quagga from 'quagga';
import { useRouter } from 'next/router';

export default function Scan() {
  const router = useRouter();

  useEffect(() => {
    Quagga.init({ inputStream: { name: 'Live', type: 'LiveStream' }, decoder: { readers: ['ean_reader'] } }, err => {
      if (err) return;
      Quagga.start();
    });
    Quagga.onDetected(data => {
      const code = data.codeResult.code;
      router.push(`/dashboard?add=${code}`);
    });
    return () => { Quagga.stop(); };
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4">
        <div id="scanner" className="w-full h-96 bg-gray-200" />
      </main>
      <Footer />
    </div>
  );
}
