export type Trade = "HVAC" | "Plumbing" | "Electrical";
export type Region = "Southwest" | "Southeast" | "Northeast" | "Midwest";
export type Cohort = "2023" | "2024" | "2025";
export type Crm = "ServiceTitan" | "Housecall Pro";
export type Status = "healthy" | "slipping" | "recovered" | "ramping";

export interface UnbookedReason {
  label: string;
  brandPct: number;
  peerPct: number;
  lever: string;        // config section that fixes it
  recoverable: boolean; // false = structural (out of area, not offered, etc.)
}

export interface ProductStatus {
  purchased: boolean;
  live: boolean;
  setupDone: number;
  setupTotal: number;
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
  recoverableAtRisk: number; // subset of revenueAtRisk from addressable reasons
  callVolume: number;        // monthly call volume; below RAMPING_THRESHOLD → "ramping"
  bookingTrend: { delta: number; weeks: number }; // recent window; negative = declining
  status: Status;
  topUnbookedReasons: UnbookedReason[];
  dropOffStage: string;
  recommendation: {
    summary: string;
    fixLabel: string; // lever name — maps to the highlighted config section
    peerName: string;
  };
  products: {
    responder: ProductStatus;
    coach: ProductStatus;
    outbound: ProductStatus;
    speedToLead: ProductStatus;
  };
}

export const RAMPING_THRESHOLD = 150; // calls/month below this → "ramping"

