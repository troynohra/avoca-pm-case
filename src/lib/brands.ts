export type Trade = "HVAC" | "Plumbing" | "Electrical";
export type Region = "Southwest" | "Southeast" | "Northeast" | "Midwest";
export type Cohort = "2023" | "2024" | "2025";
export type Crm = "ServiceTitan" | "Housecall Pro";
export type Status = "healthy" | "slipping" | "recovered";

export interface UnbookedReason {
  label: string;
  brandPct: number;
  peerPct: number;
}

export interface Brand {
  id: string;
  name: string;
  trade: Trade;
  region: Region;
  cohort: Cohort;
  crm: Crm;
  bookingRate: number;
  peerBenchmark: number;
  containment: number;
  transferRate: number;
  revenueBooked: number;
  revenueAtRisk: number;
  status: Status;
  topUnbookedReasons: UnbookedReason[];
  dropOffStage: string;
  recommendation: {
    summary: string;
    fixLabel: string;
    peerName: string;
  };
}

export const initialBrands: Brand[] = [
  {
    id: "phoenix-air-pros",
    name: "Phoenix Air Pros",
    trade: "HVAC",
    region: "Southwest",
    cohort: "2024",
    crm: "ServiceTitan",
    bookingRate: 41,
    peerBenchmark: 58,
    containment: 62,
    transferRate: 38,
    revenueBooked: 84500,
    revenueAtRisk: 48000,
    status: "slipping",
    topUnbookedReasons: [
      { label: "Price objection", brandPct: 31, peerPct: 15 },
      { label: "Unavailable slot", brandPct: 22, peerPct: 18 },
      { label: "Chose competitor", brandPct: 18, peerPct: 22 },
      { label: "No follow-up", brandPct: 14, peerPct: 9 },
    ],
    dropOffStage: "Quote stage",
    recommendation: {
      summary: "Losing 2x its peers to price objections at the quote stage.",
      fixLabel: "Price-objection handling",
      peerName: "Desert Comfort HVAC",
    },
  },
  {
    id: "lone-star-plumbing",
    name: "Lone Star Plumbing",
    trade: "Plumbing",
    region: "Southwest",
    cohort: "2025",
    crm: "Housecall Pro",
    bookingRate: 47,
    peerBenchmark: 60,
    containment: 58,
    transferRate: 42,
    revenueBooked: 61200,
    revenueAtRisk: 22000,
    status: "slipping",
    topUnbookedReasons: [
      { label: "After-hours abandon", brandPct: 24, peerPct: 9 },
      { label: "Long hold time", brandPct: 19, peerPct: 14 },
      { label: "Price objection", brandPct: 16, peerPct: 18 },
      { label: "No availability", brandPct: 12, peerPct: 10 },
    ],
    dropOffStage: "After-hours routing",
    recommendation: {
      summary: "After-hours calls abandoning at 2.7x the peer rate — routing gap.",
      fixLabel: "After-hours routing script",
      peerName: "Gulf Coast Plumbers",
    },
  },
  {
    id: "midwest-electric-co",
    name: "Midwest Electric Co",
    trade: "Electrical",
    region: "Midwest",
    cohort: "2023",
    crm: "ServiceTitan",
    bookingRate: 50,
    peerBenchmark: 61,
    containment: 65,
    transferRate: 35,
    revenueBooked: 72400,
    revenueAtRisk: 14500,
    status: "slipping",
    topUnbookedReasons: [
      { label: "No technician available", brandPct: 28, peerPct: 17 },
      { label: "Price objection", brandPct: 19, peerPct: 16 },
      { label: "Callback not answered", brandPct: 15, peerPct: 11 },
      { label: "Chose competitor", brandPct: 11, peerPct: 13 },
    ],
    dropOffStage: "Scheduling",
    recommendation: {
      summary: "Losing 1.6x peers at scheduling due to technician availability gaps.",
      fixLabel: "Technician availability windows",
      peerName: "Volt Masters Electric",
    },
  },
  {
    id: "desert-comfort-hvac",
    name: "Desert Comfort HVAC",
    trade: "HVAC",
    region: "Southwest",
    cohort: "2023",
    crm: "ServiceTitan",
    bookingRate: 64,
    peerBenchmark: 58,
    containment: 78,
    transferRate: 22,
    revenueBooked: 142000,
    revenueAtRisk: 4200,
    status: "healthy",
    topUnbookedReasons: [
      { label: "Price objection", brandPct: 15, peerPct: 15 },
      { label: "Chose competitor", brandPct: 21, peerPct: 22 },
      { label: "No availability", brandPct: 10, peerPct: 18 },
      { label: "Callback no-answer", brandPct: 8, peerPct: 9 },
    ],
    dropOffStage: "None — performing above benchmark",
    recommendation: {
      summary: "Top performer — used as peer benchmark for HVAC Southwest.",
      fixLabel: "N/A",
      peerName: "N/A",
    },
  },
  {
    id: "gulf-coast-plumbers",
    name: "Gulf Coast Plumbers",
    trade: "Plumbing",
    region: "Southeast",
    cohort: "2024",
    crm: "Housecall Pro",
    bookingRate: 63,
    peerBenchmark: 60,
    containment: 75,
    transferRate: 25,
    revenueBooked: 118500,
    revenueAtRisk: 3800,
    status: "healthy",
    topUnbookedReasons: [
      { label: "After-hours abandon", brandPct: 9, peerPct: 9 },
      { label: "Price objection", brandPct: 14, peerPct: 18 },
      { label: "Long hold time", brandPct: 11, peerPct: 14 },
      { label: "No availability", brandPct: 8, peerPct: 10 },
    ],
    dropOffStage: "None — performing at benchmark",
    recommendation: {
      summary: "Benchmark performer for Plumbing — strong after-hours routing.",
      fixLabel: "N/A",
      peerName: "N/A",
    },
  },
  {
    id: "volt-masters-electric",
    name: "Volt Masters Electric",
    trade: "Electrical",
    region: "Midwest",
    cohort: "2024",
    crm: "Housecall Pro",
    bookingRate: 62,
    peerBenchmark: 61,
    containment: 74,
    transferRate: 26,
    revenueBooked: 96300,
    revenueAtRisk: 2900,
    status: "healthy",
    topUnbookedReasons: [
      { label: "No technician available", brandPct: 17, peerPct: 17 },
      { label: "Price objection", brandPct: 14, peerPct: 16 },
      { label: "Chose competitor", brandPct: 12, peerPct: 13 },
      { label: "Callback not answered", brandPct: 9, peerPct: 11 },
    ],
    dropOffStage: "None — performing at benchmark",
    recommendation: {
      summary: "Solid performer — slightly above benchmark.",
      fixLabel: "N/A",
      peerName: "N/A",
    },
  },
  {
    id: "northeast-hvac-group",
    name: "Northeast HVAC Group",
    trade: "HVAC",
    region: "Northeast",
    cohort: "2024",
    crm: "Housecall Pro",
    bookingRate: 60,
    peerBenchmark: 58,
    containment: 72,
    transferRate: 28,
    revenueBooked: 131000,
    revenueAtRisk: 5100,
    status: "healthy",
    topUnbookedReasons: [
      { label: "Price objection", brandPct: 16, peerPct: 15 },
      { label: "Chose competitor", brandPct: 19, peerPct: 22 },
      { label: "No availability", brandPct: 14, peerPct: 18 },
      { label: "Callback no-answer", brandPct: 10, peerPct: 9 },
    ],
    dropOffStage: "None — performing above benchmark",
    recommendation: {
      summary: "Above-average performance for HVAC Northeast.",
      fixLabel: "N/A",
      peerName: "N/A",
    },
  },
  {
    id: "bayou-plumbing-pros",
    name: "Bayou Plumbing Pros",
    trade: "Plumbing",
    region: "Southeast",
    cohort: "2023",
    crm: "ServiceTitan",
    bookingRate: 59,
    peerBenchmark: 60,
    containment: 69,
    transferRate: 31,
    revenueBooked: 88700,
    revenueAtRisk: 6200,
    status: "healthy",
    topUnbookedReasons: [
      { label: "After-hours abandon", brandPct: 12, peerPct: 9 },
      { label: "Price objection", brandPct: 17, peerPct: 18 },
      { label: "Long hold time", brandPct: 14, peerPct: 14 },
      { label: "No availability", brandPct: 9, peerPct: 10 },
    ],
    dropOffStage: "None — near benchmark",
    recommendation: {
      summary: "Near benchmark — slight after-hours gap worth monitoring.",
      fixLabel: "N/A",
      peerName: "N/A",
    },
  },
  {
    id: "tri-state-electric",
    name: "Tri-State Electric",
    trade: "Electrical",
    region: "Northeast",
    cohort: "2025",
    crm: "ServiceTitan",
    bookingRate: 63,
    peerBenchmark: 61,
    containment: 76,
    transferRate: 24,
    revenueBooked: 104200,
    revenueAtRisk: 3100,
    status: "healthy",
    topUnbookedReasons: [
      { label: "No technician available", brandPct: 15, peerPct: 17 },
      { label: "Price objection", brandPct: 13, peerPct: 16 },
      { label: "Chose competitor", brandPct: 11, peerPct: 13 },
      { label: "Callback not answered", brandPct: 8, peerPct: 11 },
    ],
    dropOffStage: "None — performing above benchmark",
    recommendation: {
      summary: "Strong performer in Electrical Northeast.",
      fixLabel: "N/A",
      peerName: "N/A",
    },
  },
  {
    id: "carolina-air-systems",
    name: "Carolina Air Systems",
    trade: "HVAC",
    region: "Southeast",
    cohort: "2025",
    crm: "Housecall Pro",
    bookingRate: 57,
    peerBenchmark: 58,
    containment: 68,
    transferRate: 32,
    revenueBooked: 97500,
    revenueAtRisk: 7400,
    status: "healthy",
    topUnbookedReasons: [
      { label: "Price objection", brandPct: 16, peerPct: 15 },
      { label: "Chose competitor", brandPct: 20, peerPct: 22 },
      { label: "No availability", brandPct: 17, peerPct: 18 },
      { label: "Callback no-answer", brandPct: 11, peerPct: 9 },
    ],
    dropOffStage: "None — near benchmark",
    recommendation: {
      summary: "Slightly below benchmark — monitor over next 30 days.",
      fixLabel: "N/A",
      peerName: "N/A",
    },
  },
  {
    id: "great-lakes-plumbing",
    name: "Great Lakes Plumbing",
    trade: "Plumbing",
    region: "Midwest",
    cohort: "2024",
    crm: "ServiceTitan",
    bookingRate: 61,
    peerBenchmark: 60,
    containment: 73,
    transferRate: 27,
    revenueBooked: 109300,
    revenueAtRisk: 3500,
    status: "healthy",
    topUnbookedReasons: [
      { label: "After-hours abandon", brandPct: 10, peerPct: 9 },
      { label: "Price objection", brandPct: 16, peerPct: 18 },
      { label: "Long hold time", brandPct: 13, peerPct: 14 },
      { label: "No availability", brandPct: 9, peerPct: 10 },
    ],
    dropOffStage: "None — performing at benchmark",
    recommendation: {
      summary: "Solid performer above average.",
      fixLabel: "N/A",
      peerName: "N/A",
    },
  },
  {
    id: "rockies-hvac",
    name: "Rockies HVAC",
    trade: "HVAC",
    region: "Midwest",
    cohort: "2023",
    crm: "ServiceTitan",
    bookingRate: 59,
    peerBenchmark: 58,
    containment: 70,
    transferRate: 30,
    revenueBooked: 88900,
    revenueAtRisk: 5800,
    status: "healthy",
    topUnbookedReasons: [
      { label: "Price objection", brandPct: 15, peerPct: 15 },
      { label: "Chose competitor", brandPct: 21, peerPct: 22 },
      { label: "No availability", brandPct: 16, peerPct: 18 },
      { label: "Callback no-answer", brandPct: 9, peerPct: 9 },
    ],
    dropOffStage: "None — performing at benchmark",
    recommendation: {
      summary: "At benchmark — stable performer.",
      fixLabel: "N/A",
      peerName: "N/A",
    },
  },
  {
    id: "appalachian-electric",
    name: "Appalachian Electric",
    trade: "Electrical",
    region: "Southeast",
    cohort: "2023",
    crm: "Housecall Pro",
    bookingRate: 62,
    peerBenchmark: 61,
    containment: 75,
    transferRate: 25,
    revenueBooked: 91700,
    revenueAtRisk: 3000,
    status: "healthy",
    topUnbookedReasons: [
      { label: "No technician available", brandPct: 16, peerPct: 17 },
      { label: "Price objection", brandPct: 14, peerPct: 16 },
      { label: "Chose competitor", brandPct: 12, peerPct: 13 },
      { label: "Callback not answered", brandPct: 10, peerPct: 11 },
    ],
    dropOffStage: "None — above benchmark",
    recommendation: {
      summary: "Consistent above-benchmark performer.",
      fixLabel: "N/A",
      peerName: "N/A",
    },
  },
  {
    id: "lone-star-electric",
    name: "Lone Star Electric",
    trade: "Electrical",
    region: "Southwest",
    cohort: "2025",
    crm: "ServiceTitan",
    bookingRate: 64,
    peerBenchmark: 61,
    containment: 77,
    transferRate: 23,
    revenueBooked: 113500,
    revenueAtRisk: 2700,
    status: "healthy",
    topUnbookedReasons: [
      { label: "No technician available", brandPct: 14, peerPct: 17 },
      { label: "Price objection", brandPct: 12, peerPct: 16 },
      { label: "Chose competitor", brandPct: 11, peerPct: 13 },
      { label: "Callback not answered", brandPct: 8, peerPct: 11 },
    ],
    dropOffStage: "None — strong performer",
    recommendation: {
      summary: "Top performer in Electrical Southwest.",
      fixLabel: "N/A",
      peerName: "N/A",
    },
  },
];

export function sortBrandsWorstFirst(brands: Brand[]): Brand[] {
  return [...brands].sort((a, b) => {
    // Recovered brands always go to the bottom
    if (a.status === "recovered" && b.status !== "recovered") return 1;
    if (b.status === "recovered" && a.status !== "recovered") return -1;
    // Sort by (gap * revenueAtRisk) descending
    const scoreA = (a.peerBenchmark - a.bookingRate) * a.revenueAtRisk;
    const scoreB = (b.peerBenchmark - b.bookingRate) * b.revenueAtRisk;
    return scoreB - scoreA;
  });
}
