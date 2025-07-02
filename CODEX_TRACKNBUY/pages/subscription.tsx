import { useRequirePremium } from '../context/useRequirePremium';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function Subscription() {
  const { user } = useAuth();
  const isPremium = user && user.status === 'active' && user.valid_until && new Date(user.valid_until) > new Date();
  useRequirePremium();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 text-center">
        {isPremium ? (
          <div>
            <p>Your subscription is valid until {user!.valid_until}</p>
            <form method="POST" action="/api/webhooks/gumroad?action=cancel">
              <button className="bg-red-500 text-white px-4 py-2 rounded">Cancel Subscription</button>
            </form>
          </div>
        ) : (
          <a href={process.env.GUMROAD_CHECKOUT_URL} className="bg-gold text-white px-4 py-2 rounded">
            Upgrade Now
          </a>
        )}
      </main>
      <Footer />
    </div>
  );
}