export const initialBrands: Brand[] = [
  // ── SLIPPING BRANDS ───────────────────────────────────────────────────────
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
    recoverableAtRisk: 38000, // 67% of reasons are recoverable (excl. "chose competitor")
    callVolume: 580,
    bookingTrend: { delta: -6, weeks: 4 },
    status: "slipping",
    topUnbookedReasons: [
      { label: "Price objection",  brandPct: 31, peerPct: 15, lever: "Objection Handling",           recoverable: true  },
      { label: "Unavailable slot", brandPct: 22, peerPct: 18, lever: "Booking Windows",               recoverable: true  },
      { label: "Chose competitor", brandPct: 18, peerPct: 22, lever: "Competitive (structural)",       recoverable: false },
      { label: "No follow-up",     brandPct: 14, peerPct: 9,  lever: "Knowledge Base / Escalation",   recoverable: true  },
    ],
    dropOffStage: "Quote stage",
    recommendation: {
      summary: "Losing 2× its peers to price objections at the quote stage.",
      fixLabel: "Objection Handling",
      peerName: "Desert Comfort HVAC",
    },
    products: {
      responder:   { purchased: true,  live: true,  setupDone: 5, setupTotal: 5 },
      coach:       { purchased: true,  live: false, setupDone: 2, setupTotal: 5 },
      outbound:    { purchased: true,  live: false, setupDone: 1, setupTotal: 5 },
      speedToLead: { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
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
    recoverableAtRisk: 22000, // all four reasons are recoverable
    callVolume: 340,
    bookingTrend: { delta: -4, weeks: 4 },
    status: "slipping",
    topUnbookedReasons: [
      { label: "After-hours abandon", brandPct: 24, peerPct: 9,  lever: "After-Hours Routing",         recoverable: true },
      { label: "Long hold time",      brandPct: 19, peerPct: 14, lever: "Knowledge Base / Escalation", recoverable: true },
      { label: "Price objection",     brandPct: 16, peerPct: 18, lever: "Objection Handling",           recoverable: true },
      { label: "No availability",     brandPct: 12, peerPct: 10, lever: "Booking Windows",              recoverable: true },
    ],
    dropOffStage: "After-hours routing",
    recommendation: {
      summary: "After-hours calls abandoning at 2.7× the peer rate — routing gap.",
      fixLabel: "After-Hours Routing",
      peerName: "Gulf Coast Plumbers",
    },
    products: {
      responder:   { purchased: true,  live: false, setupDone: 3, setupTotal: 5 },
      coach:       { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
      outbound:    { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
      speedToLead: { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
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
    recoverableAtRisk: 12300, // excl. "chose competitor"
    callVolume: 410,
    bookingTrend: { delta: -3, weeks: 3 },
    status: "slipping",
    topUnbookedReasons: [
      { label: "No technician available", brandPct: 28, peerPct: 17, lever: "Booking Windows / On-Call Calendar", recoverable: true  },
      { label: "Price objection",         brandPct: 19, peerPct: 16, lever: "Objection Handling",                 recoverable: true  },
      { label: "Callback not answered",   brandPct: 15, peerPct: 11, lever: "Knowledge Base / Escalation",        recoverable: true  },
      { label: "Chose competitor",        brandPct: 11, peerPct: 13, lever: "Competitive (structural)",           recoverable: false },
    ],
    dropOffStage: "Scheduling",
    recommendation: {
      summary: "Losing 1.6× peers at scheduling due to technician availability gaps.",
      fixLabel: "Booking Windows / On-Call Calendar",
      peerName: "Volt Masters Electric",
    },
    products: {
      responder:   { purchased: true,  live: true,  setupDone: 5, setupTotal: 5 },
      coach:       { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
      outbound:    { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
      speedToLead: { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
    },
  },

  // ── HEALTHY BRANDS ────────────────────────────────────────────────────────
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
    recoverableAtRisk: 2600,
    callVolume: 720,
    bookingTrend: { delta: 2, weeks: 4 },
    status: "healthy",
    topUnbookedReasons: [
      { label: "Price objection",  brandPct: 15, peerPct: 15, lever: "Objection Handling",           recoverable: true  },
      { label: "Chose competitor", brandPct: 21, peerPct: 22, lever: "Competitive (structural)",       recoverable: false },
      { label: "No availability",  brandPct: 10, peerPct: 18, lever: "Booking Windows",               recoverable: true  },
      { label: "Callback no-answer", brandPct: 8, peerPct: 9, lever: "Knowledge Base / Escalation",   recoverable: true  },
    ],
    dropOffStage: "None — performing above benchmark",
    recommendation: {
      summary: "Top performer — benchmark for HVAC Southwest.",
      fixLabel: "N/A",
      peerName: "N/A",
    },
    products: {
      responder:   { purchased: true, live: true, setupDone: 5, setupTotal: 5 },
      coach:       { purchased: true, live: true, setupDone: 5, setupTotal: 5 },
      outbound:    { purchased: true, live: true, setupDone: 5, setupTotal: 5 },
      speedToLead: { purchased: true, live: true, setupDone: 5, setupTotal: 5 },
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
    recoverableAtRisk: 3800,
    callVolume: 540,
    bookingTrend: { delta: 1, weeks: 4 },
    status: "healthy",
    topUnbookedReasons: [
      { label: "After-hours abandon", brandPct: 9,  peerPct: 9,  lever: "After-Hours Routing",         recoverable: true },
      { label: "Price objection",     brandPct: 14, peerPct: 18, lever: "Objection Handling",           recoverable: true },
      { label: "Long hold time",      brandPct: 11, peerPct: 14, lever: "Knowledge Base / Escalation",  recoverable: true },
      { label: "No availability",     brandPct: 8,  peerPct: 10, lever: "Booking Windows",              recoverable: true },
    ],
    dropOffStage: "None — performing at benchmark",
    recommendation: {
      summary: "Benchmark performer for Plumbing — strong after-hours routing.",
      fixLabel: "N/A",
      peerName: "N/A",
    },
    products: {
      responder:   { purchased: true, live: true,  setupDone: 5, setupTotal: 5 },
      coach:       { purchased: true, live: true,  setupDone: 5, setupTotal: 5 },
      outbound:    { purchased: true, live: false, setupDone: 4, setupTotal: 5 },
      speedToLead: { purchased: true, live: false, setupDone: 2, setupTotal: 5 },
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
    recoverableAtRisk: 2200,
    callVolume: 490,
    bookingTrend: { delta: 0, weeks: 4 },
    status: "healthy",
    topUnbookedReasons: [
      { label: "No technician available", brandPct: 17, peerPct: 17, lever: "Booking Windows / On-Call Calendar", recoverable: true  },
      { label: "Price objection",         brandPct: 14, peerPct: 16, lever: "Objection Handling",                 recoverable: true  },
      { label: "Chose competitor",        brandPct: 12, peerPct: 13, lever: "Competitive (structural)",           recoverable: false },
      { label: "Callback not answered",   brandPct: 9,  peerPct: 11, lever: "Knowledge Base / Escalation",        recoverable: true  },
    ],
    dropOffStage: "None — performing at benchmark",
    recommendation: {
      summary: "Solid performer — slightly above benchmark.",
      fixLabel: "N/A",
      peerName: "N/A",
    },
    products: {
      responder:   { purchased: true, live: true,  setupDone: 5, setupTotal: 5 },
      coach:       { purchased: true, live: false, setupDone: 3, setupTotal: 5 },
      outbound:    { purchased: true, live: true,  setupDone: 5, setupTotal: 5 },
      speedToLead: { purchased: true, live: false, setupDone: 3, setupTotal: 5 },
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
    recoverableAtRisk: 3500,
    callVolume: 610,
    bookingTrend: { delta: 1, weeks: 4 },
    status: "healthy",
    topUnbookedReasons: [
      { label: "Price objection",    brandPct: 16, peerPct: 15, lever: "Objection Handling",           recoverable: true  },
      { label: "Chose competitor",   brandPct: 19, peerPct: 22, lever: "Competitive (structural)",     recoverable: false },
      { label: "No availability",    brandPct: 14, peerPct: 18, lever: "Booking Windows",              recoverable: true  },
      { label: "Callback no-answer", brandPct: 10, peerPct: 9,  lever: "Knowledge Base / Escalation",  recoverable: true  },
    ],
    dropOffStage: "None — performing above benchmark",
    recommendation: {
      summary: "Above-average performance for HVAC Northeast.",
      fixLabel: "N/A",
      peerName: "N/A",
    },
    products: {
      responder:   { purchased: true, live: true, setupDone: 5, setupTotal: 5 },
      coach:       { purchased: true, live: true, setupDone: 5, setupTotal: 5 },
      outbound:    { purchased: true, live: true, setupDone: 5, setupTotal: 5 },
      speedToLead: { purchased: true, live: true, setupDone: 5, setupTotal: 5 },
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
    recoverableAtRisk: 6200,
    callVolume: 380,
    bookingTrend: { delta: -1, weeks: 4 },
    status: "healthy",
    topUnbookedReasons: [
      { label: "After-hours abandon", brandPct: 12, peerPct: 9,  lever: "After-Hours Routing",         recoverable: true },
      { label: "Price objection",     brandPct: 17, peerPct: 18, lever: "Objection Handling",           recoverable: true },
      { label: "Long hold time",      brandPct: 14, peerPct: 14, lever: "Knowledge Base / Escalation",  recoverable: true },
      { label: "No availability",     brandPct: 9,  peerPct: 10, lever: "Booking Windows",              recoverable: true },
    ],
    dropOffStage: "None — near benchmark",
    recommendation: {
      summary: "Near benchmark — slight after-hours gap worth monitoring.",
      fixLabel: "N/A",
      peerName: "N/A",
    },
    products: {
      responder:   { purchased: true,  live: true,  setupDone: 5, setupTotal: 5 },
      coach:       { purchased: true,  live: false, setupDone: 0, setupTotal: 5 },
      outbound:    { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
      speedToLead: { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
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
    recoverableAtRisk: 2400,
    callVolume: 290,
    bookingTrend: { delta: 2, weeks: 4 },
    status: "healthy",
    topUnbookedReasons: [
      { label: "No technician available", brandPct: 15, peerPct: 17, lever: "Booking Windows / On-Call Calendar", recoverable: true  },
      { label: "Price objection",         brandPct: 13, peerPct: 16, lever: "Objection Handling",                 recoverable: true  },
      { label: "Chose competitor",        brandPct: 11, peerPct: 13, lever: "Competitive (structural)",           recoverable: false },
      { label: "Callback not answered",   brandPct: 8,  peerPct: 11, lever: "Knowledge Base / Escalation",        recoverable: true  },
    ],
    dropOffStage: "None — performing above benchmark",
    recommendation: {
      summary: "Strong performer in Electrical Northeast.",
      fixLabel: "N/A",
      peerName: "N/A",
    },
    products: {
      responder:   { purchased: true,  live: true,  setupDone: 5, setupTotal: 5 },
      coach:       { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
      outbound:    { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
      speedToLead: { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
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
    recoverableAtRisk: 3500,
    callVolume: 450,
    bookingTrend: { delta: 1, weeks: 4 },
    status: "healthy",
    topUnbookedReasons: [
      { label: "After-hours abandon", brandPct: 10, peerPct: 9,  lever: "After-Hours Routing",         recoverable: true },
      { label: "Price objection",     brandPct: 16, peerPct: 18, lever: "Objection Handling",           recoverable: true },
      { label: "Long hold time",      brandPct: 13, peerPct: 14, lever: "Knowledge Base / Escalation",  recoverable: true },
      { label: "No availability",     brandPct: 9,  peerPct: 10, lever: "Booking Windows",              recoverable: true },
    ],
    dropOffStage: "None — performing at benchmark",
    recommendation: {
      summary: "Solid above-average performer.",
      fixLabel: "N/A",
      peerName: "N/A",
    },
    products: {
      responder:   { purchased: true,  live: true,  setupDone: 5, setupTotal: 5 },
      coach:       { purchased: true,  live: true,  setupDone: 5, setupTotal: 5 },
      outbound:    { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
      speedToLead: { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
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
    recoverableAtRisk: 3800,
    callVolume: 360,
    bookingTrend: { delta: 0, weeks: 4 },
    status: "healthy",
    topUnbookedReasons: [
      { label: "Price objection",    brandPct: 15, peerPct: 15, lever: "Objection Handling",           recoverable: true  },
      { label: "Chose competitor",   brandPct: 21, peerPct: 22, lever: "Competitive (structural)",     recoverable: false },
      { label: "No availability",    brandPct: 16, peerPct: 18, lever: "Booking Windows",              recoverable: true  },
      { label: "Callback no-answer", brandPct: 9,  peerPct: 9,  lever: "Knowledge Base / Escalation",  recoverable: true  },
    ],
    dropOffStage: "None — performing at benchmark",
    recommendation: {
      summary: "At benchmark — stable performer.",
      fixLabel: "N/A",
      peerName: "N/A",
    },
    products: {
      responder:   { purchased: true,  live: true,  setupDone: 5, setupTotal: 5 },
      coach:       { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
      outbound:    { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
      speedToLead: { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
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
    recoverableAtRisk: 2300,
    callVolume: 480,
    bookingTrend: { delta: 1, weeks: 4 },
    status: "healthy",
    topUnbookedReasons: [
      { label: "No technician available", brandPct: 16, peerPct: 17, lever: "Booking Windows / On-Call Calendar", recoverable: true  },
      { label: "Price objection",         brandPct: 14, peerPct: 16, lever: "Objection Handling",                 recoverable: true  },
      { label: "Chose competitor",        brandPct: 12, peerPct: 13, lever: "Competitive (structural)",           recoverable: false },
      { label: "Callback not answered",   brandPct: 10, peerPct: 11, lever: "Knowledge Base / Escalation",        recoverable: true  },
    ],
    dropOffStage: "None — above benchmark",
    recommendation: {
      summary: "Consistent above-benchmark performer.",
      fixLabel: "N/A",
      peerName: "N/A",
    },
    products: {
      responder:   { purchased: true,  live: true,  setupDone: 5, setupTotal: 5 },
      coach:       { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
      outbound:    { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
      speedToLead: { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
    },
  },

  // ── RAMPING BRANDS (below volume threshold — excluded from worst-first) ──
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
    revenueBooked: 22100,
    revenueAtRisk: 7400,
    recoverableAtRisk: 5100,
    callVolume: 95,           // below RAMPING_THRESHOLD
    bookingTrend: { delta: 0, weeks: 2 },
    status: "ramping",
    topUnbookedReasons: [
      { label: "Price objection",  brandPct: 16, peerPct: 15, lever: "Objection Handling",           recoverable: true  },
      { label: "Chose competitor", brandPct: 20, peerPct: 22, lever: "Competitive (structural)",     recoverable: false },
      { label: "No availability",  brandPct: 17, peerPct: 18, lever: "Booking Windows",              recoverable: true  },
      { label: "Callback no-answer", brandPct: 11, peerPct: 9, lever: "Knowledge Base / Escalation", recoverable: true  },
    ],
    dropOffStage: "Ramping — insufficient volume for reliable signal",
    recommendation: {
      summary: "Insufficient call volume for reliable diagnosis. Check back after 150+ calls.",
      fixLabel: "N/A",
      peerName: "N/A",
    },
    products: {
      responder:   { purchased: true,  live: false, setupDone: 1, setupTotal: 5 },
      coach:       { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
      outbound:    { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
      speedToLead: { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
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
    revenueBooked: 18400,
    revenueAtRisk: 2700,
    recoverableAtRisk: 2000,
    callVolume: 120,          // below RAMPING_THRESHOLD
    bookingTrend: { delta: 3, weeks: 2 },
    status: "ramping",
    topUnbookedReasons: [
      { label: "No technician available", brandPct: 14, peerPct: 17, lever: "Booking Windows / On-Call Calendar", recoverable: true  },
      { label: "Price objection",         brandPct: 12, peerPct: 16, lever: "Objection Handling",                 recoverable: true  },
      { label: "Chose competitor",        brandPct: 11, peerPct: 13, lever: "Competitive (structural)",           recoverable: false },
      { label: "Callback not answered",   brandPct: 8,  peerPct: 11, lever: "Knowledge Base / Escalation",        recoverable: true  },
    ],
    dropOffStage: "Ramping — insufficient volume for reliable signal",
    recommendation: {
      summary: "Insufficient call volume for reliable diagnosis. Check back after 150+ calls.",
      fixLabel: "N/A",
      peerName: "N/A",
    },
    products: {
      responder:   { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
      coach:       { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
      outbound:    { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
      speedToLead: { purchased: false, live: false, setupDone: 0, setupTotal: 5 },
    },
  },
];

export function sortBrandsWorstFirst(brands: Brand[]): Brand[] {
  return [...brands].sort((a, b) => {
    // Ramping always at the bottom
    if (a.status === "ramping" && b.status !== "ramping") return 1;
    if (b.status === "ramping" && a.status !== "ramping") return -1;
    // Recovered second-to-bottom
    if (a.status === "recovered" && b.status !== "recovered") return 1;
    if (b.status === "recovered" && a.status !== "recovered") return -1;
    // Sort by recoverable at-risk descending
    return b.recoverableAtRisk - a.recoverableAtRisk;
  });
}
