const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-display text-4xl font-bold text-gray-900 mb-6">
        About Stride
      </h1>
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>
          Welcome to <span className="font-bold text-gray-900">Stride</span> —
          your one-stop online store for quality products at great prices.
        </p>
        <p>
          We started with a simple goal: make online shopping easy, trustworthy
          and enjoyable. From the latest arrivals to everyday essentials, every
          product is hand-checked by our team before it reaches your door.
        </p>
        <div className="grid gap-6 sm:grid-cols-3 mt-10">
          <div className="border rounded-2xl p-6 text-center">
            <p className="text-3xl font-black text-primary-600">100%</p>
            <p className="text-sm text-gray-500 mt-1">Genuine Products</p>
          </div>
          <div className="border rounded-2xl p-6 text-center">
            <p className="text-3xl font-black text-primary-600">৳5000+</p>
            <p className="text-sm text-gray-500 mt-1">Free Shipping</p>
          </div>
          <div className="border rounded-2xl p-6 text-center">
            <p className="text-3xl font-black text-primary-600">24/7</p>
            <p className="text-sm text-gray-500 mt-1">Customer Support</p>
          </div>
        </div>
        <p className="mt-8">
          Have questions? Reach out any time — we're always happy to help.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
