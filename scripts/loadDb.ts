import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  GOOGLE_API_KEY,
} = process.env;

// Single Gemini client (same GOOGLE_API_KEY used by the chat route).
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY!);
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

// Gemini gemini-embedding-001 outputs 768-dimension vectors when requested.
const VECTOR_DIMENSION = 768;

// Updated 2026+ authoritative sources
const f1Data = [
  "https://en.wikipedia.org/wiki/2026_Formula_One_World_Championship",
  "https://en.wikipedia.org/wiki/Formula_One_regulations",
  "https://en.wikipedia.org/wiki/Lewis_Hamilton",
  "https://en.wikipedia.org/wiki/Adrian_Newey",
];

// High-density authoritative 2026 dossiers embedded directly into Astra DB
const F1_2026_AUTHORITATIVE_DOSSIERS = [
  "2026 Formula 1 Active Aerodynamics Regulations: The FIA has replaced conventional DRS with full active aerodynamics consisting of Z-Mode (high downforce, cornering stability with active wing elements closed) and X-Mode (low drag state with active front and rear wing flaps open along high-speed straights to slash drag by 55%). Ground effect Venturi tunnels are significantly flattened and simplified to stop high-speed porpoising.",
  "2026 Formula 1 Power Unit Technical Regulations: Features a 50/50 power distribution between internal combustion and electric power. The 1.6L turbocharged V6 engine produces approximately 400kW (535 hp), while the electric MGU-K output triples from 120kW to 350kW (470 hp). The complex and costly MGU-H has been entirely abolished. Fuel is 100% advanced sustainable drop-in biofuel. A Manual Override Mode (MOM) allows trailing cars within 1 second to deploy up to 350kW of electrical boost up to 337 km/h for overtaking.",
  "2026 Chassis Nimble Car Concept: Minimum vehicle weight is reduced by 30kg down to 768kg (722kg car/driver + 46kg tyres). Overall vehicle width contracts from 2,000mm to 1,900mm. Maximum wheelbase is shortened by 200mm to 3,400mm. Tyre widths narrow by 25mm at the front and 30mm at the rear, preserving 18-inch rims while enhancing nimble mechanical responsiveness.",
  "2026 Confirmed Driver Lineups and Team Partnerships: Scuderia Ferrari: Lewis Hamilton and Charles Leclerc; Red Bull Racing: Max Verstappen and Liam Lawson / Isack Hadjar; McLaren: Lando Norris and Oscar Piastri; Mercedes: George Russell and Andrea Kimi Antonelli; Aston Martin Aramco: Fernando Alonso and Lance Stroll (designed by Adrian Newey with factory Honda power units); Audi F1 Team: Nico Hülkenberg and Gabriel Bortoleto; Williams Racing: Carlos Sainz and Alex Albon; Haas F1 Team: Esteban Ocon and Oliver Bearman; Alpine: Pierre Gasly and Jack Doohan (swapped to Mercedes customer engine and gearbox); Racing Bulls: Yuki Tsunoda and Isack Hadjar.",
  "Hamilton-Leclerc Ferrari Garage Dynamics and Maranello Politics: Lewis Hamilton made the historic leap to Scuderia Ferrari to partner Charles Leclerc under Team Principal Fred Vasseur. With Hamilton seeking a record-breaking eighth world title and Leclerc fiercely protecting his status as the chosen prodigy of Maranello, the garage manages intense competition over qualifying deltas, development feedback, and pit strategy hierarchy.",
  "Adrian Newey Mega-Signing at Aston Martin: Billionaire owner Lawrence Stroll secured legendary designer Adrian Newey as Managing Technical Partner and shareholder in a historic $30M+/year agreement. Following his exit from Red Bull, Newey heads technical development in Aston Martin's new Silverstone wind tunnel, reuniting with Honda as an exclusive works engine partner to launch a title assault with Fernando Alonso.",
  "Red Bull Paddock Drama and Staff Brain Drain: Internal conflict between Christian Horner, Helmut Marko, and Jos Verstappen initiated a major technical exodus from Red Bull. Adrian Newey joined Aston Martin, Sporting Director Jonathan Wheatley departed to lead Audi as Team Principal, and Chief Designer Rob Marshall went to McLaren. Concurrently, Red Bull Powertrains and Ford face the monumental pressure of designing their first in-house power unit in Milton Keynes.",
  "Audi F1 Team Corporate Takeover: Audi fully acquired Sauber and executed a high-profile management purge, dismissing Andreas Seidl and Oliver Hoffmann in favor of former Ferrari boss Mattia Binotto (COO/CTO) and Jonathan Wheatley (Team Principal). The team signed Nico Hülkenberg and reigning F2 champion Gabriel Bortoleto for their 2026 factory campaign.",
  "Alpine Works Engine Cancellation and Worker Protests: Renault CEO Luca de Meo and advisor Flavio Briatore officially terminated Renault's 50-year works engine operation at Viry-Châtillon, provoking strikes from factory engineers. Alpine transitions to a customer team powered by Mercedes engines and gearboxes from 2026 onward.",
  "General Motors and Cadillac 11th Team Grid Entry: Formula 1 and the FIA granted agreement in principle to General Motors Cadillac to enter as the eleventh team on the grid for 2026+, bringing 22 cars to the grid and introducing an American OEM works power unit by 2028.",
];

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

