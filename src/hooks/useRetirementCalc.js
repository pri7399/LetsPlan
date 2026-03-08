import { useMemo } from "react";

export function useRetirementCalc({
  currentAge, retirementAge, expensesUntilAge, currentSavings,
  monthlyInvestment, stepUp, postRetirementMonthly, inflation,
  currentBlended, coastBlended, retBlended,
  coastEnabled, coastYears, additionalExpenses, yearlyBumps, majorWithdrawals, realEstateAssets,
}) {
  const withdrawalStartAge = coastEnabled ? retirementAge + coastYears : retirementAge;

  const yearData = useMemo(() => {
    const rows = [];
    const inf = inflation / 100;
    const stepUpRate = stepUp / 100;
    const earningRate = currentBlended.grossReturn;
    const cRate = coastBlended.grossReturn;
    const retiredRate = retBlended.grossReturn;
    const wsAge = coastEnabled ? retirementAge + coastYears : retirementAge;

    let savings = currentSavings;
    let monthlySaving = monthlyInvestment;
    let totalPrincipal = currentSavings;
    let totalInterest = 0;

    for (let age = currentAge; age <= expensesUntilAge + 1; age++) {
      const isEarning = age < retirementAge;
      const isCoasting = coastEnabled && age >= retirementAge && age < wsAge;
      const isRetired = age >= wsAge && age < expensesUntilAge;
      const isDead = age >= expensesUntilAge;

      let status;
      if (isEarning) status = "Earning";
      else if (isCoasting) status = "Coasting";
      else if (isRetired) status = "Retired";
      else status = "Dead";

      // Apply yearly bump BEFORE computing this year's savings
      // Bumps are one-time lump sum additions, not monthly increases
      const bumpData = (yearlyBumps && yearlyBumps[age]) || null;
      let oneTimeBump = 0;
      if (!isDead && bumpData) {
        oneTimeBump = bumpData.amount || bumpData; // Handle both old and new format
      }

      // Apply major withdrawal (reduces current savings)
      const withdrawal = (majorWithdrawals && majorWithdrawals[age]) || null;
      if (withdrawal && !isDead) {
        savings -= withdrawal.total; // Deduct withdrawal + tax from current savings
      }

      const annualInvestment = monthlySaving * 12;

      let plannedExpenses = 0;
      if (isRetired) {
        const yearsOfInflation = age - currentAge;
        let baseExpenses = postRetirementMonthly * 12 * Math.pow(1 + inf, yearsOfInflation);
        // Reduce expenses by 50% after age 65 (home paid off, children independent)
        if (age >= 65) {
          baseExpenses = baseExpenses * 0.5;
        }
        plannedExpenses = baseExpenses;
      }

      const addlExpense = (additionalExpenses && additionalExpenses[age]) || 0;
      const addlSavings = isEarning ? annualInvestment + oneTimeBump : oneTimeBump; // Add one-time bump to this year's savings
      const startingSaving = savings;

      let rate = 0;
      if (isEarning) rate = earningRate;
      else if (isCoasting) rate = cRate;
      else if (isRetired) rate = retiredRate;

      const interestEarned = isDead ? 0 : startingSaving * rate;
      
      // Calculate real estate appreciation
      let realEstateGrowth = 0;
      if (!isDead && realEstateAssets) {
        Object.values(realEstateAssets).forEach(asset => {
          if (age > asset.purchaseAge) {
            const yearsHeld = age - asset.purchaseAge;
            const currentValue = asset.initialValue * Math.pow(1 + asset.appreciationRate, yearsHeld);
            const previousValue = asset.initialValue * Math.pow(1 + asset.appreciationRate, yearsHeld - 1);
            realEstateGrowth += (currentValue - previousValue);
          }
        });
      }
      
      const endingSaving = isDead ? 0 : startingSaving - plannedExpenses - addlExpense + addlSavings + interestEarned + realEstateGrowth;

      if (!isDead) {
        if (isEarning) totalPrincipal += addlSavings;
        totalInterest += interestEarned;
      }

      rows.push({
        age,
        startingSaving: Math.round(startingSaving),
        plannedExpenses: Math.round(plannedExpenses),
        additionalExpenses: Math.round(addlExpense),
        additionalSavings: Math.round(addlSavings),
        endingSaving: Math.round(endingSaving),
        status,
        savingMonth: Math.round(isEarning ? monthlySaving : 0),
        savingMonthWithoutPF: Math.round(isEarning ? monthlySaving * 0.7 : 0), // 70% goes to non-PF investments
        pfContribution: Math.round(isEarning ? monthlySaving * 0.3 : 0), // 30% goes to PF
        interestEarned: Math.round(interestEarned),
        realEstateGrowth: Math.round(realEstateGrowth),
        realEstateValue: Math.round(realEstateAssets ? Object.values(realEstateAssets).reduce((total, asset) => {
          if (age > asset.purchaseAge) {
            const yearsHeld = age - asset.purchaseAge;
            return total + asset.initialValue * Math.pow(1 + asset.appreciationRate, yearsHeld);
          }
          return total;
        }, 0) : 0),
        totalAssets: Math.round(endingSaving + (realEstateAssets ? Object.values(realEstateAssets).reduce((total, asset) => {
          if (age > asset.purchaseAge) {
            const yearsHeld = age - asset.purchaseAge;
            return total + asset.initialValue * Math.pow(1 + asset.appreciationRate, yearsHeld);
          }
          return total;
        }, 0) : 0)),
        minTargetSIP: Math.round(isEarning ? monthlySaving * 0.7 : 0),
        bump: oneTimeBump,
        withdrawal: withdrawal ? withdrawal.total : 0,
        withdrawalPurpose: withdrawal ? withdrawal.purpose : null,
      });

      savings = endingSaving;

      // Step-up for next year (applied after this year's row)
      if (isEarning) {
        monthlySaving = Math.round(monthlySaving * (1 + stepUpRate));
      }
    }

    return { rows, totalPrincipal: Math.round(totalPrincipal), totalInterest: Math.round(totalInterest) };
  }, [
    currentAge, retirementAge, expensesUntilAge, currentSavings, monthlyInvestment,
    stepUp, postRetirementMonthly, inflation, currentBlended, coastBlended, retBlended,
    additionalExpenses, coastEnabled, coastYears, yearlyBumps, majorWithdrawals, realEstateAssets,
  ]);

  const peakSavings = useMemo(() => Math.max(...yearData.rows.map((r) => r.endingSaving)), [yearData]);
  const retirementCorpus = useMemo(() => yearData.rows.find((r) => r.age === retirementAge)?.startingSaving || 0, [yearData, retirementAge]);
  const corpusAtWithdrawal = useMemo(() => yearData.rows.find((r) => r.age === withdrawalStartAge)?.startingSaving || 0, [yearData, withdrawalStartAge]);
  const coastGrowth = useMemo(() => (coastEnabled ? corpusAtWithdrawal - retirementCorpus : 0), [coastEnabled, corpusAtWithdrawal, retirementCorpus]);
  const lastPositiveAge = useMemo(() => {
    const last = [...yearData.rows].reverse().find((r) => r.endingSaving > 0 && (r.status === "Retired" || r.status === "Coasting"));
    return last?.age || expensesUntilAge;
  }, [yearData, expensesUntilAge]);
  const isFullyFunded = useMemo(() => {
    const lastRow = yearData.rows.find((r) => r.age === expensesUntilAge - 1);
    return lastRow ? lastRow.endingSaving > 0 : false;
  }, [yearData, expensesUntilAge]);

  const totalWithdrawals = useMemo(() => {
    return Object.values(majorWithdrawals || {}).reduce((sum, w) => sum + w.total, 0);
  }, [majorWithdrawals]);

  const wealthLoss = useMemo(() => {
    if (!majorWithdrawals || Object.keys(majorWithdrawals).length === 0) return 0;
    
    // Calculate what the final portfolio would be WITHOUT withdrawals
    let projectedWithoutWithdrawals = currentSavings;
    const avgGrowthRate = (currentBlended.grossReturn + retBlended.grossReturn) / 2;
    const yearsToRetirement = retirementAge - currentAge;
    
    // Simple compound growth projection
    projectedWithoutWithdrawals = currentSavings * Math.pow(1 + avgGrowthRate, yearsToRetirement);
    
    // Calculate actual final value with withdrawals
    const finalRow = yearData.rows.find(r => r.age === retirementAge);
    const actualFinalValue = finalRow ? finalRow.startingSaving : 0;
    
    // The difference is the wealth loss due to withdrawals
    return Math.max(0, projectedWithoutWithdrawals - actualFinalValue - totalWithdrawals);
  }, [majorWithdrawals, currentSavings, currentBlended, retBlended, retirementAge, currentAge, yearData, totalWithdrawals]);

  return { 
    yearData, peakSavings, retirementCorpus, corpusAtWithdrawal, coastGrowth, 
    lastPositiveAge, isFullyFunded, withdrawalStartAge, totalWithdrawals, wealthLoss 
  };
}
