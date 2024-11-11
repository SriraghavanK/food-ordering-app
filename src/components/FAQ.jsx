import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqData = [
    {
      question: "How does SRV FOODS work?",
      answer:
        "SRV FOODS is a food delivery platform that connects you with local restaurants. Simply browse restaurants, select your items, place your order, and track it in real-time. Our delivery partners will bring the food right to your doorstep.",
    },
    {
      question: "What are the delivery fees?",
      answer:
        "Delivery fees vary depending on the restaurant's distance and other factors. The exact fee will be displayed before you place your order. We also offer a subscription service, SRV FOODS, which provides free delivery on eligible orders.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Delivery times vary depending on the restaurant's preparation time, distance, and current demand. You can see the estimated delivery time for each restaurant when browsing. Once you place an order, you'll get a more accurate estimated delivery time.",
    },
    {
      question: "Can I schedule an order in advance?",
      answer:
        "Yes! You can schedule orders up to 7 days in advance. Just select the 'Schedule' option during checkout and choose your preferred date and time.",
    },
    {
      question: "What if there's an issue with my order?",
      answer:
        "If you encounter any issues with your order, please contact our customer support team through the app or website. We're here to help and will work to resolve any problems as quickly as possible.",
    },
    {
      question: "How do I become a delivery partner?",
      answer:
        "To become a delivery partner, visit our 'Become a Driver' page and fill out the application form. You'll need to meet certain requirements, including age, vehicle, and background check criteria.",
    },
    {
      question: "Do you offer vegetarian or vegan options?",
      answer:
        "Yes! Many restaurants on our platform offer vegetarian and vegan options. You can use filters when browsing to show only vegetarian or vegan-friendly restaurants and menu items.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can contact our customer support team through the app or website by going to the 'Help' section. We also offer 24/7 chat support for immediate assistance.",
    },
  ];

  const filteredFAQs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white -mt-8 -ms-8 -me-8 -mb-8">
      <header className="bg-[#e9ebec] text-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl">
            Find answers to common questions about SRV FOODS
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute right-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-md">
              <button
                className="flex justify-between items-center w-full px-4 py-3 text-left"
                onClick={() =>
                  setOpenQuestion(openQuestion === index ? null : index)
                }
              >
                <span className="font-semibold text-gray-800">
                  {faq.question}
                </span>
                {openQuestion === index ? (
                  <ChevronUp className="text-orange-500" size={20} />
                ) : (
                  <ChevronDown className="text-orange-500" size={20} />
                )}
              </button>
              {openQuestion === index && (
                <div className="px-4 py-3 bg-gray-50 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <p className="text-center text-gray-600 mt-8">
            No FAQs found matching your search. Please try a different term or
            browse our full list of questions.
          </p>
        )}

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Can't find the answer you're looking for?
          </p>
          <a
            href="/contact"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Contact Support
          </a>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
