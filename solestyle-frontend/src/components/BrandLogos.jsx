
const BrandLogos = () => {
  const brands = ["NIKE", "ADIDAS", "PUMA", "REEBOK", "NEW BALANCE"];

  return (
    <section className="py-12 border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition duration-300">
        {brands.map((brand, index) => (
          <span key={index} className="text-2xl font-black italic tracking-widest text-gray-800">
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
};

export default BrandLogos;