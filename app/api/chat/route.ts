import { GoogleGenerativeAI } from "@google/generative-ai";
import { StreamingTextResponse } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";

import * as dotenv from "dotenv";
dotenv.config({ override: true });

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION = "f1gpt",
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
} = process.env;

function getValidApiKey(): string {
  return (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "").trim();
}

// gemini-embedding-001 natively supports outputDimensionality: 768 to match Astra DB collection schema
const EMBEDDING_MODEL = "gemini-embedding-001";
const VECTOR_DIMENSION = 768;

// Gemini 3, 3.7, and 3.8 models (all 3.5 variants removed)
const CHAT_MODELS = [
  "gemini-3-flash-preview",
  "gemini-3.8-flash",
  "gemini-3.7-flash",
];

// Determine if Astra DB has real configured credentials vs placeholders
const isAstraConfigured = Boolean(
  ASTRA_DB_API_ENDPOINT &&
    !ASTRA_DB_API_ENDPOINT.includes("your-astra-endpoint") &&
    ASTRA_DB_APPLICATION_TOKEN &&
    !ASTRA_DB_APPLICATION_TOKEN.includes("your-token")
);

let db: any = null;
if (isAstraConfigured && ASTRA_DB_APPLICATION_TOKEN && ASTRA_DB_API_ENDPOINT) {
  try {
    const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
    db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });
  } catch (err) {
    console.warn("Could not initialize Astra DB client:", err);
  }
}

