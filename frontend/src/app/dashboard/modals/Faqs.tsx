// app/Faqs.tsx
"use client";
import { useState } from "@/shared/common";
import { AdditionIcon, SubtractionIcon } from "@/shared/allIcons";

export const Faqs = () => {
  const tabs = [
    { id: 1, title: "Booking", items: content.booking },
    { id: 2, title: "Referral", items: content.referral },
    { id: 3, title: "Disbursement", items: content.disbursement },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div id="faqs" className="p-6 max-bp:px-5 max-w-[1200px] mx-auto">
      <div className="text-center col-4">
        <h2 className="inter-xl-bold-mb-500 bp:5xl sm:text-3xl">
          {content.heading}
        </h2>
        {/* tabs */}
        <div className="justify-center w-full row-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-2 px-4 text-xs lg:text-base font-medium rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-pry-500 text-white "
                  : "bg-mb-50 text-mb-300"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.title}
            </button>
          ))}
        </div>
        {/* tabs */}
      </div>

      <div className="mt-9 w-full">
        <FaqList
          items={tabs.find((tab) => tab.id === activeTab)?.items || []}
        />
      </div>
    </div>
  );
};

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

interface FaqListProps {
  items: FaqItem[];
}

export const FaqList: React.FC<FaqListProps> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="w-full">
      {items.map((item, index) => (
        <div className="bg-white mb-6 w-full" key={item.id || item.question}>
          <button
            onClick={() => toggleAccordion(index)}
            className={`w-full row-4 py-6 px-8 text-left transition-all ease-in-out duration-500 justify-between items-center ${
              activeIndex === index
                ? "bg-pry-500 inter-xl-bold-white max-bp:text-base"
                : "bg-mb-50/50 rounded-lg inter-xl-bold-mb-500 max-bp:text-base"
            }`}
          >
            <span>{item.question}</span>
            <div className="w-fit">
              {activeIndex === index ? <SubtractionIcon /> : <AdditionIcon />}
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all ease-in-out duration-300 ${
              activeIndex === index ? "max-h-screen" : "max-h-0"
            }`}
          >
            <p className="py-4 px-6 bg-white border border-stroke inter-lg-normal-mb-300 max-bp:text-sm">
              {item.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const content = {
  heading: "Frequently Asked Questions",
  booking: [
    {
      id: 1,
      question: "How do Qurbaan's monthly cow shares work?",
      answer:
        "Qurbaan offers a unique model where you can purchase a portion (slot) of a cow, suitable for your household's monthly consumption or event needs. This makes high-quality beef affordable without buying an entire animal.",
    },
    {
      id: 2,
      question: "What are the prices for cow shares?",
      answer:
        "A slot in the monthly share costs #30,000. As for the eid cow sharing slots, the costs will be unveiled months to the next eid. Both include processing and delivery or pickup.",
    },
    {
      id: 3,
      question: "Can I use Qurbaan for my events or food business?",
      answer:
        "Absolutely! Our monthly cow shares are perfect for events requiring considerable meat, and we offer tailored solutions for food businesses, ensuring consistent supply and quality. Contact us for B2B inquiries.",
    },
    {
      id: 4,
      question: "How do I book a slot?",
      answer:
        "Simply create an account, complete your profile, and choose your preferred package (Basic or Standard) and the number of slots needed. Then, select your delivery or pickup option.",
    },
    {
      id: 5,
      question: "When does booking for Eid cow sharing close?",
      answer:
        "All Eid Udhiyah bookings close by 7:00 PM on the Day of Eid. Monthly shares can be booked anytime.",
    },
    {
      id: 7,
      question: "Can I cancel or modify my booking after payment?",
      answer:
        "No. Once payment is confirmed, bookings are final and non-refundable. This ensures efficient allocation and processing.",
    },
    {
      id: 8,
      question:
        "During payment, I was prompted to pay to 'Evolace FLW'. Should I be worried?",
      answer:
        "No need to worry! Evolace is our official business account on Flutterwave, our secure payment partner. Your payment is safe and accounted for.",
    },
  ],

  referral: [
    {
      id: 1,
      question: "How does the referral system work?",
      answer:
        "Each user gets a unique referral code after creating an account. When someone books their first slot with your code, you become eligible for a reward.",
    },
    {
      id: 2,
      question: "How much do I earn per referral?",
      answer:
        "You earn ₦2,000 for each person who uses your referral code and successfully pays for their first booking. Only the first booking qualifies for referral rewards.",
    },
    {
      id: 3,
      question: "Where can I see my referral earnings?",
      answer:
        "Your total referral earnings are displayed on your dashboard, updated automatically after each successful referred booking.",
    },
    {
      id: 4,
      question: "When and how will I get paid?",
      answer:
        "Referral payouts are processed monthly. Your earnings will be transferred to the bank account you provided on your profile. Make sure your account details are correct to avoid delays.",
    },
  ],
  disbursement: [
    {
      id: 1,
      question: "What happens after I book and pay?",
      answer:
        "Once you've paid, your meat slot(s) are secured. Qurbaan handles all sourcing, slaughtering, processing, and packaging. Just relax and wait for pickup or delivery based on your schedule.",
    },
    {
      id: 2,
      question: "How is the meat distributed?",
      answer:
        "For monthly shares, distribution is done during the last week of the month. For Eid, we begin distributing meat from the day of Eid based. You’ll be notified when your order is ready for pickup or out for delivery.",
    },
    {
      id: 3,
      question: "Can I choose delivery or pickup?",
      answer:
        "Yes. During booking, you’ll select whether you want your share delivered to your specified address or prefer to pick it up from our designated locations.",
    },
    {
      id: 6,
      question: "Who is responsible for the slaughtering and processing?",
      answer:
        "Qurbaan handles it all — we source, process, and portion the meat based on the number of slots you booked. It’s completely stress-free for you.",
    },
  ],
};
