export const fmt = (n) => {
  if (n == null || isNaN(n)) return "₹0";
  const abs = Math.abs(Math.round(n));
  const s = abs.toLocaleString("en-IN");
  return n < 0 ? `(₹${s})` : `₹${s}`;
};

export const pct = (n) => (n * 100).toFixed(1) + "%";

export const computeBlended = (approach) => {
  const totalShare = approach.reduce((s, a) => s + a.share, 0);
  const wtdTax = approach.reduce((s, a) => s + a.tax * a.share, 0) / (totalShare || 1);
  const grossReturn = approach.reduce((s, a) => s + a.returns * a.share, 0) - 0.02; // Reduce by 2% for worst case
  const postTaxReturn = approach.reduce((s, a) => s + a.returns * (1 - a.tax) * a.share, 0) - 0.02; // Reduce by 2% for worst case
  return { totalShare, wtdTax, grossReturn, postTaxReturn };
};

export const FUND_CATALOG = {
  fixed: {
    label: "Fixed / Debt",
    funds: [
      { id: "epf", name: "EPF / VPF", returns: 0.0815, desc: "8.15%" },
      { id: "ppf", name: "PPF", returns: 0.071, desc: "7.1%" },
      { id: "sgb", name: "Sovereign Gold Bonds", returns: 0.08, desc: "~8%" },
      { id: "arb", name: "Arbitrage Fund", returns: 0.075, desc: "~7.5%" },
      { id: "gold_etf", name: "Gold ETF", returns: 0.10, desc: "~10%" },
      { id: "debt_mf", name: "Debt Mutual Fund", returns: 0.07, desc: "~7%" },
      { id: "fd", name: "Bank FD", returns: 0.07, desc: "~7%" },
      { id: "nps_d", name: "NPS Tier 1 (Govt Sec)", returns: 0.09, desc: "~9%" },
    ],
  },
  largecap: {
    label: "Large & Flexi Cap",
    funds: [
      { id: "parag_flexi", name: "Parag Parikh Flexi Cap", returns: 0.155, desc: "~15.5%" },
      { id: "hdfc_flexi", name: "HDFC Flexi Cap", returns: 0.14, desc: "~14%" },
      { id: "nifty50", name: "Nifty 50 Index Fund", returns: 0.12, desc: "~12%" },
      { id: "nasdaq", name: "NASDAQ 100 FoF", returns: 0.16, desc: "~16%" },
      { id: "kotak_flexi", name: "Kotak Flexi Cap", returns: 0.135, desc: "~13.5%" },
      { id: "mirae_large", name: "Mirae Large Cap", returns: 0.135, desc: "~13.5%" },
      { id: "sbi_blue", name: "SBI Blue Chip", returns: 0.12, desc: "~12%" },
    ],
  },
  midcap: {
    label: "Midcap",
    funds: [
      { id: "hdfc_mid", name: "HDFC Midcap Opp.", returns: 0.18, desc: "~18%" },
      { id: "kotak_emg", name: "Kotak Emerging Equity", returns: 0.17, desc: "~17%" },
      { id: "motilal_mid", name: "Motilal Midcap", returns: 0.20, desc: "~20%" },
      { id: "nn50", name: "Nifty Next 50 Index", returns: 0.14, desc: "~14%" },
      { id: "axis_mid", name: "Axis Midcap", returns: 0.16, desc: "~16%" },
      { id: "dsp_mid", name: "DSP Midcap", returns: 0.17, desc: "~17%" },
    ],
  },
  smallcap: {
    label: "Smallcap",
    funds: [
      { id: "hdfc_small", name: "HDFC Small Cap", returns: 0.20, desc: "~20%" },
      { id: "nippon_small", name: "Nippon Small Cap", returns: 0.22, desc: "~22%" },
      { id: "quant_small", name: "Quant Small Cap", returns: 0.25, desc: "~25%" },
      { id: "sbi_small", name: "SBI Small Cap", returns: 0.20, desc: "~20%" },
      { id: "axis_small", name: "Axis Small Cap", returns: 0.18, desc: "~18%" },
      { id: "tata_small", name: "Tata Small Cap", returns: 0.21, desc: "~21%" },
    ],
  },
};

export const getFund = (category, fundId) => {
  const cat = FUND_CATALOG[category];
  return cat?.funds.find((f) => f.id === fundId) || cat?.funds[0];
};

export const buildDefaultApproach = () => [
  { category: "fixed", fundId: "epf", name: "EPF / VPF", returns: 0.0815, tax: 0.0, share: 0.30 },
  { category: "largecap", fundId: "hdfc_flexi", name: "HDFC Flexi Cap", returns: 0.14, tax: 0.125, share: 0.35 },
  { category: "midcap", fundId: "hdfc_mid", name: "HDFC Midcap Opp.", returns: 0.18, tax: 0.125, share: 0.20 },
  { category: "smallcap", fundId: "nippon_small", name: "Nippon Small Cap", returns: 0.22, tax: 0.125, share: 0.15 },
];

export const buildCoastApproach = () => [
  { category: "fixed", fundId: "gold_etf", name: "Gold ETF", returns: 0.10, tax: 0.125, share: 0.15 },
  { category: "largecap", fundId: "hdfc_flexi", name: "HDFC Flexi Cap", returns: 0.14, tax: 0.125, share: 0.35 },
  { category: "midcap", fundId: "hdfc_mid", name: "HDFC Midcap Opp.", returns: 0.18, tax: 0.125, share: 0.25 },
  { category: "smallcap", fundId: "nippon_small", name: "Nippon Small Cap", returns: 0.22, tax: 0.125, share: 0.25 },
];

export const buildRetirementApproach = () => [
  { category: "fixed", fundId: "arb", name: "Arbitrage Fund", returns: 0.075, tax: 0.125, share: 0.35 },
  { category: "largecap", fundId: "hdfc_flexi", name: "HDFC Flexi Cap", returns: 0.14, tax: 0.125, share: 0.40 },
  { category: "midcap", fundId: "hdfc_mid", name: "HDFC Midcap Opp.", returns: 0.18, tax: 0.125, share: 0.15 },
  { category: "smallcap", fundId: "nippon_small", name: "Nippon Small Cap", returns: 0.22, tax: 0.125, share: 0.10 },
];
