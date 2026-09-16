import { Link } from "react-router-dom";

const CtaBanner = () => {
  return (
    <section className="relative overflow-hidden bg-primary-600 py-20 lg:py-28">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute -right-20 top-0 h-[400px] w-[400px] rounded-full bg-primary-500/50 blur-[100px]" />
        <div className="absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full bg-primary-700/50 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 text-center lg:px-8">
        <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">
          Ready to Step Up Your Game?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
          Join the SoleStyle community and get 15% off your first order. Plus,
          early access to new releases and exclusive member-only deals.
        </p>

        <div className="mx-auto mt-10 flex max-w-md flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/shop"
            className="rounded-full bg-white px-8 py-4 font-semibold text-primary-600 shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl"
          >
            Shop New Arrivals
          </Link>
          <Link
            to="/shop"
            className="rounded-full border-2 border-white/30 px-8 py-4 font-semibold text-white transition-all hover:bg-white/10"
          >
            Browse Collection
          </Link>
        </div>

        {/* App Store Badges */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="text-sm font-medium text-white">Download Our App</p>
          <div className="flex gap-4">
            <a
              href="#"
              className="flex items-center gap-2 rounded-xl bg-black/30 px-4 py-2.5 transition-colors hover:bg-black/50"
            >
              <svg
                className="h-7 w-7 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-gray-300">Download on the</div>
                <div className="text-sm font-semibold text-white">
                  App Store
                </div>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 rounded-xl bg-black/30 px-4 py-2.5 transition-colors hover:bg-black/50"
            >
              <svg
                className="h-6 w-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-gray-300">Get it on</div>
                <div className="text-sm font-semibold text-white">
                  Google Play
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
