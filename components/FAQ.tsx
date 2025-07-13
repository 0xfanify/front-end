'use client';

import React, { useState } from 'react';
import { Plus, Minus, HelpCircle, Twitter } from 'lucide-react';

const FAQ = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqItems = [
    {
      id: 1,
      question: "What is $HYPE?",
      answer:
        "$HYPE is the token you use to bet within Fanify. It's generated when you stake CHZ or Fan Tokens and has value pegged to the US dollar (USD).",
    },
    {
      id: 2,
      question: "What's the difference between staking CHZ and Fan Tokens?",
      answer:
        "CHZ: Simple betting, you can bet on any game and withdraw later. Fan Token: Loyal betting, only on your team and only throughout the season — but with more bonuses and rewards.",
    },
    {
      id: 3,
      question: "What happens if I lose my bet?",
      answer:
        "If you bet with $HYPE and lost, that value is burned. If you lose everything, you won't be able to unstake your CHZ. With Fan Token staking, you only bet if you want to — you can hold the $HYPE and avoid risks.",
    },
    {
      id: 4,
      question: "Can I exchange $HYPE for another token?",
      answer:
        "Not directly. $HYPE is an internal token, designed for exclusive use within the platform (betting and rewards). You can only convert it back to CHZ or USD via unstaking at the end of each cycle (game or season).",
    },
    {
      id: 5,
      question: "Is it safe to bet on Fanify?",
      answer:
        "Yes! All betting logic and staking runs on auditable smart contracts, 100% transparent. Odds are generated based on social hype validated by decentralized oracles — no human manipulation.",
    },
    {
      id: 6,
      question: "Can I bet without having Fan Tokens?",
      answer:
        "Yes. If you just want to test or bet without being tied to a team, stake CHZ and use $HYPE to play freely.",
    },
    {
      id: 7,
      question: "What do I gain from Fan Token staking?",
      answer:
        "+50% bonus in $HYPE, yield rewards based on your team's performance, and participation in exclusive events and 'Season Fan' status.",
    },
    {
      id: 8,
      question: "How long does Fan Token staking last?",
      answer:
        "It stays locked until the end of your team's official season. After that, you can withdraw your tokens + accumulated rewards.",
    },
    {
      id: 9,
      question: "Which teams can I bet on?",
      answer:
        "All clubs with official Fan Tokens on Chiliz Chain are eligible. And new leagues and teams are being integrated constantly.",
    },
  ];  

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6">
            Frequently Asked <span className="text-brand-500">Questions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about Fanify
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full text-left p-6 flex justify-between items-center hover:bg-gray-50"
              >
                <h3 className="text-lg font-bold text-gray-900 pr-4">
                  {item.question}
                </h3>
                <div className="flex-shrink-0">
                  {openItem === item.id ? (
                    <Minus className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-600" />
                  )}
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-200 ${
                openItem === item.id ? 'max-h-96' : 'max-h-0'
              }`}>
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-100 pt-4">
                  <p className="text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Our team is here to help you
          </p>
          <button className="px-8 py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;