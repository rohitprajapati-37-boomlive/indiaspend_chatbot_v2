import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { GoChevronDown } from "react-icons/go";
import "../styles/Faq.css";

function FAQ() {
  const faqs = [
    {
      question: "What is Ask IndiaSpend?",
      answer: `Ask IndiaSpend is India’s first AI-powered search and analysis engine designed to provide verified, data-driven insights on key public interest topics such as healthcare, agriculture, environment, gender, employment, and social justice.  \n\n By tapping into IndiaSpend’s 13-year archive of data journalism, Ask IndiaSpend delivers clear and contextual insights, making complex data easier to access and understand.`,
    },
    {
      question: "What makes Ask IndiaSpend different?",
      answer: `Every response from Ask IndiaSpend is backed by credible sources and contextualised using IndiaSpend’s extensive body of work. This means users can trust that the information is not just accurate but also rooted in evidence-based journalism. Unlike other AI tools, Ask IndiaSpend ensures transparency by citing data sources, allowing users to explore the original reports and articles for deeper insights.  \n\n Whether you’re a journalist, policymaker, researcher, or an engaged citizen, Ask IndiaSpend equips you with reliable, easy-to-navigate information to drive meaningful discussions and informed decisions.`,
    },
    {
      question: "How does it work?",
      answer: `Curious about the rise in road accidents in India? Wondering how air pollution trends vary across cities? Just ask ‘Ask IndiaSpend!’ \n\n Our AI engine sifts through IndiaSpend’s reporting and analyses of government- and stakeholder-collected data to generate a detailed, well-rounded response.
`,
    },
    {
      question: "What kind of questions work best?",
      answer: `Ask IndiaSpend is designed to provide insightful, data-driven answers to complex and contextual queries, such as: \n\n✅  How have maternal mortality rates in India changed over the last decade? \n\n✅ What are the major contributors to India’s air pollution crisis? \n\n✅ How does health expenditure vary across Indian states? \n\n However, highly specific or overly broad questions—such as requesting unpublished data–may not yield precise results.`,
    },
    {
      question: "Why use Ask IndiaSpend?",
      answer: `Ask IndiaSpend makes complex public data accessible, organised, and easy to interpret, helping users save time while gaining deeper insights. Your queries will be answered based on evidence-driven, impactful journalism and deep-dive investigations that serve the public interest.`,
    },
    // {
    //   question: "How can Ask IndiaSpend help me?",
    //   answer: `This platform is designed to simplify complex data, uncover trends, and provide valuable insights on key policy issues. You can:  \n\n✅ Access credible, research-backed answers to pressing policy and social questions.  \n✅ Explore relevant IndiaSpend reports and data sources for deeper understanding.  \n✅ Stay informed about trending topics and data insights that impact India.  \n✅ Identify gaps in research and journalism that need further exploration.`,
    // },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faqs-grid">
      <h1 className="text-2xl font-bold mb-2">Frequently Asked Questions</h1>
      <p className="text-lg text-gray-600 mb-4">
        Find answers to commonly asked questions about Ask IndiaSpend.
      </p>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-box-rkcontent">
            <h3
              className="text-xl font-semibold flex justify-between items-center cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <span>
                {index + 1}. {faq.question}
              </span>
              <GoChevronDown
                className={`transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </h3>
            {openIndex === index && (
              <ReactMarkdown className="text-xl dec-bgc">
                {faq.answer}
              </ReactMarkdown>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
