import { retrieveRelevantKnowledge } from './ragEngine';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LeadData {
  name: string;
  email: string;
  whatsapp_number?: string;
  company_name?: string;
  project_type?: string;
  budget_range?: string;
  timeline?: string;
  project_description: string;
}

export interface OpenAIResponse {
  content: string;
  toolCall?: {
    id: string;
    name: string;
    arguments: LeadData;
  };
}

/**
 * Main service to send a query to the OpenAI Chat Completions API.
 * Uses RAG (Retrieval-Augmented Generation) to ground response in local portfolio knowledge,
 * and configures function calling to qualify and extract lead details.
 */
export async function askAI(
  query: string,
  history: ChatMessage[],
  customApiKey?: string
): Promise<OpenAIResponse> {
  // 1. Resolve API Key (Priority: custom user-provided key -> environment variable)
  const apiKey = customApiKey?.trim() || (import.meta.env.VITE_OPENAI_API_KEY as string)?.trim();

  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }

  // 2. Perform RAG: Retrieve relevant knowledge segments
  const retrievedDocs = retrieveRelevantKnowledge(query, 5);
  const contextText = retrievedDocs.map((doc, idx) => {
    return `[Document #${idx + 1}: ${doc.title}] (${doc.category})\n${doc.content}`;
  }).join('\n\n');

  // 3. Assemble the System Prompt
  const systemPrompt = `You are Injamul Hoque's digital twin / Personal AI Agent on his digital portfolio.
Your role is to act as a 24/7 portfolio assistant, sales representative, and lead qualification specialist.

COMMUNICATION STYLE:
- Professional, friendly, confident, knowledgeable, helpful, and concise.
- Communicate like an experienced consultant, NOT like a generic, repetitive chatbot.
- Keep responses short, clear, and focused. Avoid long paragraphs or walls of text. Use bullet points for lists.

KNOWLEDGE GROUNDING & RAG INSTRUCTIONS:
- You must use the retrieved knowledge base documents below to answer user questions about Injamul's background, stats, experience, skills, services, projects, certifications, testimonials, FAQs, and contact info.
- Context documents:
===
${contextText}
===
- CRITICAL: Never invent or extrapolate details.
- If the required information is NOT available in the context documents above, you must respond EXACTLY with:
"I couldn't find that information in my knowledge base. Please contact Injamul directly for accurate details."

CAPABILITIES & BUSINESS FLOWS:
1. Portfolio Discovery: When asked to show projects of a certain type (e.g., AI, CRM, SaaS, E-commerce, SEO), list the relevant items from the context.
2. Service Advisor: When visitors describe their needs (e.g., "I need a booking app"), recommend appropriate services (e.g., Custom Web App, Database Setup, Mobile Optimization) and concisely explain why they fit.
3. Cost Estimation: Provide rough estimates based ONLY on the FAQ rate info (e.g., static sites start at $28, WordPress starts at $48, Custom quotes for complex CRMs/dashboards). Add a disclaimer that final pricing depends on full project specifications.
4. Consultation Booking: Encourage scheduling a call or filling out the contact form. Direct them to Injamul's email (ihmunna1234@gmail.com) or WhatsApp (+966582822130).
5. Lead Qualification:
   - When a visitor expresses interest in hiring Injamul or starting a project, your goal is to qualify them.
   - Gently collect the following details in a natural conversational flow:
     * Name
     * Email
     * WhatsApp Number (optional)
     * Company Name (optional)
     * Project Type (e.g. Web App, SEO)
     * Budget Range (optional)
     * Timeline (optional)
     * Project Description
   - Do NOT ask for all details at once. Ask for 1-2 items at a time to maintain a conversational flow.
   - Once you have collected the core details (at minimum: Name, Email, and Project Description), call the 'submit_lead' function tool to submit their request. Let them know you are submitting their inquiry.`;

  // 4. Prepare the API payload
  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: query }
  ];

  const tools = [
    {
      type: 'function',
      function: {
        name: 'submit_lead',
        description: 'Submit a qualified lead interested in hiring Injamul or starting a project.',
        parameters: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: "The visitor's name"
            },
            email: {
              type: 'string',
              description: "The visitor's email address"
            },
            whatsapp_number: {
              type: 'string',
              description: "The visitor's WhatsApp number or phone number"
            },
            company_name: {
              type: 'string',
              description: "The visitor's company name (if applicable)"
            },
            project_type: {
              type: 'string',
              description: "The type of project (e.g. Website, E-commerce, SEO, SaaS Dashboard, CRM, Custom Web App)"
            },
            budget_range: {
              type: 'string',
              description: "Project budget range or estimation"
            },
            timeline: {
              type: 'string',
              description: "Desired timeline or deadline"
            },
            project_description: {
              type: 'string',
              description: "Detailed description of the project requirements"
            }
          },
          required: ['name', 'email', 'project_description']
        }
      }
    }
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        tools: tools,
        tool_choice: 'auto',
        temperature: 0.3 // Keep answers factual and grounded
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      if (response.status === 401) {
        throw new Error('API_KEY_INVALID');
      }
      throw new Error(errData?.error?.message || `HTTP ${response.status} Error`);
    }

    const data = await response.json();
    const choice = data?.choices?.[0];
    const assistantMessage = choice?.message;

    // Check if the assistant wants to call a tool
    if (assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0) {
      const toolCall = assistantMessage.tool_calls[0];
      if (toolCall.function.name === 'submit_lead') {
        try {
          const args = JSON.parse(toolCall.function.arguments) as LeadData;
          return {
            content: assistantMessage.content || "Submitting your project details now...",
            toolCall: {
              id: toolCall.id,
              name: toolCall.function.name,
              arguments: args
            }
          };
        } catch (e) {
          console.error('Failed to parse lead submission arguments:', e);
        }
      }
    }

    return {
      content: assistantMessage?.content || "I'm sorry, I couldn't process that response."
    };
  } catch (error: unknown) {
    console.error('OpenAI Service Error:', error);
    throw error;
  }
}