// Built-in 2026+ F1 knowledge base used for RAG when Astra DB is offline, empty, or unconfigured
const F1_FALLBACK_KNOWLEDGE = [
  {
    topic: "2026 Active Aerodynamics (X-Mode and Z-Mode)",
    keywords: ["2026", "active aero", "x-mode", "z-mode", "aerodynamics", "wings", "drs", "regulations"],
    text: "[1] The 2026 regulations replace conventional DRS with full Active Aerodynamics featuring two driver-switchable states: Z-Mode (high downforce with flaps closed for cornering stability) and X-Mode (low drag with front and rear wing flaps opened on straights to cut drag by 55% and maximize battery regeneration). The car floor is 150mm narrower and diffusers are simplified, dramatically reducing ground-effect porpoising.",
  },
  {
    topic: "2026 Power Unit: 50/50 Hybrid Split & MGU-H Abolition",
    keywords: ["power unit", "engine", "mgu-k", "mgu-h", "hybrid", "50/50", "sustainable fuel", "mom", "override"],
    text: "[2] The 2026 power units deliver ~1,000 total horsepower via a revolutionary 50/50 power split: the 1.6L turbocharged V6 internal combustion engine produces ~400kW (535 hp), while the electric MGU-K output is tripled to 350kW (470 hp). The complex, expensive MGU-H is abolished. Power units run on 100% advanced sustainable drop-in e-fuels. To aid overtaking, a Manual Override Mode (MOM) delivers an extra 350kW electrical boost up to 337 km/h for chasing cars within 1 second.",
  },
  {
    topic: "2026 Chassis, Dimensions & Weight Reduction",
    keywords: ["weight", "dimensions", "chassis", "nimble", "width", "wheelbase", "768kg", "regulations"],
    text: "[3] The 2026 'nimble car' concept slashes minimum car weight by 30kg down to 768kg (722kg car/driver + 46kg estimated tyre mass). Car width narrows from 2,000mm to 1,900mm, maximum wheelbase contracts by 200mm to 3,400mm, and floor width narrows by 150mm. 18-inch wheels are retained but tyre widths are slimmed by 25mm front and 30mm rear.",
  },
  {
    topic: "2026 Complete Grid Driver Lineups",
    keywords: ["lineup", "grid", "drivers", "lineups", "teams", "contracts", "2026", "who drives"],
    text: "[4] Official 2026 Formula 1 Grid: Scuderia Ferrari: Lewis Hamilton & Charles Leclerc; Red Bull Racing: Max Verstappen & Liam Lawson (or Isack Hadjar/Yuki Tsunoda); McLaren: Lando Norris & Oscar Piastri; Mercedes: George Russell & Andrea Kimi Antonelli; Aston Martin Aramco: Fernando Alonso & Lance Stroll; Audi F1 Team (Sauber): Nico Hülkenberg & Gabriel Bortoleto; Williams Racing: Carlos Sainz & Alex Albon; Haas F1 Team: Esteban Ocon & Oliver Bearman; Alpine: Pierre Gasly & Jack Doohan (Mercedes customer PU); Racing Bulls: Yuki Tsunoda & Isack Hadjar.",
  },
  {
    topic: "Hamilton & Leclerc Ferrari Garage Dynamics & Maranello Culture",
    keywords: ["hamilton", "leclerc", "ferrari", "maranello", "vasseur", "garage", "drama", "teammates"],
    text: "[5] Lewis Hamilton's blockbuster arrival at Scuderia Ferrari alongside Charles Leclerc created the fiercest intra-team dynamic in modern F1. Team Principal Fred Vasseur manages two undisputed number-one drivers: Leclerc defending his home territory at Maranello with long-term Italian loyalty, and Hamilton targeting an unprecedented 8th World Championship with a $100M+ total compensation package. Tension in the garage centers on qualifying delta pace, strategy priority, and radio communications.",
  },
  {
    topic: "Adrian Newey Aston Martin Mega-Signing & Technical Coup",
    keywords: ["newey", "adrian newey", "aston martin", "stroll", "lawrence", "honda", "designer", "signing"],
    text: "[6] Design genius Adrian Newey joined Aston Martin Aramco as Managing Technical Partner and shareholder in a landmark $30M+/year deal following his exit from Red Bull. Newey oversees the entire technical direction for the 2026 car from the state-of-the-art Silverstone wind tunnel, reuniting with Honda as Aston Martin's exclusive works power unit partner to mount a championship challenge with Fernando Alonso and Lance Stroll.",
  },
  {
    topic: "Red Bull Garage Turmoil & Paddock Drama",
    keywords: ["horner", "marko", "jos verstappen", "red bull", "exodus", "drama", "paddock", "wheatley"],
    text: "[7] Red Bull Racing weathered massive paddock turbulence following internal friction between Team Principal Christian Horner, Helmut Marko, and Jos Verstappen. The turmoil triggered a severe technical exodus: Adrian Newey left for Aston Martin, Sporting Director Jonathan Wheatley departed to become Audi Team Principal, and Chief Designer Rob Marshall left for McLaren. Meanwhile, Red Bull Powertrains-Ford is racing the clock in Milton Keynes to construct their first independent in-house 2026 engine.",
  },
  {
    topic: "Audi Factory Takeover & Management Coup",
    keywords: ["audi", "sauber", "binotto", "wheatley", "bortoleto", "hulkenberg", "neuburg"],
    text: "[8] Audi's full corporate acquisition of Sauber underwent a ruthless boardroom purge: Audi CEO Gernot Döllner fired both Andreas Seidl and Oliver Hoffmann, appointing former Ferrari boss Mattia Binotto as COO/CTO alongside incoming Team Principal Jonathan Wheatley. Audi signed veteran Nico Hülkenberg alongside 2024 F2 sensation Gabriel Bortoleto, establishing its factory power unit facility in Neuburg, Germany.",
  },
  {
    topic: "Alpine Viry-Châtillon Engine Shutdown & Worker Revolt",
    keywords: ["alpine", "renault", "viry", "engine", "strike", "briatore", "mercedes customer"],
    text: "[9] Under executive advisor Flavio Briatore and Team Principal Oliver Oakes, Renault decided to cancel its historic 50-year Viry-Châtillon F1 works engine program. The decision ignited protests and strikes from French factory staff. From 2026 onwards, Alpine will run as a Mercedes customer team, purchasing Mercedes power units and gearboxes to cut hundreds of millions in development costs.",
  },
  {
    topic: "General Motors Cadillac 11th Team Entry",
    keywords: ["cadillac", "general motors", "gm", "11th team", "andretti", "entry", "expansion"],
    text: "[10] Formula 1 and the FIA granted agreement in principle to General Motors and Cadillac to enter the grid as the 11th team for the 2026 championship cycle. Initially fielding customer engines before debuting their own bespoke GM works power unit by 2028, the entry expands the grid to 22 cars and brings massive American OEM investment.",
  },
];

function getRelevantFallbackChunks(query: string): string[] {
  const q = query.toLowerCase();
  const matched = F1_FALLBACK_KNOWLEDGE.filter((item) =>
    item.keywords.some((k) => q.includes(k))
  ).map((item) => item.text);

  if (matched.length > 0) return matched;
  // If no specific keywords matched, provide top general reference chunks
  return F1_FALLBACK_KNOWLEDGE.slice(0, 4).map((item) => item.text);
}

