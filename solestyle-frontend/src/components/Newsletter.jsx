import { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
    setEmail('');
  };

  return (
    <section className="py-20 bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
        <h2 className="font-display text-3xl font-bold tracking-tight text-white">
          Ready to Step Up Your Game?
        </h2>
        <p className="text-gray-400 text-sm">
          Join our community and get 15% off your first order. Plus early access
          to new releases and exclusive member-only deals.
        </p>
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 bg-white/5 border border-white/10 px-4 py-3 rounded-full text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            required
          />
          <button
            type="submit"
            className="bg-primary-600 text-white font-bold px-8 py-3 rounded-full hover:bg-primary-700 transition text-sm shadow-lg shadow-primary-600/30"
          >
            Get 15% Off
          </button>
        </form>
        <p className="text-xs text-gray-500">No spam, ever. Unsubscribe anytime.</p>
      </div>
    </section>
  );
};

export default Newsletter;