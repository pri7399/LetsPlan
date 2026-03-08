import { pct } from "./calc";

export async function exportToXLSX({
  yearData, currentAge, retirementAge, expensesUntilAge, currentSavings,
  monthlyInvestment, stepUp, postRetirementMonthly, inflation,
  currentBlended, coastBlended, retBlended, sips, totalSIP,
  currentApproach, coastApproach, retApproach,
  retirementCorpus, corpusAtWithdrawal, coastGrowth,
  peakSavings, lastPositiveAge, isFullyFunded,
  coastEnabled, coastYears, withdrawalStartAge, yearlyBumps,
}) {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();

  // Main projection (include bump column)
  const ws1 = XLSX.utils.json_to_sheet(yearData.rows.map((r) => ({
    "Age": r.age, "Starting Saving": r.startingSaving, "Planned Expenses": r.plannedExpenses,
    "Add'l Savings": r.additionalSavings, "Ending Savings": r.endingSaving, "Status": r.status,
    "Saving/Mo": r.savingMonth, "Interest Earned": r.interestEarned,
    "Monthly Bump": r.bump || 0, "Min Target SIP": r.minTargetSIP,
  })));
  ws1["!cols"] = Array(10).fill({ wch: 18 });
  XLSX.utils.book_append_sheet(wb, ws1, "Yearly Projection");

  // Summary
  const sum = [
    ["Retirement Calculator Summary", ""], ["", ""],
    ["Current Age", currentAge], ["Retirement Age", retirementAge],
    ["Coast FIRE", coastEnabled ? "Yes" : "No"],
    ...(coastEnabled ? [["Coast Years", coastYears], ["Withdrawal Start Age", withdrawalStartAge], ["Coast Blended Return", pct(coastBlended.grossReturn)], ["Corpus Growth During Coast", coastGrowth]] : []),
    ["Expenses Until Age", expensesUntilAge], ["Current Savings", currentSavings],
    ["Monthly Investment", monthlyInvestment], ["Step-up Rate", `${stepUp}%`],
    ["Post-retirement Monthly", postRetirementMonthly], ["Inflation", `${inflation}%`], ["", ""],
    ["Earning Blended Return", pct(currentBlended.grossReturn)],
    ["Retirement Blended Return", pct(retBlended.grossReturn)], ["", ""],
    ["Retirement Corpus", retirementCorpus],
    ...(coastEnabled ? [["Corpus at Withdrawal", corpusAtWithdrawal]] : []),
    ["Peak Savings", peakSavings], ["Total Principal", yearData.totalPrincipal],
    ["Total Interest", yearData.totalInterest], ["Money Lasts Until", lastPositiveAge],
    ["Status", isFullyFunded ? "Fully Funded" : "Shortfall"],
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(sum);
  ws2["!cols"] = [{ wch: 35 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws2, "Summary");

  // SIP
  const sipD = [...sips.map((s) => ({ "Fund": s.name, "Monthly": s.amount })), { "Fund": "TOTAL", "Monthly": totalSIP }];
  const ws3 = XLSX.utils.json_to_sheet(sipD);
  ws3["!cols"] = [{ wch: 25 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, ws3, "SIP");

  // Approach sheets with fund names
  const mkSheet = (ap, name) => {
    const ws = XLSX.utils.json_to_sheet(ap.map((a) => ({
      "Category": a.category, "Fund": a.name, "Returns": pct(a.returns), "Tax": pct(a.tax), "Share": pct(a.share),
      "Monthly Alloc": monthlyInvestment ? Math.round(monthlyInvestment * a.share) : "",
    })));
    ws["!cols"] = [{ wch: 12 }, { wch: 28 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, ws, name);
  };
  mkSheet(currentApproach, "Earning Approach");
  if (coastEnabled) mkSheet(coastApproach, "Coast Approach");
  mkSheet(retApproach, "Retirement Approach");

  // Yearly bumps sheet
  const bumpEntries = Object.entries(yearlyBumps || {}).filter(([, v]) => v > 0);
  if (bumpEntries.length > 0) {
    const bumpData = bumpEntries.map(([age, amount]) => ({ "Age": Number(age), "Extra Monthly": amount }));
    const ws4 = XLSX.utils.json_to_sheet(bumpData);
    ws4["!cols"] = [{ wch: 10 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws4, "Yearly Bumps");
  }

  XLSX.writeFile(wb, "retirement_plan.xlsx");
}

export function exportToCSV(yearData) {
  let csv = "Age,Starting Saving,Planned Expenses,Add'l Savings,Ending Savings,Status,Interest Earned,Monthly Save,Bump\n";
  yearData.rows.forEach((r) => {
    csv += `${r.age},${r.startingSaving},${r.plannedExpenses},${r.additionalSavings},${r.endingSaving},${r.status},${r.interestEarned},${r.savingMonth},${r.bump || 0}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "retirement_plan.csv";
  a.click();
}