// Helper to chunk text
function splitIntoChunks(text: string, chunkSize: number = 512, overlap: number = 100): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize));
    i += chunkSize - overlap;
  }
  return chunks;
}

const scrapePage = async (url: string) => {
  try {
    const loader = new PuppeteerWebBaseLoader(url, {
      launchOptions: { headless: true },
      gotoOptions: { waitUntil: "domcontentloaded" },
      evaluate: async (page, browser) => {
        const result = await page.evaluate(() => document.body.innerText);
        await browser.close();
        return result;
      },
    });
    return (await loader.scrape())?.replace(/<[^>]*>?/gm, "") || "";
  } catch (err) {
    console.warn(`Scrape notice for ${url}:`, err);
    return "";
  }
};

const createCollection = async () => {
  try {
    const res = await db.createCollection(ASTRA_DB_COLLECTION!, {
      vector: {
        dimension: VECTOR_DIMENSION,
        metric: "dot_product",
      },
    });
    console.log("Collection created:", res);
  } catch (e) {
    console.log("Collection might already exist, continuing...");
  }
};

const loadSampleData = async () => {
  const collection = db.collection(ASTRA_DB_COLLECTION!);

  // 1. Ingest authoritative 2026 dossiers first
  console.log("Seeding authoritative 2026 F1 dossiers...");
  for (const dossier of F1_2026_AUTHORITATIVE_DOSSIERS) {
    const embedding = await embeddingModel.embedContent({
      content: { role: "user", parts: [{ text: dossier }] },
      outputDimensionality: VECTOR_DIMENSION,
    } as any);

    await collection.insertOne({
      $vector: embedding.embedding.values,
      text: dossier,
    });
    console.log("Inserted 2026 authoritative dossier into vector DB");
  }

  // 2. Ingest scraped pages
  for (const url of f1Data) {
    console.log(`Scraping ${url}...`);
    const content = await scrapePage(url);
    if (!content) continue;
    const chunks = splitIntoChunks(content, 512, 100);

    for (const chunk of chunks) {
      if (!chunk.trim()) continue;

      const embedding = await embeddingModel.embedContent({
        content: { role: "user", parts: [{ text: chunk }] },
        outputDimensionality: VECTOR_DIMENSION,
      } as any);

      await collection.insertOne({
        $vector: embedding.embedding.values,
        text: chunk,
      });
      console.log("Inserted scraped chunk into vector DB");
    }
  }
  console.log("Database seeded successfully with 2026 data!");
};

createCollection().then(() => loadSampleData());