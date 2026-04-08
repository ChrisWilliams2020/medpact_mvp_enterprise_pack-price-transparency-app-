import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/kcn/chat
 * AI-powered chat endpoint for KCN (Knowledge Center Network)
 * 
 * Supports:
 * - OpenAI API (GPT-4)
 * - Anthropic Claude API
 * - Fallback to enhanced local knowledge base
 * 
 * Environment variables:
 *   OPENAI_API_KEY - OpenAI API key
 *   ANTHROPIC_API_KEY - Anthropic API key (alternative)
 */

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  message: string;
  history?: ChatMessage[];
  sessionId?: string;
}

// MedPACT system prompt for AI context
const SYSTEM_PROMPT = `You are the MedPACT Knowledge Center Network (KCN) AI assistant. You are an expert in:

1. **Healthcare Price Transparency**: CMS mandates, No Surprises Act, hospital and payer pricing data, MRFs (Machine-Readable Files)

2. **Payer Behavior Analytics**: Reimbursement patterns, denial trends, prior authorization, contract compression, fee schedule analysis

3. **Ophthalmology Specific**: Cataract surgery economics, premium IOL pricing, ASC vs HOPD differentials, glaucoma/retina procedure analytics

4. **MedPACT Platform**: Healthcare Intelligence Infrastructure™ that provides real-time payer intelligence, contract benchmarking, and AI-powered automation

5. **Contract Negotiations**: How to leverage transparency data for better payer contracts, benchmarking strategies, rate optimization

Your communication style:
- Professional but approachable
- Use bullet points and structured formatting
- Provide actionable insights
- Reference specific data points when possible
- Always tie back to how MedPACT can help

If asked about scheduling a demo or executive briefing, direct users to the Contact page or mention they can request an Executive Briefing.

Keep responses concise but informative (2-4 paragraphs max unless detailed explanation requested).`;

// Enhanced local knowledge base with more comprehensive responses
const KNOWLEDGE_BASE: Record<string, string> = {
  pricing: `**Understanding Healthcare Pricing Data**

The CMS transparency mandates require:
• **Hospitals**: Publish machine-readable files with negotiated rates for all payers
• **Insurers**: Publish in-network rates, out-of-network allowed amounts, and prescription drug pricing

**The Challenge**: This data is fragmented across 6,000+ hospitals and hundreds of payers, in inconsistent formats, making it nearly impossible for individual practices to analyze.

**MedPACT's Solution**: We aggregate, normalize, and analyze this data to provide actionable intelligence — showing you exactly what payers are paying for specific CPT codes in your market.`,

  denial: `**Denial Management Intelligence**

Common denial patterns MedPACT identifies:
• **Prior Auth Denials**: Tracking which procedures and payers have highest denial rates
• **Medical Necessity**: Identifying documentation patterns that lead to approvals
• **Timely Filing**: Monitoring submission deadlines across payer contracts
• **Coding Issues**: Flagging CPT/ICD combinations with high rejection rates

**Actionable Intelligence**: Our platform doesn't just report denials — it predicts them before submission and recommends interventions.`,

  cataract: `**Cataract Surgery Economics**

Key reimbursement factors MedPACT tracks:
• **Facility Differentials**: ASC vs HOPD payment gaps (often 40-60% difference)
• **Premium IOL Economics**: Understanding patient responsibility vs payer coverage
• **MIGS Add-ons**: Reimbursement trends for combined procedures
• **Geographic Variation**: How your market compares to national benchmarks

**Contract Insight**: We've seen practices increase cataract reimbursement 15-25% by leveraging transparency data in negotiations.`,

  contract: `**Contract Intelligence & Negotiation**

MedPACT provides:
• **Market Benchmarks**: See what other practices receive for the same CPT codes
• **Compression Analysis**: Identify where your rates have eroded vs. Medicare
• **Payer Scorecards**: Compare performance across your entire payer mix
• **Negotiation Playbooks**: Data-backed strategies for rate discussions

**Key Insight**: Most practices negotiate blind. We give you the same data intelligence that payers have — creating true market symmetry.`,

  demo: `**Schedule an Executive Briefing**

In a 30-minute briefing, we'll show you:
• How transparency data applies to your specific market
• Payer-specific insights for your top contracts
• ROI projections based on practices similar to yours
• Implementation timeline and integration options

**Next Steps**: Visit our Contact page to request an Executive Briefing, or ask me any specific questions about your situation.`,

  general: `**MedPACT: Healthcare Intelligence Infrastructure™**

We're building the data intelligence layer that sits above fragmented healthcare systems:

• **Price Transparency Intelligence**: Transform mandated pricing data into actionable insights
• **Payer Behavior Analytics**: Understand reimbursement patterns, denials, and compression
• **Contract Performance**: Benchmark and optimize your payer agreements
• **AI Automation**: Move from dashboards to operational intelligence

**Founded by Physicians**: Our team includes practicing ophthalmologists who understand clinical and financial pressures firsthand.

What specific aspect would you like to explore?`
};

