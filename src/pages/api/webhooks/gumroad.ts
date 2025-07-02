import { supabase } from '@/lib/supabaseClient';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const event = req.body;
  switch (event.event) {
    case 'purchase_created':
    case 'subscription_renewed':
      await supabase
        .from('users')
        .update({ status: 'active', valid_until: event.ends_at })
        .eq('email', event.email);
      break;
    case 'subscription_cancelled':
      await supabase
        .from('users')
        .update({ status: 'cancelled' })
        .eq('email', event.email);
      break;
  }
  res.status(200).end();
}
