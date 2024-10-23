import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Book, RefreshCw, Shield, UserCircle, Check, Copyright, XCircle, Scale, Globe, HelpCircle } from 'lucide-react';

const Terms = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing or using the SB FOODS platform, including our website, mobile application, and services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.',
      icon: <Book className="text-orange-500" size={24} />
    },
    {
      title: '2. Changes to Terms',
      content: 'We reserve the right to modify these Terms at any time. We will always post the most current version on our website. By continuing to use the Service after changes become effective, you agree to be bound by the revised Terms.',
      icon: <RefreshCw className="text-orange-500" size={24} />
    },
    {
      title: '3. Privacy Policy',
      content: 'Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices.',
      icon: <Shield className="text-orange-500" size={24} />
    },
    {
      title: '4. User Accounts',
      content: 'To use certain features of the Service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.',
      icon: <UserCircle className="text-orange-500" size={24} />
    },
    {
      title: '5. Use of the Service',
      content: 'You agree to use the Service only for lawful purposes and in accordance with these Terms. You are prohibited from using the Service in any way that could damage, disable, overburden, or impair our servers or networks, or interfere with any other partys use and enjoyment of the Service.',
      icon: <Check className="text-orange-500" size={24} />
    },
    {
      title: '6. Intellectual Property',
      content: 'The Service and its original content, features, and functionality are owned by SB FOODS and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.',
      icon: <Copyright className="text-orange-500" size={24} />
    },
    {
      title: '7. Termination',
      content: 'We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.',
      icon: <XCircle className="text-orange-500" size={24} />
    },
    {
      title: '8. Limitation of Liability',
      content: 'In no event shall SB FOODS, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.',
      icon: <Scale className="text-orange-500" size={24} />
    },
    {
      title: '9. Governing Law',
      content: 'These Terms shall be governed and construed in accordance with the laws of [TamilNadu/Chennai], without regard to its conflict of law provisions.',
      icon: <Globe className="text-orange-500" size={24} />
    },
    {
      title: '10. Contact Us',
      content: 'If you have any questions about these Terms, please contact us at legal@SBFOODS.com.',
      icon: <HelpCircle className="text-orange-500" size={24} />
    }
  ];

  return (
    <div className="min-h-screen bg-white -mt-8 -ms-8 -me-8 -mb-8">
      <header className="bg-[#e9ebec] text-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl">Please read these terms carefully before using SB FOODS</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-sm rounded-md overflow-hidden">
          {sections.map((section, index) => (
            <div key={index} className="border-b border-gray-200 last:border-b-0">
              <button
                className="flex justify-between items-center w-full px-6 py-4 text-left focus:outline-none"
                onClick={() => toggleSection(index)}
              >
                <div className="flex items-center space-x-3">
                  {section.icon}
                  <h2 className="text-lg font-semibold text-gray-800">{section.title}</h2>
                </div>
                {expandedSection === index ? (
                  <ChevronUp className="text-orange-500" size={20} />
                ) : (
                  <ChevronDown className="text-orange-500" size={20} />
                )}
              </button>
              {expandedSection === index && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-600">{section.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Terms;