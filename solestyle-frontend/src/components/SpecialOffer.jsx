import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { unwrapList } from '../api/endpoints';

const SpecialOffer = () => {
  // Backend theke active banner load kora — admin panel theke change kora jay
  const { data } = useFetch('promo-banners/', { is_active: true });
  const banner = unwrapList(data)?.[0];

  // Banner na thakle section hide korbe
  if (!banner) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 my-16">
      <div className="relative rounded-2xl overflow-hidden bg-gray-900 text-white p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-lg z-10">
          <span className="text-red-500 font-bold uppercase tracking-widest text-xs">{banner.title}</span>
          <h2 className="text-3xl md:text-5xl font-black leading-tight">
            {banner.heading}
          </h2>
          {banner.description && (
            <p className="text-gray-400 text-sm">{banner.description}</p>
          )}
          <div className="pt-2">
            <Link
              to={banner.button_link || '/shop'}
              className="inline-block bg-white text-black font-bold px-8 py-3.5 rounded-lg hover:bg-gray-200 transition tracking-wider text-sm"
            >
              {banner.button_text || 'SHOP NOW'}
            </Link>
          </div>
        </div>

        <div className="relative w-full md:w-1/2 flex justify-center">
          <img
            src={banner.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=700'}
            alt={banner.heading}
            className="w-full max-w-md object-contain transform -rotate-12 hover:rotate-0 transition duration-500 drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default SpecialOffer;