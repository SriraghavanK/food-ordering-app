import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, User, AtSign, FileText, Send, Clock } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({ name: '', email: '', subject: '', message: '' });
    alert('Thank you for your message. We will get back to you soon!');
  };

  return (
    <div className="min-h-screen bg-white -mt-8 -ms-8 -me-8 -mb-8">
      <header className="bg-[#e9ebec] text-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl">We're here to help and answer any question you might have</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Get in Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-md shadow-sm">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <User className="inline-block mr-2 text-orange-500" size={18} />
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <AtSign className="inline-block mr-2 text-orange-500" size={18} />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FileText className="inline-block mr-2 text-orange-500" size={18} />
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <MessageSquare className="inline-block mr-2 text-orange-500" size={18} />
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-150"
                >
                  <Send className="mr-2" size={18} />
                  Send Message
                </button>
              </div>
            </form>
          </div>
          <div>
            <div className="bg-white p-8 rounded-md shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Information</h2>
              <div className="space-y-6">
                <ContactInfo icon={<Phone className="text-orange-500" size={24} />} title="Phone" content="+1 (555) 123-4567" />
                <ContactInfo icon={<Mail className="text-orange-500" size={24} />} title="Email" content="support@SBFOODS.com" />
                <ContactInfo icon={<MapPin className="text-orange-500" size={24} />} title="Address" content="123 Delivery St, Chennai, 600001" />
                <ContactInfo icon={<MessageSquare className="text-orange-500" size={24} />} title="Live Chat" content="Available 24/7 in our app" />
              </div>
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                  <Clock className="inline-block mr-2 text-orange-500" size={20} />
                  Hours of Operation
                </h3>
                <p className="text-gray-600">
                  Our customer support team is available:
                  <br />
                  Monday - Friday: 8am - 10pm
                  <br />
                  Saturday - Sunday: 9am - 8pm
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const ContactInfo = ({ icon, title, content }) => {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 text-orange-500">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600">{content}</p>
      </div>
    </div>
  );
};

export default Contact;