// Local response function (fallback when no AI API configured)
function getLocalResponse(message: string, history: ChatMessage[]): string {
  const lower = message.toLowerCase();
  
  // Check for specific topics
  if (lower.match(/price|pricing|transparency|cms|mandate|mrf|machine.?readable/i)) {
    return KNOWLEDGE_BASE.pricing;
  }
  if (lower.match(/denial|deny|reject|prior.?auth|authorization/i)) {
    return KNOWLEDGE_BASE.denial;
  }
  if (lower.match(/cataract|iol|lens|phaco|migs|ophthalm/i)) {
    return KNOWLEDGE_BASE.cataract;
  }
  if (lower.match(/contract|negotiat|benchmark|rate|fee.?schedule|reimburse/i)) {
    return KNOWLEDGE_BASE.contract;
  }
  if (lower.match(/demo|briefing|schedule|meeting|call|contact/i)) {
    return KNOWLEDGE_BASE.demo;
  }
  
  // Context-aware responses based on history
  if (history.length > 2) {
    const lastTopics = history.slice(-4).map(m => m.content.toLowerCase()).join(' ');
    if (lastTopics.includes('contract') || lastTopics.includes('negotiat')) {
      return `Building on our contract discussion:\n\n${KNOWLEDGE_BASE.contract}\n\nWould you like specific benchmarks for a particular CPT code or payer?`;
    }
  }
  
  return KNOWLEDGE_BASE.general;
}

// Call OpenAI API
async function callOpenAI(messages: ChatMessage[], apiKey: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "I apologize, I couldn't generate a response.";
}

// Call Anthropic Claude API
async function callAnthropic(messages: ChatMessage[], apiKey: string): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: messages.map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0]?.text || "I apologize, I couldn't generate a response.";
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequest;
    
    if (!body.message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const history: ChatMessage[] = body.history || [];
    const userMessage: ChatMessage = { role: "user", content: body.message.trim() };
    const allMessages = [...history, userMessage];

    let response: string;
    
    // Try OpenAI first
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (openaiKey) {
      try {
        response = await callOpenAI(allMessages, openaiKey);
      } catch (error) {
        console.error("[KCN Chat] OpenAI error, falling back:", error);
        response = getLocalResponse(body.message, history);
      }
    } else if (anthropicKey) {
      try {
        response = await callAnthropic(allMessages, anthropicKey);
      } catch (error) {
        console.error("[KCN Chat] Anthropic error, falling back:", error);
        response = getLocalResponse(body.message, history);
      }
    } else {
      // No AI API configured, use enhanced local knowledge base
      response = getLocalResponse(body.message, history);
    }

    return NextResponse.json({
      response,
      sessionId: body.sessionId || `session-${Date.now()}`,
    });
  } catch (error) {
    console.error("[KCN Chat] Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
