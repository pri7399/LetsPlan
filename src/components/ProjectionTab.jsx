import {
  Box, VStack, HStack, Text, Table, Thead, Tbody, Tr, Th, Td,
  Badge, Input, Tooltip, useColorModeValue, Button
} from "@chakra-ui/react";
import { fmt } from "../utils/calc";

export default function ProjectionTab({
  yearData, peakSavings, currentAge, retirementAge,
  expensesUntilAge, coastEnabled, withdrawalStartAge,
  yearlyBumps, setYearlyBumps, majorWithdrawals, setMajorWithdrawals,
}) {
  const handleBumpChange = (age, value) => {
    const v = Number(value) || 0;
    setYearlyBumps((prev) => {
      const n = { ...prev };
      if (v > 0) n[age] = v;
      else delete n[age];
      return n;
    });
  };

  const handleWithdrawalChange = (age, value) => {
    const v = Number(value) || 0;
    setMajorWithdrawals((prev) => {
      const n = { ...prev };
      if (v > 0) {
        const taxAmount = v * 0.125;
        n[age] = {
          amount: v,
          tax: taxAmount,
          total: v + taxAmount,
          purpose: "Quick Edit"
        };
      } else {
        delete n[age];
      }
      return n;
    });
  };

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const tableBg = useColorModeValue("white", "gray.800");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.700");
  const tableRowBg = useColorModeValue("gray.50", "gray.700");
  const orangeBg = useColorModeValue("orange.50", "orange.900");
  const greenBg = useColorModeValue("green.50", "green.900");
  const blueBg = useColorModeValue("blue.50", "blue.900");
  const grayText = useColorModeValue("gray.400", "gray.500");
  const darkText = useColorModeValue("gray.800", "gray.100");
  const blueText = useColorModeValue("blue.600", "blue.300");
  const greenText = useColorModeValue("green.600", "green.300");
  const blueFooterBg = useColorModeValue("blue.50", "blue.900");
  const blueFooterText = useColorModeValue("blue.700", "blue.300");

  const getStatusColor = (status) => {
    switch (status) {
      case "Earning": return "blue";
      case "Coasting": return "orange";
      case "Retired": return "green";
      default: return "gray";
    }
  };

  const getBarColor = (status) => {
    switch (status) {
      case "Earning": return "brand.500";
      case "Coasting": return "orange.500";
      case "Retired": return "green.500";
      default: return "gray.400";
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Chart */}
      <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm" border="1px" borderColor={borderColor}>
        <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={4}>
          Savings Trajectory
        </Text>
        
        <Box position="relative" height="200px" display="flex" alignItems="flex-end" gap={1} overflow="hidden" mb={4}>
          {yearData.rows.map((r, i) => {
            const maxVal = peakSavings || 1;
            const height = Math.max(2, (Math.abs(r.endingSaving) / maxVal) * 180);
            const color = getBarColor(r.status);
            
            return (
              <Tooltip 
                key={i} 
                label={`Age ${r.age}: ${fmt(r.endingSaving)} [${r.status}]`}
                placement="top"
              >
                <Box
                  flex={1}
                  height={`${height}px`}
                  bg={r.endingSaving < 0 ? "red.500" : color}
                  opacity={0.7}
                  borderRadius="3px 3px 0 0"
                  cursor="pointer"
                  minW="3px"
                  transition="opacity 0.15s"
                  _hover={{ opacity: 1 }}
                />
              </Tooltip>
            );
          })}
        </Box>
        
        <HStack justify="space-between" fontSize="xs" color="gray.500" mb={4}>
          <Text>Age {currentAge}</Text>
          <Text>Retire {retirementAge}</Text>
          {coastEnabled && <Text color="orange.500">Withdraw {withdrawalStartAge}</Text>}
          <Text>Age {expensesUntilAge}</Text>
        </HStack>
        
        <HStack spacing={6} wrap="wrap">
          {[
            { color: "brand.500", label: "Earning" },
            ...(coastEnabled ? [{ color: "orange.500", label: "Coasting" }] : []),
            { color: "green.500", label: "Withdrawing" },
            { color: "red.500", label: "Shortfall" },
          ].map((legend) => (
            <HStack key={legend.label} spacing={2}>
              <Box w={3} h={3} borderRadius="sm" bg={legend.color} />
              <Text fontSize="xs" color="gray.600">{legend.label}</Text>
            </HStack>
          ))}
        </HStack>
      </Box>

      {/* Table */}
      <Box bg={cardBg} borderRadius="xl" shadow="sm" border="1px" borderColor={borderColor} overflow="hidden">
        <Box p={6} borderBottom="1px" borderColor={borderColor}>
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              Year-by-Year Projection
            </Text>
            <Text fontSize="sm" color="gray.500">
              {yearData.rows.length} years · Click + or - buttons to add bumps/withdrawals
            </Text>
          </HStack>
          <HStack spacing={6} mt={3} fontSize="xs" color="gray.600">
            <HStack spacing={1}>
              <Badge colorScheme="blue" variant="subtle" size="sm">E</Badge>
              <Text>Earning</Text>
            </HStack>
            <HStack spacing={1}>
              <Badge colorScheme="orange" variant="subtle" size="sm">C</Badge>
              <Text>Coasting</Text>
            </HStack>
            <HStack spacing={1}>
              <Badge colorScheme="green" variant="subtle" size="sm">R</Badge>
              <Text>Retired</Text>
            </HStack>
          </HStack>
        </Box>
        
        <Box overflowX="auto">
          <Table size="sm" variant="simple" bg={tableBg}>
            <Thead bg={tableHeaderBg}>
              <Tr>
                <Th>Age</Th>
                <Th>Status</Th>
                <Th isNumeric>Starting</Th>
                <Th isNumeric>Expenses</Th>
                <Th isNumeric>Savings In</Th>
                <Th isNumeric>Mo. Save</Th>
                <Th isNumeric>PF</Th>
                <Th isNumeric>Interest</Th>
                <Th isNumeric>Withdrawals</Th>
                <Th isNumeric>Portfolio</Th>
                <Th isNumeric>Real Estate</Th>
                <Th isNumeric  color="white" fontWeight="black">Total Assets</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {yearData.rows.map((r, i) => {
                const isTransition = r.age === retirementAge || (coastEnabled && r.age === withdrawalStartAge);
                const isEarning = r.status === "Earning";
                const bumpVal = (yearlyBumps && yearlyBumps[r.age]) || 0;
                
                let rowBg = "transparent";
                if (isTransition) {
                  if (r.status === "Coasting") rowBg = orangeBg;
                  else if (r.status === "Retired") rowBg = greenBg;
                  else rowBg = blueBg;
                } else if (bumpVal > 0) {
                  rowBg = greenBg;
                } else if (i % 2 === 0) {
                  rowBg = "transparent";
                } else {
                  rowBg = tableRowBg;
                }
                
                return (
                  <Tr key={i} bg={rowBg}>
                    <Td fontWeight="semibold">{r.age}</Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(r.status)} variant="subtle" size="sm">
                        {r.status === "Earning" ? "E" : r.status === "Coasting" ? "C" : r.status === "Retired" ? "R" : "D"}
                      </Badge>
                    </Td>
                    <Td isNumeric>{fmt(r.startingSaving)}</Td>
                    <Td isNumeric color={r.plannedExpenses > 0 ? "red.500" : grayText}>
                      {r.plannedExpenses > 0 ? fmt(r.plannedExpenses) : "—"}
                    </Td>
                    <Td isNumeric color={r.additionalSavings > 0 ? "green.500" : grayText}>
                      {r.additionalSavings > 0 ? fmt(r.additionalSavings) : "—"}
                    </Td>
                    <Td isNumeric color={r.savingMonthWithoutPF > 0 ? blueText : grayText}>
                      {r.savingMonthWithoutPF > 0 ? `₹${r.savingMonthWithoutPF.toLocaleString("en-IN")}` : "—"}
                    </Td>
                    <Td isNumeric color={r.pfContribution > 0 ? greenText : grayText}>
                      {r.pfContribution > 0 ? `₹${r.pfContribution.toLocaleString("en-IN")}` : "—"}
                    </Td>
                    <Td isNumeric color={r.interestEarned > 0 ? "purple.500" : grayText}>
                      {r.interestEarned > 0 ? fmt(r.interestEarned) : "—"}
                    </Td>
                    <Td isNumeric color={r.withdrawal > 0 ? "red.500" : grayText}>
                      {r.withdrawal > 0 ? (
                        <Text fontSize="xs">
                          -{fmt(r.withdrawal)}<br/>
                          <Text as="span" color={grayText}>{r.withdrawalPurpose}</Text>
                        </Text>
                      ) : "—"}
                    </Td>
                    <Td 
                      isNumeric 
                      fontWeight="bold" 
                      color={r.endingSaving < 0 ? "red.500" : r.endingSaving === 0 ? grayText : "green.600"}
                    >
                      {fmt(r.endingSaving)}
                    </Td>
                    <Td isNumeric fontWeight="bold" color={r.realEstateValue > 0 ? "green.600" : grayText}>
                      {r.realEstateValue > 0 ? fmt(r.realEstateValue) : "—"}
                    </Td>
                    <Td 
                      isNumeric 
                      fontWeight="black" 
          
                      color="white"
                    >
                      {fmt(r.totalAssets)}
                    </Td>
                    <Td>
                      {r.status !== "Dead" && (
                        <HStack spacing={1}>
                          <Button 
                            size="xs" 
                            colorScheme="green" 
                            variant={bumpVal > 0 ? "solid" : "outline"}
                            onClick={() => {
                              const amount = prompt(`Add yearly investment bump at age ${r.age}:`, bumpVal || 100000);
                              if (amount !== null) handleBumpChange(r.age, amount);
                            }}
                          >
                            {bumpVal > 0 ? `+${(bumpVal/1000).toFixed(0)}K` : "+"}
                          </Button>
                          <Button 
                            size="xs" 
                            colorScheme="red" 
                            variant={r.withdrawal > 0 ? "solid" : "outline"}
                            onClick={() => {
                              const amount = prompt(`Add withdrawal at age ${r.age} (12.5% tax will be added):`, r.withdrawal || 500000);
                              if (amount !== null) handleWithdrawalChange(r.age, amount);
                            }}
                          >
                            {r.withdrawal > 0 ? `-${(r.withdrawal/1000).toFixed(0)}K` : "-"}
                          </Button>
                        </HStack>
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
        
        <Box p={4} bg={blueFooterBg} borderTop="1px" borderColor={borderColor}>
          <Text fontSize="sm" color={blueFooterText} fontWeight="medium">
            🏠 <Text as="span" fontWeight="bold">Expense Reduction:</Text> After age 65, monthly expenses are reduced by 50% assuming home is paid off, car is owned, and children are financially independent.
          </Text>
        </Box>
      </Box>
    </VStack>
  );
}