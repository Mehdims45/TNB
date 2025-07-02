import cron from 'node-cron';
import { createClient } from '@supabase/supabase-js';
import { sendAlert } from './notifications';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const scheduleTracking = () => {
  const expr = '*/10 * * * *'; // run every 10 minutes
  cron.schedule(expr, async () => {
    const now = new Date();
    const { data: trackers } = await supabase.from('trackers').select('*, users!inner(status, valid_until)');
    if (!trackers) return;
    for (const t of trackers as any[]) {
      const isPremium = t.users.status === 'active' && t.users.valid_until && new Date(t.users.valid_until) > now;
      if (!isPremium && now.getMinutes() !== 0) continue; // free users hourly
      const res = await fetch(`${process.env.NEXT_PUBLIC_PROXY_URL}?asin=${t.asin}&domain=fr`);
      const d = await res.json();
      await supabase.from('trackers').update({
        last_checked_price: d.price,
        price_history: [...t.price_history, { price: d.price, date: now.toISOString() }],
        sales_rank_history: [...t.sales_rank_history, { rank: d.sales_rank, date: now.toISOString() }]
      }).eq('id', t.id);
      if ((t.threshold_price && d.price <= t.threshold_price) || d.limited_time_deal) {
        await sendAlert(t.user_id, d);
      }
    }
  });
};
