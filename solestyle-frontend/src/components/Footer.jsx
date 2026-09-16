import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-400 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-white tracking-wide">
              SOLE<span className="text-primary-400">STYLE</span>
            </h3>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            The ultimate footwear destination. Quality, comfort, and unmatched style delivered right to your doorstep.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-wider">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/shop" className="hover:text-white transition">Shop All</Link></li>
            <li><Link to="/cart" className="hover:text-white transition">Shopping Cart</Link></li>
            <li><Link to="/wishlist" className="hover:text-white transition">My Wishlist</Link></li>
            <li><Link to="/orders" className="hover:text-white transition">My Orders</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-wider">Customer Care</h4>
          <ul className="space-y-2.5 text-sm">
            <li className="hover:text-white cursor-pointer transition">Contact Us</li>
            <li className="hover:text-white cursor-pointer transition">Shipping & Delivery</li>
            <li className="hover:text-white cursor-pointer transition">Returns & Exchanges</li>
            <li className="hover:text-white cursor-pointer transition">Privacy Policy</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-wider">Contact Info</h4>
          <p className="text-sm">Dhaka, Bangladesh</p>
          <p className="text-sm mt-1">Email: support@solestyle.com</p>
          <p className="text-sm mt-1">Phone: +880 1700-000000</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-500 mt-12 pt-6 border-t border-gray-800">
        © {new Date().getFullYear()} SoleStyle. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;