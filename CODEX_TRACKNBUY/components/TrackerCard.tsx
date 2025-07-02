import Link from 'next/link';

interface Props {
  tracker: any;
}

export default function TrackerCard({ tracker }: Props) {
  return (
    <div className="border p-4 rounded-2xl flex items-center space-x-4">
      <img src={tracker.image_url || tracker.image} className="w-20" />
      <div className="flex-1">
        <h3 className="font-bold">{tracker.title}</h3>
        <p>Last price: {tracker.last_checked_price}</p>
      </div>
      <Link href={`/trackers/${tracker.id}`} className="text-gold">View</Link>
    </div>
  );
}