function toGeminiContents(messages: { role: string; content: string }[]) {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1]?.content || "";

    const apiKey = getValidApiKey();
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "Google API key is missing. Please set GOOGLE_API_KEY in your .env file.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const genAI = new GoogleGenerativeAI(apiKey);

    let docContext = "";

    // 1. Vector RAG: Query Astra DB if configured
    if (db && isAstraConfigured) {
      try {
        const embeddingModel = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
        const embedding = await embeddingModel.embedContent({
          content: { role: "user", parts: [{ text: latestMessage }] },
          outputDimensionality: VECTOR_DIMENSION,
        } as any);
        const vector = embedding.embedding.values;

        const collection = db.collection(ASTRA_DB_COLLECTION);
        const cursor = collection.find(null, {
          sort: { $vector: vector },
          limit: 10,
        });

        const documents = await cursor.toArray();
        const docsMap = documents?.map((doc: any) => doc.text).filter(Boolean);
        if (docsMap && docsMap.length > 0) {
          docContext = JSON.stringify(docsMap);
        }
      } catch (err: any) {
        console.warn("Astra DB vector search note:", err?.message || err);
      }
    }

    // 2. Fallback RAG: If no Astra context was retrieved, inject curated F1 knowledge
    if (!docContext) {
      const fallbackDocs = getRelevantFallbackChunks(latestMessage);
      docContext = JSON.stringify(fallbackDocs);
    }

    // 3. Inject context into the system instruction
    const systemInstruction = `You are an AI assistant acting as an elite Formula 1 Knowledge Engineer and race strategist.
Use the below context to augment what you know about Formula 1 racing.
The context provides you with retrieved FIA regulations, Wikipedia data, and official motorsport technical reports.
Answer with structured markdown formatting (use headings, bullet lists, bold highlights, and markdown comparison tables where appropriate).
Whenever you state a fact derived from the context, include an inline citation tag such as [1] or [2] corresponding to the relevant source document chunk.
Maintain a professional, technical, motorsport-engineering tone.

----------------
START CONTEXT
${docContext}
END CONTEXT
----------------
QUESTION: ${latestMessage}`;

    const history = toGeminiContents(messages.slice(0, -1));

    // 4. Stream response using Gemini with automatic model fallback
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let streamSucceeded = false;

        // Try streaming first across candidate models
        for (const modelName of CHAT_MODELS) {
          try {
            const chatModel = genAI.getGenerativeModel({
              model: modelName,
              systemInstruction,
            });
            const chat = chatModel.startChat({ history });
            const result = await chat.sendMessageStream(latestMessage);

            for await (const chunk of result.stream) {
              const text = chunk.text();
              if (text) {
                controller.enqueue(encoder.encode(`0:${JSON.stringify(text)}\n`));
                streamSucceeded = true;
              }
            }

            if (streamSucceeded) break;
          } catch (err: any) {
            console.warn(`Streaming attempt on ${modelName} failed, trying next option:`, err?.message || err);
          }
        }

        // If streaming failed on all models (e.g. temporary 503 high load on SSE endpoint),
        // fallback to non-streaming generateContent and emit text chunks
        if (!streamSucceeded) {
          for (const modelName of CHAT_MODELS) {
            try {
              const chatModel = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction,
              });
              const chat = chatModel.startChat({ history });
              const result = await chat.sendMessage(latestMessage);
              const text = result.response.text();

              if (text) {
                // Break into natural chunks for smooth appearance
                const chunkSize = 40;
                for (let i = 0; i < text.length; i += chunkSize) {
                  const piece = text.slice(i, i + chunkSize);
                  controller.enqueue(encoder.encode(`0:${JSON.stringify(piece)}\n`));
                }
                streamSucceeded = true;
                break;
              }
            } catch (fallbackErr: any) {
              console.warn(`Non-streaming fallback on ${modelName} failed:`, fallbackErr?.message || fallbackErr);
            }
          }
        }

        if (!streamSucceeded) {
          controller.enqueue(
            encoder.encode(
              `0:${JSON.stringify(
                "I apologize, but Formula 1 GPT is currently experiencing high network demand. Please try asking your question again in a moment!"
              )}\n`
            )
          );
        }

        controller.enqueue(
          encoder.encode(`d:${JSON.stringify({ finishReason: "stop" })}\n`)
        );
        controller.close();
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("API Chat Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
