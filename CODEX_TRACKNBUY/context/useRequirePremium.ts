import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from './AuthContext';

export const useRequirePremium = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const valid = user.status === 'active' && user.valid_until && new Date(user.valid_until) > new Date();
    if (!valid) router.push('/subscription');
  }, [user, router]);
};
