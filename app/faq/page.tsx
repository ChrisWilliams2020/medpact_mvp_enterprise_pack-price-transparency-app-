import { Container } from "@/components/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | MedPACT — Healthcare Intelligence Infrastructure™",
  description: "Frequently asked questions about MedPACT's Healthcare Intelligence Infrastructure, pricing, implementation, and security.",
};

// FAQ data with structured content for schema markup
const faqs = [
  {
    question: "What is Healthcare Intelligence Infrastructure™?",
    answer: "Healthcare Intelligence Infrastructure™ is a new category of technology that combines real-time payer intelligence, price transparency data, and AI automation into a unified platform. Unlike traditional analytics tools that just show dashboards, MedPACT sits above your existing systems and turns scattered data into actionable intelligence and automated workflows."
  },
  {
    question: "How is MedPACT different from traditional RCM or analytics tools?",
    answer: "Traditional RCM tools focus on billing and collections after the fact. Analytics platforms show you what happened. MedPACT is different: we provide real-time intelligence about payer behavior, contract performance, and reimbursement patterns—enabling you to act before revenue is lost, not after. We're infrastructure, not just software."
  },
  {
    question: "What specialties does MedPACT support?",
    answer: "MedPACT was built by ophthalmologists and is deeply optimized for ophthalmic practices, ASCs, and hospital departments. However, our Healthcare Intelligence Infrastructure applies to any procedure-heavy specialty where payer behavior, reimbursement compression, and prior authorization create operational friction."
  },
  {
    question: "How long does implementation take?",
    answer: "Most practices are live within 2-4 weeks. MedPACT integrates with your existing EHR, PM, and billing systems without requiring workflow changes. Our team handles the technical integration, data mapping, and training."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. MedPACT is HIPAA compliant and SOC 2 Type II certified. All data is encrypted at rest (256-bit AES) and in transit (TLS 1.3). We maintain strict access controls, audit logging, and never sell or share your data with third parties."
  },
  {
    question: "What's the pricing model?",
    answer: "MedPACT uses an enrollment-based model rather than traditional SaaS subscriptions. We work with select partners who are committed to building leverage through intelligence. Contact us for a customized proposal based on your organization's size and needs."
  },
  {
    question: "Can MedPACT integrate with my existing systems?",
    answer: "Yes. MedPACT is designed as an infrastructure layer that sits above your existing EHR, practice management, and billing systems. We support integrations with all major platforms including Epic, Cerner, Modernizing Medicine, Nextech, and more through our API and standard data connectors."
  },
  {
    question: "What kind of ROI can I expect?",
    answer: "Our partners typically see 15-30% improvement in contract performance visibility, 20-40% reduction in prior auth denials through predictive intelligence, and significant time savings from automated workflows. The exact ROI depends on your current operations and payer mix."
  },
  {
    question: "Do you offer a demo?",
    answer: "Yes! We offer personalized demos where we show you MedPACT using relevant scenarios for your practice type. You can also explore our interactive demo on the website to see the platform's capabilities before scheduling a briefing."
  },
  {
    question: "What support do you provide?",
    answer: "MedPACT provides dedicated onboarding, ongoing training, and direct access to our support team. Enterprise partners receive a dedicated success manager. We also offer regular office hours, documentation, and a knowledge base through KCN Chat."
  },
];

// Generate JSON-LD schema for FAQ
function generateFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

export default function FAQPage() {
  return (
    <>
      {/* JSON-LD Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema()) }}
      />

      <section className="border-b border-black/10">
        <Container className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-xs uppercase tracking-widest text-black/50 mb-4">FAQ</div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-lg text-black/70">
              Everything you need to know about MedPACT and Healthcare Intelligence Infrastructure™
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-16 md:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <details 
                  key={index} 
                  className="group rounded-2xl border border-black/10 bg-white overflow-hidden scroll-animate"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <summary className="flex items-center justify-between cursor-pointer p-6 hover:bg-gray-50 transition-colors">
                    <h2 className="text-base md:text-lg font-semibold pr-4">{faq.question}</h2>
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-black/5 flex items-center justify-center text-black/50 group-open:rotate-180 transition-transform">
                      ↓
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-black/70">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>

            {/* CTA Section */}
            <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 border border-black/10 text-center">
              <h3 className="text-xl font-bold">Still have questions?</h3>
              <p className="mt-2 text-black/70">Our team is here to help. Schedule a briefing or chat with us.</p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a 
                  href="/contact" 
                  className="px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
                >
                  Request Briefing
                </a>
                <a 
                  href="/kcn-chat" 
                  className="px-6 py-3 border border-black/20 rounded-full font-semibold hover:bg-white transition-colors"
                >
                  Chat with KCN
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
