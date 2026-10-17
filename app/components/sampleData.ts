import { RetrievedSource } from "./SourcePanel";
import { HistoryItem } from "./Sidebar";

export const SAMPLE_HISTORY: HistoryItem[] = [
  {
    id: "hist-1",
    title: "2026 Active Aero: X-Mode vs Z-Mode",
    timestamp: "10 mins ago",
    previewPrompt: "How do 2026 Active Aerodynamics (X-Mode & Z-Mode) work?",
  },
  {
    id: "hist-2",
    title: "Hamilton & Leclerc Ferrari Garage Dynamics",
    timestamp: "1 hour ago",
    previewPrompt: "Analyze the Hamilton-Leclerc Ferrari garage dynamics and paddock drama.",
  },
  {
    id: "hist-3",
    title: "Adrian Newey Aston Martin Technical Overhaul",
    timestamp: "Yesterday",
    previewPrompt: "What is Adrian Newey's impact on Aston Martin and the 2026 title fight?",
  },
  {
    id: "hist-4",
    title: "2026 50/50 Hybrid Power Unit Split",
    timestamp: "3 days ago",
    previewPrompt: "Explain the 2026 50/50 Power Unit split and MGU-H elimination.",
  },
];

export const MOCK_RESPONSES: Record<
  string,
  {
    content: string;
    sources: RetrievedSource[];
  }
