import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { action } = req.query;
  const { email } = req.body;

  const { data: user } = await supabase.from('users').select('*').eq('email', email).single();
  if (!user) return res.status(404).end();

  if (req.method === 'POST') {
    const event = req.body.event || req.body;
    if (event === 'purchase_created' || event === 'subscription_renewed') {
      const valid = new Date();
      valid.setMonth(valid.getMonth() + 1);
      await supabase.from('users').update({ status: 'active', valid_until: valid.toISOString() }).eq('id', user.id);
    }
    if (event === 'subscription_cancelled' || action === 'cancel') {
      await supabase.from('users').update({ status: 'cancelled' }).eq('id', user.id);
    }
    res.status(200).end();
  } else {
    res.status(405).end();
  }
}
