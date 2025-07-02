import { useEffect, useRef } from 'react';
import Quagga from 'quagga';

export function Scanner({ onDetected }: { onDetected: (code: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    Quagga.init({
      inputStream: { type: 'LiveStream', target: ref.current },
      decoder: { readers: ['ean_reader'] }
    }, err => { if (!err) Quagga.start(); });
    Quagga.onDetected(data => onDetected(data.codeResult.code));
    return () => { Quagga.stop(); Quagga.offDetected(); };
  }, [onDetected]);

  return <div ref={ref} className="w-full h-64 bg-black" />;
}
