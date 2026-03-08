import {
  Box, VStack, HStack, Text, SimpleGrid, Divider, Badge, Button,
  useColorModeValue, useToast
} from "@chakra-ui/react";
import { FiDownload } from "react-icons/fi";
import { fmt, pct } from "../utils/calc";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function SummaryTab({
  currentAge, retirementAge, expensesUntilAge, currentSavings,
  monthlyInvestment, stepUp, postRetirementMonthly, inflation,
  retirementCorpus, corpusAtWithdrawal, coastGrowth, peakSavings,
  lastPositiveAge, isFullyFunded, coastEnabled, coastYears,
  withdrawalStartAge, currentBlended, coastBlended, retBlended,
  currentApproach, coastApproach, retApproach, yearlyBumps,
  majorWithdrawals, totalWithdrawals, wealthLoss, yearData
}) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headerBg = useColorModeValue("brand.50", "brand.900");
  const sectionBg = useColorModeValue("gray.50", "gray.700");

  const toast = useToast();

  const handleDownloadPDF = async () => {
    const element = document.getElementById('summary-content');
    if (!element) return;

    toast({
      title: "Generating PDF...",
      status: "info",
      duration: 2000,
    });

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('retirement-plan-summary.pdf');

      toast({
        title: "PDF Downloaded!",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error generating PDF",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    }
  };

  const totalBumps = Object.values(yearlyBumps || {}).reduce((sum, b) => sum + (b.amount || b), 0);
  const yearsToRetirement = retirementAge - currentAge;
  const totalInvestment = monthlyInvestment * 12 * yearsToRetirement;
  const presentValueEndSavings = peakSavings / Math.pow(1 + inflation / 100, expensesUntilAge - currentAge);

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="2xl" fontWeight="bold">Retirement Plan Summary</Text>
        <Button leftIcon={<FiDownload />} colorScheme="brand" onClick={handleDownloadPDF}>
          Download PDF
        </Button>
      </HStack>

      <Box id="summary-content">
        <Box bg={cardBg} p={8} borderRadius="xl" shadow="sm" border="1px" borderColor={borderColor}>
          <Box bg={headerBg} p={6} borderRadius="lg" mb={6}>
            <Text fontSize="3xl" fontWeight="bold" color="brand.600" mb={2}>
              🎯 Your Retirement Journey
            </Text>
            <Text fontSize="md" color={useColorModeValue("gray.700", "gray.300")}>
              Age {currentAge} → {retirementAge} → {expensesUntilAge} | {coastEnabled ? `Coast FIRE (${coastYears}yr)` : 'Traditional Retirement'}
            </Text>
          </Box>

          {/* Key Metrics */}
          <Box mb={6}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>📊 Key Financial Metrics</Text>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <Box bg={sectionBg} p={5} borderRadius="lg">
                <Text fontSize="sm" color="gray.600" mb={1}>Retirement Corpus</Text>
                <Text fontSize="2xl" fontWeight="bold" color="brand.600">
                  {fmt(retirementCorpus)}
                </Text>
                <Text fontSize="xs" color="gray.500">At age {retirementAge}</Text>
              </Box>

              {coastEnabled && (
                <Box bg={sectionBg} p={5} borderRadius="lg">
                  <Text fontSize="sm" color="gray.600" mb={1}>After Coast Phase</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                    {fmt(corpusAtWithdrawal)}
                  </Text>
                  <Text fontSize="xs" color="gray.500">+{fmt(coastGrowth)} growth</Text>
                </Box>
              )}

              <Box bg={sectionBg} p={5} borderRadius="lg">
                <Text fontSize="sm" color="gray.600" mb={1}>Final Savings</Text>
                <Text fontSize="2xl" fontWeight="bold" color="green.600">
                  {fmt(peakSavings)}
                </Text>
                <Text fontSize="xs" color="gray.500">{fmt(presentValueEndSavings)} today's value</Text>
              </Box>

              <Box bg={sectionBg} p={5} borderRadius="lg">
                <Text fontSize="sm" color="gray.600" mb={1}>Money Lasts Until</Text>
                <Text fontSize="2xl" fontWeight="bold" color={isFullyFunded ? "pink.500" : "red.500"}>
                  Age {lastPositiveAge}
                </Text>
                <Badge colorScheme={isFullyFunded ? "green" : "red"} mt={2}>
                  {isFullyFunded ? "✓ Fully Funded" : "⚠ Shortfall"}
                </Badge>
              </Box>
            </SimpleGrid>
          </Box>

          <Divider my={6} />

          {/* Timeline */}
          <Box mb={6}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>📅 Timeline Breakdown</Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <HStack justify="space-between" p={3} bg={sectionBg} borderRadius="md">
                <Text fontWeight="semibold">Current Age</Text>
                <Text fontWeight="bold" color="brand.600">{currentAge} years</Text>
              </HStack>
              <HStack justify="space-between" p={3} bg={sectionBg} borderRadius="md">
                <Text fontWeight="semibold">Retirement Age</Text>
                <Text fontWeight="bold" color="brand.600">{retirementAge} years</Text>
              </HStack>
              <HStack justify="space-between" p={3} bg={sectionBg} borderRadius="md">
                <Text fontWeight="semibold">Years to Retirement</Text>
                <Text fontWeight="bold" color="blue.600">{yearsToRetirement} years</Text>
              </HStack>
              {coastEnabled && (
                <>
                  <HStack justify="space-between" p={3} bg={sectionBg} borderRadius="md">
                    <Text fontWeight="semibold">Coast Period</Text>
                    <Text fontWeight="bold" color="orange.600">{coastYears} years</Text>
                  </HStack>
                  <HStack justify="space-between" p={3} bg={sectionBg} borderRadius="md">
                    <Text fontWeight="semibold">Withdrawal Starts</Text>
                    <Text fontWeight="bold" color="green.600">Age {withdrawalStartAge}</Text>
                  </HStack>
                </>
              )}
              <HStack justify="space-between" p={3} bg={sectionBg} borderRadius="md">
                <Text fontWeight="semibold">Planning Until Age</Text>
                <Text fontWeight="bold" color="gray.600">{expensesUntilAge} years</Text>
              </HStack>
            </SimpleGrid>
          </Box>

          <Divider my={6} />

          {/* Investment Details */}
          <Box mb={6}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>💰 Investment Strategy</Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <HStack justify="space-between" p={3} bg={sectionBg} borderRadius="md">
                <Text fontWeight="semibold">Current Savings</Text>
                <Text fontWeight="bold">{fmt(currentSavings)}</Text>
              </HStack>
              <HStack justify="space-between" p={3} bg={sectionBg} borderRadius="md">
                <Text fontWeight="semibold">Monthly Investment</Text>
                <Text fontWeight="bold">{fmt(monthlyInvestment)}</Text>
              </HStack>
              <HStack justify="space-between" p={3} bg={sectionBg} borderRadius="md">
                <Text fontWeight="semibold">Annual Step-up</Text>
                <Text fontWeight="bold" color="green.600">{stepUp}%</Text>
              </HStack>
              <HStack justify="space-between" p={3} bg={sectionBg} borderRadius="md">
                <Text fontWeight="semibold">Total Investment</Text>
                <Text fontWeight="bold" color="blue.600">{fmt(totalInvestment)}</Text>
              </HStack>
              {totalBumps > 0 && (
                <HStack justify="space-between" p={3} bg={sectionBg} borderRadius="md">
                  <Text fontWeight="semibold">Windfalls/Bumps</Text>
                  <Text fontWeight="bold" color="green.600">{fmt(totalBumps)}</Text>
                </HStack>
              )}
              {totalWithdrawals > 0 && (
                <HStack justify="space-between" p={3} bg={sectionBg} borderRadius="md">
                  <Text fontWeight="semibold">Major Withdrawals</Text>
                  <Text fontWeight="bold" color="red.600">{fmt(totalWithdrawals)}</Text>
                </HStack>
              )}
            </SimpleGrid>
          </Box>

          <Divider my={6} />

          {/* Returns */}
          <Box mb={6}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>📈 Expected Returns</Text>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Box p={4} bg={sectionBg} borderRadius="md" border="2px" borderColor="blue.300">
                <Text fontSize="sm" fontWeight="semibold" color="blue.600" mb={2}>Earning Phase</Text>
                <Text fontSize="2xl" fontWeight="bold">{pct(currentBlended.grossReturn)}</Text>
                <Text fontSize="xs" color="gray.500">Post-tax: {pct(currentBlended.postTaxReturn)}</Text>
              </Box>
              {coastEnabled && (
                <Box p={4} bg={sectionBg} borderRadius="md" border="2px" borderColor="orange.300">
                  <Text fontSize="sm" fontWeight="semibold" color="orange.600" mb={2}>Coast Phase</Text>
                  <Text fontSize="2xl" fontWeight="bold">{pct(coastBlended.grossReturn)}</Text>
                  <Text fontSize="xs" color="gray.500">Post-tax: {pct(coastBlended.postTaxReturn)}</Text>
                </Box>
              )}
              <Box p={4} bg={sectionBg} borderRadius="md" border="2px" borderColor="green.300">
                <Text fontSize="sm" fontWeight="semibold" color="green.600" mb={2}>Withdrawal Phase</Text>
                <Text fontSize="2xl" fontWeight="bold">{pct(retBlended.grossReturn)}</Text>
                <Text fontSize="xs" color="gray.500">Post-tax: {pct(retBlended.postTaxReturn)}</Text>
              </Box>
            </SimpleGrid>
          </Box>

          <Divider my={6} />

          {/* Expenses */}
          <Box mb={6}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>💸 Expense Planning</Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <HStack justify="space-between" p={3} bg={sectionBg} borderRadius="md">
                <Text fontWeight="semibold">Current Monthly Expenses</Text>
                <Text fontWeight="bold">{fmt(postRetirementMonthly)}</Text>
              </HStack>
              <HStack justify="space-between" p={3} bg={sectionBg} borderRadius="md">
                <Text fontWeight="semibold">Current Annual Expenses</Text>
                <Text fontWeight="bold">{fmt(postRetirementMonthly * 12)}</Text>
              </HStack>
              <HStack justify="space-between" p={3} bg={sectionBg} borderRadius="md">
                <Text fontWeight="semibold">At Retirement (Age {retirementAge})</Text>
                <Text fontWeight="bold" color="orange.600">
                  {fmt(postRetirementMonthly * 12 * Math.pow(1 + inflation / 100, retirementAge - currentAge))}
                </Text>
              </HStack>
              <HStack justify="space-between" p={3} bg={sectionBg} borderRadius="md">
                <Text fontWeight="semibold">At Age 65 (50% reduced)</Text>
                <Text fontWeight="bold" color="green.600">
                  {fmt(postRetirementMonthly * 12 * Math.pow(1 + inflation / 100, 65 - currentAge) * 0.5)}
                </Text>
              </HStack>
              <HStack justify="space-between" p={3} bg={sectionBg} borderRadius="md">
                <Text fontWeight="semibold">Inflation Rate</Text>
                <Text fontWeight="bold" color="red.600">{inflation}%</Text>
              </HStack>
            </SimpleGrid>
          </Box>

          <Divider my={6} />

          {/* Windfalls & Withdrawals */}
          {(Object.keys(yearlyBumps || {}).length > 0 || Object.keys(majorWithdrawals || {}).length > 0) && (
            <>
              <Box mb={6}>
                <Text fontSize="xl" fontWeight="bold" mb={4}>💰 Windfalls & Major Withdrawals</Text>
                
                {Object.keys(yearlyBumps || {}).length > 0 && (
                  <Box mb={4}>
                    <Text fontSize="md" fontWeight="semibold" mb={3} color="green.600">Scheduled Windfalls</Text>
                    <VStack spacing={2} align="stretch">
                      {Object.entries(yearlyBumps).map(([age, bump]) => (
                        <HStack key={age} justify="space-between" p={3} bg={sectionBg} borderRadius="md">
                          <HStack>
                            <Badge colorScheme="green">Age {age}</Badge>
                            <Text fontSize="sm">{bump.reason || 'Windfall'}</Text>
                          </HStack>
                          <Text fontWeight="bold" color="green.600">{fmt(bump.amount || bump)}</Text>
                        </HStack>
                      ))}
                      <HStack justify="space-between" p={3} bg={useColorModeValue("green.100", "green.800")} borderRadius="md">
                        <Text fontWeight="bold">Total Windfalls</Text>
                        <Text fontWeight="bold" color="green.600">{fmt(totalBumps)}</Text>
                      </HStack>
                    </VStack>
                  </Box>
                )}

                {Object.keys(majorWithdrawals || {}).length > 0 && (
                  <Box>
                    <Text fontSize="md" fontWeight="semibold" mb={3} color="red.600">Major Withdrawals</Text>
                    <VStack spacing={2} align="stretch">
                      {Object.entries(majorWithdrawals).map(([age, withdrawal]) => (
                        <Box key={age} p={3} bg={sectionBg} borderRadius="md">
                          <HStack justify="space-between" mb={1}>
                            <HStack>
                              <Badge colorScheme="red">Age {age}</Badge>
                              <Text fontSize="sm" fontWeight="semibold">{withdrawal.purpose}</Text>
                            </HStack>
                            <Text fontWeight="bold" color="red.600">{fmt(withdrawal.total)}</Text>
                          </HStack>
                          <HStack justify="flex-end" fontSize="xs" color="gray.500">
                            <Text>Amount: {fmt(withdrawal.amount)}</Text>
                            <Text>+ Tax: {fmt(withdrawal.tax)}</Text>
                          </HStack>
                        </Box>
                      ))}
                      <HStack justify="space-between" p={3} bg={useColorModeValue("red.100", "red.800")} borderRadius="md">
                        <Text fontWeight="bold">Total Withdrawals</Text>
                        <Text fontWeight="bold" color="red.600">{fmt(totalWithdrawals)}</Text>
                      </HStack>
                    </VStack>
                  </Box>
                )}
              </Box>

              <Divider my={6} />
            </>
          )}

          {/* Asset Allocation */}
          <Box mb={6}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>🎯 Asset Allocation</Text>
            
            <Box mb={4}>
              <Text fontSize="md" fontWeight="semibold" mb={3} color="blue.600">Earning Phase</Text>
              <SimpleGrid columns={4} spacing={2} fontSize="sm">
                {currentApproach.map((fund, i) => (
                  <Box key={i} p={2} bg={sectionBg} borderRadius="md">
                    <Text fontSize="xs" fontWeight="bold">{fund.name}</Text>
                    <Text fontSize="xs" color="gray.600">{(fund.share * 100).toFixed(0)}% • {pct(fund.returns)}</Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>

            {coastEnabled && (
              <Box mb={4}>
                <Text fontSize="md" fontWeight="semibold" mb={3} color="orange.600">Coast Phase</Text>
                <SimpleGrid columns={4} spacing={2} fontSize="sm">
                  {coastApproach.map((fund, i) => (
                    <Box key={i} p={2} bg={sectionBg} borderRadius="md">
                      <Text fontSize="xs" fontWeight="bold">{fund.name}</Text>
                      <Text fontSize="xs" color="gray.600">{(fund.share * 100).toFixed(0)}% • {pct(fund.returns)}</Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            )}

            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={3} color="green.600">Withdrawal Phase</Text>
              <SimpleGrid columns={4} spacing={2} fontSize="sm">
                {retApproach.map((fund, i) => (
                  <Box key={i} p={2} bg={sectionBg} borderRadius="md">
                    <Text fontSize="xs" fontWeight="bold">{fund.name}</Text>
                    <Text fontSize="xs" color="gray.600">{(fund.share * 100).toFixed(0)}% • {pct(fund.returns)}</Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </Box>

          {/* Year-by-Year Projection Table */}
          <Divider my={6} />
          
          <Box mb={6}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>📊 Year-by-Year Projection</Text>
            <Box overflowX="auto" border="1px" borderColor={borderColor} borderRadius="md">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead style={{ background: useColorModeValue('#f7fafc', '#2d3748') }}>
                  <tr>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Age</th>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Status</th>
                    <th style={{ padding: '8px', textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>Starting</th>
                    <th style={{ padding: '8px', textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>Expenses</th>
                    <th style={{ padding: '8px', textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>Savings In</th>
                    <th style={{ padding: '8px', textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>Interest</th>
                    <th style={{ padding: '8px', textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>Portfolio</th>
                    <th style={{ padding: '8px', textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>Real Estate</th>
                    <th style={{ padding: '8px', textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>Total Assets</th>
                  </tr>
                </thead>
                <tbody>
                  {yearData.rows.map((r, i) => {
                    const isTransition = r.age === retirementAge || (coastEnabled && r.age === withdrawalStartAge);
                    let rowBg = i % 2 === 0 ? 'transparent' : useColorModeValue('#f7fafc', '#2d3748');
                    if (isTransition) rowBg = useColorModeValue('#fef5e7', '#744210');
                    
                    return (
                      <tr key={i} style={{ background: rowBg }}>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold' }}>{r.age}</td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #e2e8f0' }}>
                          <span style={{ 
                            padding: '2px 8px', 
                            borderRadius: '4px', 
                            fontSize: '10px',
                            fontWeight: 'bold',
                            background: r.status === 'Earning' ? '#bee3f8' : r.status === 'Coasting' ? '#feebc8' : r.status === 'Retired' ? '#c6f6d5' : '#e2e8f0',
                            color: r.status === 'Earning' ? '#2c5282' : r.status === 'Coasting' ? '#7c2d12' : r.status === 'Retired' ? '#22543d' : '#718096'
                          }}>
                            {r.status[0]}
                          </span>
                        </td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>{fmt(r.startingSaving)}</td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #e2e8f0', textAlign: 'right', color: r.plannedExpenses > 0 ? '#e53e3e' : '#a0aec0' }}>
                          {r.plannedExpenses > 0 ? fmt(r.plannedExpenses) : '—'}
                        </td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #e2e8f0', textAlign: 'right', color: r.additionalSavings > 0 ? '#38a169' : '#a0aec0' }}>
                          {r.additionalSavings > 0 ? fmt(r.additionalSavings) : '—'}
                        </td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #e2e8f0', textAlign: 'right', color: r.interestEarned > 0 ? '#805ad5' : '#a0aec0' }}>
                          {r.interestEarned > 0 ? fmt(r.interestEarned) : '—'}
                        </td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 'bold', color: r.endingSaving < 0 ? '#e53e3e' : r.endingSaving === 0 ? '#a0aec0' : '#38a169' }}>
                          {fmt(r.endingSaving)}
                        </td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 'bold', color: r.realEstateValue > 0 ? '#38a169' : '#a0aec0' }}>
                          {r.realEstateValue > 0 ? fmt(r.realEstateValue) : '—'}
                        </td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 'bold', color: '#5a67d8' }}>
                          {fmt(r.totalAssets)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Box>
          </Box>

          {/* Footer Note */}
          <Box mt={8} p={4} bg={useColorModeValue("blue.50", "blue.900")} borderRadius="md">
            <Text fontSize="sm" color={useColorModeValue("blue.800", "blue.200")}>
              ℹ️ <Text as="span" fontWeight="bold">Note:</Text> All returns are reduced by 2% for conservative planning. 
              This summary is based on current assumptions and market conditions. Actual results may vary.
            </Text>
          </Box>
        </Box>
      </Box>
    </VStack>
  );
}
