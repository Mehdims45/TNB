import cron from 'node-cron';
import { createClient } from '@supabase/supabase-js';
import { sendAlert } from './notifications';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const scheduleTracking = () => {
  const expr = '0 * * * *'; // hourly for free
  cron.schedule(expr, async () => {
    const { data: trackers } = await supabase.from('trackers').select('*');
    if (!trackers) return;
    for (const t of trackers) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PROXY_URL}?asin=${t.asin}&domain=fr`);
      const d = await res.json();
      await supabase.from('trackers').update({
        last_checked_price: d.price,
        price_history: [...t.price_history, { price: d.price, date: new Date().toISOString() }],
        sales_rank_history: [...t.sales_rank_history, { rank: d.sales_rank, date: new Date().toISOString() }]
      }).eq('id', t.id);
      if ((t.threshold_price && d.price <= t.threshold_price) || d.limited_time_deal) {
        await sendAlert(t.user_id, d);
      }
    }
  });
};
