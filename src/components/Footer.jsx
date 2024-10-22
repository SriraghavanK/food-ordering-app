import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Info, Briefcase, Users, HelpCircle, Phone, FileText } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faTruck, faClock } from '@fortawesome/free-solid-svg-icons'; // Import Font Awesome icons

const Footer = () => {
  return (
    <footer className="bg-[#1e2530] text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">SB FOODS</h2>
            <p className="text-sm">Delicious meals delivered to your doorstep</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter size={24} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
  <div>
    <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
    <ul className="space-y-2">
      <li className="flex items-center space-x-2">
        <Info className="w-4 h-4" />
        <Link to="/about" className="hover:text-white transition-colors">About</Link>
      </li>
      <li className="flex items-center space-x-2">
        <Briefcase className="w-4 h-4" />
        <Link to="/careers" className="hover:text-white transition-colors">Careers</Link>
      </li>
      <li className="flex items-center space-x-2">
        <Users className="w-4 h-4" />
        <Link to="/partners" className="hover:text-white transition-colors">Partners</Link>
      </li>
    </ul>
  </div>
  
  <div>
    <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
    <ul className="space-y-2">
      <li className="flex items-center space-x-2">
        <HelpCircle className="w-4 h-4" />
        <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
      </li>
      <li className="flex items-center space-x-2">
        <Phone className="w-4 h-4" />
        <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
      </li>
      <li className="flex items-center space-x-2">
        <FileText className="w-4 h-4" />
        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
      </li>
    </ul>
  </div>
</div>


          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">NM Team Members</h3>
            <ul class="list-group list-group-flush">
  <li class="list-group-item">SRI RAGHAVAN K - Team Leader</li>
  <li class="list-group-item">SRI MANJUNATH R</li>
  <li class="list-group-item">VIGNESH M</li>
  <li class="list-group-item">RAJA E</li>

</ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-wrap justify-between items-center">
          <p className="text-sm">&copy; 2024 SB FOODS All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faUtensils} size="lg" />
              <span className="text-sm">100+ Restaurants</span>
            </div>
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faTruck} size="lg" />
              <span className="text-sm">Fast Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faClock} size="lg" />
              <span className="text-sm">24/7 Service</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
