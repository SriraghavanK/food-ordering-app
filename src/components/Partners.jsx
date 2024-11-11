import React from "react";
import { ShoppingBag, TrendingUp, Zap, Shield } from "lucide-react";

const Partners = () => {
  return (
    <div className="min-h-screen bg-white -mt-8 -ms-8 -me-8 -mb-8">
      <header className="bg-[#e9ebec] text-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Partner with SRV FOODS</h1>
          <p className="text-xl">
            Grow your business with the leading food delivery platform
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Why Partner with Us?
          </h2>
          <p className="text-gray-600 mb-4">
            Joining SRV FOODS as a restaurant partner opens up a world of
            opportunities for your business. We provide the technology, support,
            and customer base to help you reach more diners and grow your
            revenue.
          </p>
          <p className="text-gray-600 mb-4">
            Our platform is designed to seamlessly integrate with your existing
            operations, making it easy to manage orders, track performance, and
            optimize your delivery service.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Benefits of Partnership
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BenefitCard
              icon={<ShoppingBag className="w-12 h-12 text-orange-500" />}
              title="Increased Orders"
              description="Tap into our large and growing customer base to boost your order volume."
            />
            <BenefitCard
              icon={<TrendingUp className="w-12 h-12 text-orange-500" />}
              title="Business Growth"
              description="Expand your reach and grow your business with our marketing and promotional tools."
            />
            <BenefitCard
              icon={<Zap className="w-12 h-12 text-orange-500" />}
              title="Efficient Operations"
              description="Streamline your delivery process with our user-friendly restaurant dashboard."
            />
            <BenefitCard
              icon={<Shield className="w-12 h-12 text-orange-500" />}
              title="Reliable Support"
              description="Get dedicated support from our partner success team to help you succeed."
            />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            How It Works
          </h2>
          <ol className="list-decimal list-inside space-y-4 text-gray-600">
            <li>Sign up as a partner on our platform</li>
            <li>Set up your menu and pricing</li>
            <li>
              Receive orders through our easy-to-use tablet or integrate with
              your POS system
            </li>
            <li>Prepare the food for pickup by our delivery partners</li>
            <li>Track your performance and grow your business</li>
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Join SRV FOODS Today
          </h2>
          <p className="text-gray-600 mb-4">
            Ready to take your restaurant to the next level? Joining SRV FOODS
            is quick and easy. Fill out the form below, and one of our partner
            specialists will get in touch with you to guide you through the
            onboarding process.
          </p>
          <form className="max-w-lg">
            <div className="mb-4">
              <label
                htmlFor="restaurant-name"
                className="block text-gray-700 font-bold mb-2"
              >
                Restaurant Name
              </label>
              <input
                type="text"
                id="restaurant-name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="contact-name"
                className="block text-gray-700 font-bold mb-2"
              >
                Contact Name
              </label>
              <input
                type="text"
                id="contact-name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-bold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-gray-700 font-bold mb-2"
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Submit Application
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

const BenefitCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Partners;
