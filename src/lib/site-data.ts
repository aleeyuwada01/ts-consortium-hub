import powerImg from "@/assets/svc-power.jpg";
import oilgasImg from "@/assets/svc-oilgas.jpg";
import agriImg from "@/assets/svc-agri.jpg";
import pipelineImg from "@/assets/svc-pipeline.jpg";
import logisticsImg from "@/assets/svc-logistics.jpg";
import miningImg from "@/assets/svc-mining.jpg";

export type Subsidiary = {
  slug: string;
  name: string;
  short: string;
  tagline: string;
  description: string;
  capabilities: string[];
  image: string;
};

export const SUBSIDIARIES: Subsidiary[] = [
  {
    slug: "power-infrastructure",
    name: "TSC Power & Infrastructure",
    short: "Power & Infrastructure",
    tagline: "Engineering the grid that powers a continent.",
    description:
      "From transmission and distribution to substation construction and renewable integration, we deliver turnkey power infrastructure that meets the scale and reliability demands of modern Africa.",
    capabilities: [
      "HV/MV Transmission & Distribution",
      "Substation EPC (up to 330kV)",
      "Solar & Hybrid Power Plants",
      "Rural Electrification Programs",
      "Grid Modernization & SCADA",
    ],
    image: powerImg,
  },
  {
    slug: "oil-and-gas",
    name: "TSC Oil & Gas",
    short: "Oil & Gas",
    tagline: "Upstream to downstream, engineered with precision.",
    description:
      "We provide integrated oil and gas services spanning exploration support, production optimization, midstream logistics and refined product distribution across West Africa.",
    capabilities: [
      "Upstream Exploration Support",
      "Production & Field Services",
      "LPG & Gas Distribution",
      "Refined Product Trading",
      "HSE-led Operations",
    ],
    image: oilgasImg,
  },
  {
    slug: "agriculture",
    name: "TSC Agriculture",
    short: "Agriculture",
    tagline: "Cultivating food security across the Sahara belt.",
    description:
      "Large-scale mechanized farming, agro-processing and export of premium Nigerian produce. We combine climate-smart practices with modern supply chains to strengthen food security.",
    capabilities: [
      "Mechanized Grain & Cereal Farming",
      "Agro-Processing & Value Addition",
      "Contract Farming Programs",
      "Cold-Chain & Export Logistics",
      "Irrigation & Climate-Smart Ops",
    ],
    image: agriImg,
  },
  {
    slug: "pipeline-infrastructure",
    name: "TSC Pipeline Infrastructure",
    short: "Pipeline Infrastructure",
    tagline: "Miles of steel. Zero compromise on integrity.",
    description:
      "Design, construction, commissioning and integrity management of onshore and offshore pipelines for oil, gas and water — delivered to international API and ISO standards.",
    capabilities: [
      "Onshore & Offshore Pipeline EPC",
      "Pipeline Integrity & Inspection",
      "Cathodic Protection Systems",
      "Pump & Metering Stations",
      "Rehabilitation & Right-of-Way",
    ],
    image: pipelineImg,
  },
  {
    slug: "logistics-services",
    name: "TSC Logistics Services",
    short: "Logistics Services",
    tagline: "Moving the industries that move Africa.",
    description:
      "End-to-end freight forwarding, heavy haulage, customs brokerage and project logistics for the energy, mining and agricultural sectors — with a fleet built for the toughest routes.",
    capabilities: [
      "Heavy & Abnormal Haulage",
      "Freight Forwarding (Air/Sea/Land)",
      "Customs Clearing & Brokerage",
      "Project Cargo & Rig Moves",
      "Warehousing & 3PL",
    ],
    image: logisticsImg,
  },
  {
    slug: "mining-and-exploration",
    name: "TSC Mining & Exploration",
    short: "Mining & Exploration",
    tagline: "Responsibly unlocking Africa's mineral wealth.",
    description:
      "Exploration, extraction and processing of solid minerals with a firm commitment to community development, environmental stewardship and international best practice.",
    capabilities: [
      "Geological Surveys & Exploration",
      "Open-Pit & Underground Mining",
      "Mineral Processing & Beneficiation",
      "Environmental & Social Governance",
      "Community Development Programs",
    ],
    image: miningImg,
  },
];

export const CONTACT = {
  address: "8th Floor, Bank of Industry Tower 2, Off Herbert Macaulay Way, Abuja, FCT",
  phones: ["+234 916 414 917", "+234 806 084 1400"],
  email: "info@tsconsortium.ng",
  website: "www.tsconsortium.ng",
};

export const NAV_LINKS: { to: string; label: string; dropdown?: boolean }[] = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Our Services" },
  { to: "/team", label: "Our Team" },
  { to: "/subsidiaries", label: "Subsidiaries", dropdown: true },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];