> = {
  "How do 2026 Active Aerodynamics (X-Mode & Z-Mode) work?": {
    content: `### 2026 FIA Active Aerodynamics: The End of DRS

The 2026 aerodynamic regulations abandon the drag reduction system (DRS) in favor of **full-chassis Active Aerodynamics** with dual driver-switchable operating states [1].

#### Dual-State Aerodynamic Architecture:
- **Z-Mode (High Downforce)**: Activated automatically in braking zones and cornering sectors. Both front and rear wing active flaps close down to generate maximum vertical load, ensuring mechanical stability through medium- and high-speed apexes [1].
- **X-Mode (Low Drag)**: Activated along designated straight-line acceleration zones. Front and rear wing elements simultaneously feather open, cutting overall vehicle drag by **up to 55%** while dramatically reducing electrical consumption [1].

| Aerodynamic Metric | 2022-2025 Ground Effect Era | 2026 Active Aero Era | Regulation Variance |
| :--- | :--- | :--- | :--- |
| **Minimum Car Weight** | 798 kg | **768 kg** [3] | **-30 kg (-3.8%)** |
| **Maximum Wheelbase** | 3,600 mm | **3,400 mm** [3] | **-200 mm** |
| **Car Width** | 2,000 mm | **1,900 mm** [3] | **-100 mm** |
| **Straight-Line Drag** | Baseline 100% | **~45% in X-Mode** [1] | **-55% Drag Reduction** |
| **Overtaking Mechanism** | DRS Wing Slot Flap | **Manual Override Mode (MOM)** [2] | **350kW Electrical Boost** |

#### Elimination of Porpoising:
Because underfloor Venturi tunnels have been flattened and narrowed by 150mm, the ground-effect suction peak is softened, completely curing high-speed aerodynamic stall and porpoising [1].`,
    sources: [
      {
        id: 1,
        title: "FIA 2026 Formula 1 Technical Regulations - Active Aerodynamic Systems",
        section: "Article 3.4 & 3.5 - Z-Mode and X-Mode Operation",
        category: "Technical Regs",
        score: "98.7%",
        excerpt:
          "Active aerodynamic components must actuate synchronously across the front flap and rear upper beam wing. The low-drag state (X-Mode) is permitted only in designated telemetry zones.",
        fullText:
          "Article 3 dictates the control systems governing movable wing elements. Drivers toggle X-Mode along straights, shedding 55% of aero drag. In braking thresholds, the system defaults instantaneously to high-downforce Z-Mode for driver safety.",
        documentDate: "FIA Technical Regulations 2026",
      },
      {
        id: 2,
        title: "FIA Power Unit & Sporting Code - Manual Override Mode (MOM)",
        section: "Article 5.8 - Overtaking Electrical Energy Deployment",
        category: "Sporting Code",
        score: "96.2%",
        excerpt:
          "When a chasing car runs within 1.0 second of a leading car at the detection point, the ECU unlocks Manual Override Mode providing up to 350kW boost up to 337 km/h.",
        fullText:
          "Manual Override Mode replaces the DRS speed delta. The leading car's electrical energy tapers off after 290 km/h, reaching zero at 355 km/h, while the chasing car continues to deploy 350kW of MGU-K energy up to 337 km/h, creating close on-track slipstream battles.",
        documentDate: "FIA Power Unit Directives 2026",
      },
      {
        id: 3,
        title: "FIA Chassis Specification Dossier - 2026 Nimble Car Dimensions",
        section: "Article 4.2 - Weight & Dimensional Limits",
        category: "Technical Regs",
        score: "94.5%",
        excerpt:
          "Total minimum mass is capped at 768kg. Wheelbase must not exceed 3,400mm and maximum overall width across tyre sidewalls is 1,900mm.",
        fullText:
          "Designed to address driver complaints regarding heavy, cumbersome cars, the 2026 regulations enforce a lighter, narrower footprint with 25mm narrower front tyres and 30mm narrower rear tyres.",
        documentDate: "FIA Technical Regulations 2026",
      },
    ],
  },
  "Analyze the Hamilton-Leclerc Ferrari garage dynamics and paddock drama.": {
    content: `### Maranello Power Shift: Lewis Hamilton & Charles Leclerc at Scuderia Ferrari

The arrival of seven-time World Champion **Lewis Hamilton** alongside homegrown Ferrari star **Charles Leclerc** marks the highest-voltage intra-team rivalry in Formula 1 history [1].

#### Garage Dynamics & Internal Politics:
- **The Maranello Hierarchy**: Leclerc has been Ferrari's anointed prince since 2019, holding deep cultural ties and fluent Italian communication within the garage. Hamilton arrives with unmatched global authority, his long-time Mercedes race engineering staff, and a **$100M+ package** backed directly by Ferrari Chairman John Elkann [1].
- **Fred Vasseur's Balancing Act**: Team Principal Fred Vasseur previously coached Hamilton in GP2 (ART Grand Prix) and managed Leclerc at Sauber. Vasseur maintains a strict "no official number one" policy, but qualifying deltas and strategy calls during race neutralizations generate immediate pit wall tension [2].
- **Garage Side Segregation**: To prevent technical paranoia, Ferrari engineering briefings maintain shared telemetry across both sides of the garage, yet car setup philosophies diverge sharply—Hamilton favoring front-end stability under trail braking, whereas Leclerc thrives with extreme oversteer rotation [1].

#### Paddock Fallout & Domino Effects:
- **Carlos Sainz to Williams**: Sainz was displaced by Hamilton's signing, choosing James Vowles' Williams project over Audi and Alpine [3].
- **Red Bull & Mercedes Exploitation**: Both Christian Horner and Toto Wolff monitor the Maranello friction closely, anticipating strategy flashpoints during the 2026 title fight [2].`,
    sources: [
      {
        id: 1,
        title: "Scuderia Ferrari Operational Briefing - Maranello Engineering Structure",
        section: "Technical Bulletin - Driver Integration & Telemetry Sharing",
        category: "Paddock Drama",
        score: "97.8%",
        excerpt:
          "Both garage sides operate under mirrored telemetry sharing. Strategy preference is established purely on qualifying lap delta and track position at pit windows.",
        fullText:
          "Hamilton's arrival necessitated an organizational revamp at Maranello. With both drivers having multi-year contracts, Fred Vasseur has instituted neutral engineering guidelines to prevent the toxic internal divisions seen in historical Ferrari lineups.",
        documentDate: "Ferrari Paddock Report 2025/2026",
      },
      {
        id: 2,
        title: "FIA Team Principal Press Briefing - Intra-Team Management Protocols",
        section: "Article 21 - Sporting Fair Play & Radio Protocols",
        category: "Sporting Code",
        score: "93.4%",
        excerpt:
          "Team orders are legal under current sporting codes, but public team radio interactions are subject to FIA broadcast transmission scrutiny.",
        fullText:
          "Paddock insiders note that managing two alpha drivers competing for the same world championship demands absolute clarity in pit lane priority, tyre allocation, and tow sharing during qualifying.",
        documentDate: "FIA Press Conference Archives",
      },
      {
        id: 3,
        title: "F1 Driver Market Dossier - Sainz, Antonelli, and Grid Realignment",
        section: "Driver Contracts Bulletin #18 - Williams & Mercedes Realignment",
        category: "Historical",
        score: "91.9%",
        excerpt:
          "Carlos Sainz signed a multi-year deal with Williams Racing, while Mercedes committed to 18-year-old prodigy Andrea Kimi Antonelli alongside George Russell.",
        fullText:
          "Hamilton's departure from Mercedes triggered sweeping grid movements: Mercedes promoted Antonelli, Williams secured race-winner Sainz, and Haas revamped its lineup with Ocon and Bearman.",
        documentDate: "F1 Market Intelligence",
      },
    ],
  },
  "What is Adrian Newey's impact on Aston Martin and the 2026 title fight?": {
    content: `### Adrian Newey at Aston Martin: The $30M Technical Coup

Billionaire Lawrence Stroll pulled off the coup of the century by signing legendary aerodynamicist **Adrian Newey** as **Managing Technical Partner and shareholder** of Aston Martin Aramco [1].

#### Core Catalysts for the 2026 Title Fight:
- **Silverstone AMR Technology Campus**: Newey commands a brand-new £200M headquarters featuring an in-house bespoke wind tunnel and state-of-the-art simulator facilities, eliminating reliance on Mercedes wind tunnel rental [1].
- **Exclusive Honda Factory Works Power Unit**: Aston Martin becomes Honda's exclusive works partner for the 2026 50/50 hybrid regulations, reuniting Newey with the engine engineering team that powered Red Bull's dominant title runs [2].
- **Fernando Alonso's Dream Partnership**: Alonso and Newey have admired each other for two decades. Alonso signed an extension through 2026 specifically to drive Newey's first clean-sheet active-aero chassis [1].

#### Paddock Drama & The Red Bull Brain Drain:
Newey's exit from Red Bull followed the explosive internal power struggle between Christian Horner, Helmut Marko, and Jos Verstappen. His departure accelerated a mass exodus:
- **Jonathan Wheatley** (Sporting Director) left to lead Audi F1 Team as Team Principal [3].
- **Rob Marshall** (Chief Designer) departed to lead McLaren's engineering renaissance [3].
- Red Bull Powertrains-Ford is left to engineer their first independent power unit without Newey's aerodynamic-packaging genius [2].`,
    sources: [
      {
        id: 1,
        title: "Aston Martin Aramco F1 Team - Technical Leadership Announcement",
        section: "Executive Statement - Managing Technical Partner Appointment",
        category: "Technical Regs",
        score: "99.1%",
        excerpt:
          "Adrian Newey joins Aston Martin as Managing Technical Partner with full leadership of chassis architecture, CFD simulation, and 2026 design philosophies.",
        fullText:
          "Newey was granted operational autonomy and team equity by Lawrence Stroll. His primary mission is translating the radical 2026 Active Aerodynamics and 50/50 hybrid power packaging into an immediate championship challenger.",
        documentDate: "Aston Martin Official Statement",
      },
      {
        id: 2,
        title: "Honda Racing Corporation (HRC) - 2026 Works Partnership Agreement",
        section: "Technical Bulletin - Hybrid Architecture & Chassis Integration",
        category: "Tyre Telemetry",
        score: "95.7%",
        excerpt:
          "Honda will exclusively supply Aston Martin with its 2026 factory power unit, featuring custom MGU-K packaging tailored directly to Adrian Newey's chassis specifications.",
        fullText:
          "Unlike customer engine buyers, Aston Martin enjoys 100% works integration with Honda, allowing Newey to sculpt extreme rear packaging and optimized heat-exchanger aerodynamics.",
        documentDate: "HRC Technical Dossier 2026",
      },
      {
        id: 3,
        title: "Red Bull Racing Organizational Restructuring Report",
        section: "Staff Movements - Engineering Leadership Departures",
        category: "Paddock Drama",
        score: "92.6%",
        excerpt:
          "The departure of Adrian Newey, Jonathan Wheatley, and Rob Marshall represents the largest technical reorganization in Red Bull Racing's 20-year history.",
        fullText:
          "Internal tensions in Milton Keynes prompted key personnel departures to Aston Martin, Audi, and McLaren, forcing Pierre Waché to take sole technical charge of Red Bull's 2026 project.",
        documentDate: "Paddock Technical Review",
      },
    ],
  },
  "Explain the 2026 50/50 Power Unit split and MGU-H elimination.": {
    content: `### 2026 Power Unit Regulations: The 50/50 Electrical Revolution

The 2026 Formula 1 Power Unit marks the biggest powertrain shift since 2014, achieving an exact **50% Internal Combustion / 50% Electrical Energy** output [1].

#### Technical Architecture Breakdown:
- **1.6L V6 Turbocharged ICE**: Output reduced from ~550kW down to **~400kW (535 hp)** to curb fuel flow and thermal emissions [1].
- **MGU-K Output Tripled**: Electric motor-generator power leaps from 120kW up to **350kW (470 hp)**, providing immediate torque out of low-speed traction zones [1].
- **MGU-H Completely Abolished**: The ultra-complex Motor Generator Unit-Heat connected to the turbocharger was scrapped to cut R&D costs by tens of millions and attract new manufacturers (Audi, Ford, GM Cadillac, Honda) [2].
- **100% Sustainable Synthetic Drop-in Fuel**: Engines operate exclusively on advanced biofuels or synthetic e-fuels synthesized from non-food biomass or carbon-capture tech [1].

#### Manual Override Mode (MOM) for Racing:
Because electrical energy will deplete rapidly along straights, drivers must manage energy regeneration (lifting and coasting in braking zones). Chasing cars within 1.0 second receive **Manual Override Mode (MOM)**, providing maximum 350kW power past 290 km/h up to 337 km/h to secure overtakes [1].`,
    sources: [
      {
        id: 1,
        title: "FIA Formula 1 Power Unit Technical Regulations 2026",
        section: "Article 5 - 50/50 Power Ratio & 350kW MGU-K Specification",
        category: "Technical Regs",
        score: "99.4%",
        excerpt:
          "The MGU-K power output is fixed at a maximum of 350kW. The Internal Combustion Engine fuel mass flow rate is limited to 70-75 kg/h, delivering ~400kW.",
        fullText:
          "Article 5 establishes the 50/50 balance. Total output remains around 1,000 hp, but braking energy recovery is nearly tripled to 8.5 MJ per lap. Energy deployment strategy replaces fuel-saving as the primary race engineer focus.",
        documentDate: "FIA Technical Regulations 2026",
      },
      {
        id: 2,
        title: "FIA Engine Manufacturer Working Group - MGU-H Removal Decision",
        section: "Regulatory Annex 2 - Cost Reduction & New OEM Entry Framework",
        category: "Technical Regs",
        score: "96.8%",
        excerpt:
          "Eliminating the MGU-H directly facilitated the regulatory commitment of Audi, Ford Motor Company, and General Motors Cadillac to the Formula 1 Championship.",
        fullText:
          "The MGU-H had no road-car relevance and required specialized thermodynamic engineering that prevented new automakers from entering. Its abolition leveled the technical playing field for 2026.",
        documentDate: "FIA OEM Technical Study",
      },
      {
        id: 3,
        title: "Pirelli & F1 Telemetry Bulletin - Braking Regeneration Loads",
        section: "Telemetry Report #22 - 350kW Braking Kinetic Energy Harvest",
        category: "Tyre Telemetry",
        score: "92.1%",
        excerpt:
          "Under 350kW regenerative braking, rear brake-by-wire systems manage extreme electronic retarding forces, reducing physical brake disc wear by 40%.",
        fullText:
          "Telemetry data confirms massive energy recovery through heavy braking zones like Monza Turn 1 and Montreal Turn 10, requiring sophisticated ECU algorithms to maintain chassis pitch stability.",
        documentDate: "F1 Braking & Telemetry Analysis",
      },
    ],
  },
};

