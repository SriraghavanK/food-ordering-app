import React from 'react';
import { Briefcase, Users, Rocket, Heart } from 'lucide-react';

const Careers = () => {
  return (
    <div className="min-h-screen bg-white -mt-8 -ms-8 -me-8 -mb-8">
      <header className="bg-[#e9ebec] text-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Careers at SB FOODS</h1>
          <p className="text-xl">Join us in revolutionizing food delivery!</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Why Join Us?</h2>
          <p className="text-gray-600 mb-4">
            At SB FOODS, we're more than just a food delivery service. We're a team of passionate individuals working together to transform the way people experience food. Our fast-paced, innovative environment offers exciting opportunities for growth and development.
          </p>
          <p className="text-gray-600 mb-4">
            We believe in fostering a culture of creativity, collaboration, and continuous learning. When you join SB FOODS, you become part of a diverse family that values your unique skills and perspectives.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ValueCard
              icon={<Briefcase className="w-8 h-8 text-orange-500" />}
              title="Innovation"
              description="We encourage fresh ideas and out-of-the-box thinking to solve complex challenges."
            />
            <ValueCard
              icon={<Users className="w-8 h-8 text-orange-500" />}
              title="Teamwork"
              description="We believe in the power of collaboration and support each other to achieve common goals."
            />
            <ValueCard
              icon={<Rocket className="w-8 h-8 text-orange-500" />}
              title="Growth"
              description="We provide opportunities for personal and professional development at every level."
            />
            <ValueCard
              icon={<Heart className="w-8 h-8 text-orange-500" />}
              title="Customer Focus"
              description="We're dedicated to delivering exceptional experiences for our customers and partners."
            />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Open Positions</h2>
          <div className="space-y-6">
            <JobCard
              title="Software Engineer"
              department="Technology"
              location="Remote"
              description="We're looking for talented software engineers to help build and scale our platform."
            />
            <JobCard
              title="UX Designer"
              department="Design"
              location="New York, NY"
              description="Join our design team to create intuitive and delightful user experiences."
            />
            <JobCard
              title="Operations Manager"
              department="Operations"
              location="Chicago, IL"
              description="Help optimize our delivery network and ensure smooth operations across the city."
            />
            <JobCard
              title="Marketing Specialist"
              department="Marketing"
              location="Los Angeles, CA"
              description="Drive growth and engagement through innovative marketing strategies."
            />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">How to Apply</h2>
          <p className="text-gray-600 mb-4">
            Ready to take the next step in your career? We'd love to hear from you! To apply for any of our open positions, please send your resume and a cover letter to <a href="mailto:careers@SBFOODS.com" className="text-orange-500 hover:underline">careers@SBFOODS.com</a>.
          </p>
          <p className="text-gray-600">
            In your cover letter, please specify the position you're applying for and tell us why you think you'd be a great fit for the SB FOODS team. We look forward to getting to know you!
          </p>
        </section>
      </main>
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

const JobCard = ({ title, department, location, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <div className="flex space-x-4 mb-2">
        <span className="text-sm text-gray-500">{department}</span>
        <span className="text-sm text-gray-500">{location}</span>
      </div>
      <p className="text-gray-600">{description}</p>
      <button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors">
        Apply Now
      </button>
    </div>
  );
};

export default Careers;