import React from "react";
import {
  Truck,
  Utensils,
  Clock,
  Users,
  Award,
  Globe,
  Leaf,
  Shield,
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-white -mt-8 -ms-8 -me-8 -mb-8">
      <header className="bg-[#e9ebec] text-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">About SRV FOODS</h1>
          <p className="text-xl">Delivering happiness, one meal at a time.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded in 2020, SRV FOODS was born out of a simple idea: to connect
            food lovers with their favorite local restaurants, making delicious
            meals accessible to everyone, anytime, anywhere.
          </p>
          <p className="text-gray-600 mb-4">
            What started as a small startup has now grown into a thriving
            platform, serving thousands of customers daily across multiple
            cities. Our journey has been fueled by our passion for food and our
            commitment to supporting local businesses.
          </p>
          <p className="text-gray-600 mb-4">
            From our humble beginnings with just a handful of restaurant
            partners, we've expanded to collaborate with hundreds of eateries,
            ranging from beloved local diners to trendy fusion cuisines. Our
            dedicated team has grown from a small group of food enthusiasts to a
            diverse workforce of tech experts, logistics specialists, and
            customer service professionals, all united by our love for great
            food and exceptional service.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            What Sets Us Apart
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Truck className="w-12 h-12 text-orange-500" />}
              title="Fast Delivery"
              description="Our efficient network ensures your food arrives hot and fresh."
            />
            <FeatureCard
              icon={<Utensils className="w-12 h-12 text-orange-500" />}
              title="Wide Selection"
              description="From local gems to popular chains, we've got all your cravings covered."
            />
            <FeatureCard
              icon={<Clock className="w-12 h-12 text-orange-500" />}
              title="24/7 Service"
              description="Hungry at 2 AM? We've got you covered round the clock."
            />
            <FeatureCard
              icon={<Users className="w-12 h-12 text-orange-500" />}
              title="Community Focus"
              description="We support local restaurants and give back to our communities."
            />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ValueCard
              icon={<Award className="w-8 h-8 text-orange-500" />}
              title="Quality First"
              description="We partner only with the best restaurants to ensure top-notch food quality."
            />
            <ValueCard
              icon={<Globe className="w-8 h-8 text-orange-500" />}
              title="Local Impact"
              description="By supporting local eateries, we help strengthen local economies."
            />
            <ValueCard
              icon={<Leaf className="w-8 h-8 text-orange-500" />}
              title="Sustainability"
              description="We're committed to reducing our environmental impact through eco-friendly practices."
            />
            <ValueCard
              icon={<Shield className="w-8 h-8 text-orange-500" />}
              title="Trust & Safety"
              description="Your safety and satisfaction are our top priorities in every order."
            />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            At SRV FOODS, our mission is to revolutionize the way people
            experience food delivery. We strive to create a seamless connection
            between restaurants and food lovers, empowering local businesses and
            satisfying cravings with just a few taps.
          </p>
          <p className="text-gray-600 mb-4">
            We're committed to innovation, exceptional service, and fostering a
            love for diverse cuisines. Our goal is not just to deliver food, but
            to deliver experiences, bringing the joy of restaurant-quality meals
            to homes, offices, and gatherings across the nation.
          </p>
          <p className="text-gray-600">
            Join us in our journey to make every meal an unforgettable
            experience, support local culinary talents, and build stronger, more
            connected communities through the power of food!
          </p>
        </section>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const ValueCard = ({ icon, title, description }) => {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default About;