export function getSourcesForQuery(query: string): RetrievedSource[] {
  const q = query.toLowerCase();

  if (q.includes("active aero") || q.includes("x-mode") || q.includes("z-mode") || q.includes("wing") || q.includes("drs") || q.includes("drag")) {
    return MOCK_RESPONSES["How do 2026 Active Aerodynamics (X-Mode & Z-Mode) work?"].sources;
  }
  if (q.includes("hamilton") || q.includes("leclerc") || q.includes("ferrari") || q.includes("maranello") || q.includes("vasseur") || q.includes("drama")) {
    return MOCK_RESPONSES["Analyze the Hamilton-Leclerc Ferrari garage dynamics and paddock drama."].sources;
  }
  if (q.includes("newey") || q.includes("aston martin") || q.includes("stroll") || q.includes("alonso") || q.includes("honda") || q.includes("designer")) {
    return MOCK_RESPONSES["What is Adrian Newey's impact on Aston Martin and the 2026 title fight?"].sources;
  }
  if (q.includes("power unit") || q.includes("engine") || q.includes("50/50") || q.includes("mgu-k") || q.includes("mgu-h") || q.includes("fuel") || q.includes("override") || q.includes("mom")) {
    return MOCK_RESPONSES["Explain the 2026 50/50 Power Unit split and MGU-H elimination."].sources;
  }

  // Default comprehensive 2026 retrieved sources
  return [
    {
      id: 1,
      title: "FIA Formula 1 2026 Championship Regulations & Team Rosters",
      section: "Official 2026 Grid Roster & Driver Allocation",
      category: "Sporting Code",
      score: "96.5%",
      excerpt:
        "The official 2026 FIA Formula 1 roster: Ferrari (Hamilton, Leclerc), Red Bull (Verstappen, Lawson), McLaren (Norris, Piastri), Mercedes (Russell, Antonelli), Aston Martin (Alonso, Stroll), Audi (Hülkenberg, Bortoleto), Williams (Sainz, Albon), Haas (Ocon, Bearman), Alpine (Gasly, Doohan), RB (Tsunoda, Hadjar).",
      fullText:
        "Complete confirmed driver pairings for the 2026 FIA Formula 1 World Championship, reflecting major transitions including Lewis Hamilton at Ferrari, Carlos Sainz at Williams, Kimi Antonelli at Mercedes, and Gabriel Bortoleto at Audi.",
      documentDate: "FIA Official Grid 2026",
    },
    {
      id: 2,
      title: "FIA Technical Regulations - 2026 Active Aero & Nimble Car Platform",
      section: "Article 3 & 4 - 768kg Weight Limit and Z/X Mode Wings",
      category: "Technical Regs",
      score: "94.2%",
      excerpt:
        "The 2026 car drops 30kg to 768kg, narrows to 1,900mm width, and incorporates dual-mode active wings (Z-Mode cornering downforce, X-Mode straight-line low drag).",
      fullText:
        "Article 3 and 4 enforce strict limits on ground-effect floor tunnels and introduce active front and rear wings that operate under driver control to eliminate the need for DRS.",
      documentDate: "FIA Technical Regulations 2026",
    },
    {
      id: 3,
      title: "Formula 1 Paddock Intelligence - Engineering Exoduses & Factory PUs",
      section: "Paddock Analysis #44 - Audi, Red Bull-Ford, and Aston Martin-Honda",
      category: "Paddock Drama",
      score: "91.8%",
      excerpt:
        "High-profile personnel shifts include Adrian Newey to Aston Martin, Jonathan Wheatley and Mattia Binotto taking charge at Audi, and Alpine ending works Renault engines for Mercedes power units.",
      fullText:
        "Analysis of garage restructurings across the paddock as manufacturers prepare for the 2026 hybrid regulations. Red Bull Powertrains partners with Ford, Audi establishes its Neuburg engine facility, and Cadillac secures approval as the 11th team.",
      documentDate: "Paddock Intelligence Bulletin 2026",
    },
  ];
}
