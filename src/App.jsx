import { useState, useMemo, useCallback } from "react";
import {
  Box, Container, Flex, Heading, Text, Button, Tabs, TabList, TabPanels, Tab, TabPanel,
  Stat, StatLabel, StatNumber, StatHelpText, SimpleGrid, Badge, useColorModeValue,
  HStack, VStack, Icon, Divider, IconButton, useColorMode
} from "@chakra-ui/react";
import { FiTrendingUp, FiDollarSign, FiClock, FiTarget, FiDownload, FiBarChart2, FiSun, FiMoon, FiTrendingDown } from "react-icons/fi";
import { fmt, computeBlended, buildDefaultApproach, buildRetirementApproach, buildCoastApproach } from "./utils/calc";
import { useRetirementCalc } from "./hooks/useRetirementCalc";
import { exportToXLSX, exportToCSV } from "./utils/export";
import InputsTab from "./components/InputsTab";
import ProjectionTab from "./components/ProjectionTab";
import SIPTab from "./components/SIPTab";
import SummaryTab from "./components/SummaryTab";
import MethodologyTab from "./components/MethodologyTab";

export default function App() {
  const [currentAge, setCurrentAge] = useState(26);
  const [retirementAge, setRetirementAge] = useState(46);
  const [expensesUntilAge, setExpensesUntilAge] = useState(81);
  const [currentSavings, setCurrentSavings] = useState(900000);
  const [monthlyInvestment, setMonthlyInvestment] = useState(40000);
  const [stepUp, setStepUp] = useState(5);
  const [postRetirementMonthly, setPostRetirementMonthly] = useState(100000);
  const [inflation, setInflation] = useState(6);

  const [coastEnabled, setCoastEnabled] = useState(true);
  const [coastYears, setCoastYears] = useState(7);

  const [currentApproach, setCurrentApproach] = useState(buildDefaultApproach);
  const [retApproach, setRetApproach] = useState(buildRetirementApproach);
  const [coastApproach, setCoastApproach] = useState(buildCoastApproach);

  const [yearlyBumps, setYearlyBumps] = useState({
    40: { amount: 5000000, reason: "Property Sale" },
    44: { amount: 2500000, reason: "Insurance Payout" }
  });
  const [majorWithdrawals, setMajorWithdrawals] = useState({
    35: {
      amount: 4000000,
      tax: 500000,
      total: 4500000,
      purpose: "Home Purchase",
      homeValue: 15000000
    },
    40: {
      amount: 3000000,
      tax: 375000,
      total: 3375000,
      purpose: "Car Purchase"
    }
  });
  const [realEstateAssets, setRealEstateAssets] = useState({
    35: {
      purchaseAge: 35,
      initialValue: 15000000,
      appreciationRate: 0.05,
      name: "Primary Home"
    }
  });
  const [additionalExpenses] = useState({});

  const currentBlended = useMemo(() => computeBlended(currentApproach), [currentApproach]);
  const coastBlended = useMemo(() => computeBlended(coastApproach), [coastApproach]);
  const retBlended = useMemo(() => computeBlended(retApproach), [retApproach]);

  const {
    yearData, peakSavings, retirementCorpus, corpusAtWithdrawal,
    coastGrowth, lastPositiveAge, isFullyFunded, withdrawalStartAge, totalWithdrawals, wealthLoss,
  } = useRetirementCalc({
    currentAge, retirementAge, expensesUntilAge, currentSavings,
    monthlyInvestment, stepUp, postRetirementMonthly, inflation,
    currentBlended, coastBlended, retBlended,
    coastEnabled, coastYears, additionalExpenses, yearlyBumps, majorWithdrawals, realEstateAssets,
  });

  // Calculate present value of end savings
  const yearsToEnd = expensesUntilAge - currentAge;
  const presentValueEndSavings = useMemo(() => {
    if (peakSavings <= 0) return 0;
    return peakSavings / Math.pow(1 + inflation / 100, yearsToEnd);
  }, [peakSavings, inflation, yearsToEnd]);

  const handleExportXLSX = useCallback(() => {
    exportToXLSX({
      yearData, currentAge, retirementAge, expensesUntilAge, currentSavings,
      monthlyInvestment, stepUp, postRetirementMonthly, inflation,
      currentBlended, coastBlended, retBlended, currentApproach, coastApproach, retApproach,
      retirementCorpus, corpusAtWithdrawal, coastGrowth,
      peakSavings, lastPositiveAge, isFullyFunded,
      coastEnabled, coastYears, withdrawalStartAge, yearlyBumps,
    });
  }, [yearData, currentAge, retirementAge, expensesUntilAge, currentSavings, monthlyInvestment, stepUp, postRetirementMonthly, inflation, currentBlended, coastBlended, retBlended, currentApproach, coastApproach, retApproach, retirementCorpus, corpusAtWithdrawal, coastGrowth, peakSavings, lastPositiveAge, isFullyFunded, coastEnabled, coastYears, withdrawalStartAge, yearlyBumps]);

  const handleExportCSV = useCallback(() => exportToCSV(yearData), [yearData]);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box bg={bgColor} minH="100vh">
      {/* Header */}
      <Box bg={cardBg} borderBottom="1px" borderColor={useColorModeValue("gray.200", "gray.600")} position="sticky" top={0} zIndex={100} shadow="md">
        <Box maxW="100%" py={{ base: 4, lg: 4, xl: 6 }} px={{ base: 4, lg: 4, xl: 6 }}>
          <Flex justify="space-between" align="center">
            <HStack spacing={{ base: 3, lg: 3, xl: 4 }}>
              <Box
                w={{ base: 12, lg: 12, xl: 14 }} h={{ base: 12, lg: 12, xl: 14 }} borderRadius="2xl"
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                display="flex" alignItems="center" justifyContent="center"
                shadow="lg"
              >
                <Icon as={FiTrendingUp} color="white" boxSize={{ base: 6, lg: 6, xl: 7 }} />
              </Box>
              <VStack align="start" spacing={1}>
                <Heading size={{ base: "lg", lg: "lg", xl: "xl" }} bgGradient="linear(to-r, brand.600, purple.600)" bgClip="text">
                  RETIREMENT PLANNER
                </Heading>
                <HStack spacing={{ base: 2, lg: 2, xl: 3 }}>
                  <Text fontSize={{ base: "sm", lg: "sm", xl: "md" }} color={useColorModeValue("gray.600", "gray.400")} fontWeight="medium">
                    Financial Independence Calculator
                  </Text>
                  {coastEnabled && (
                    <Badge colorScheme="orange" variant="solid" borderRadius="full" px={{ base: 2, lg: 2, xl: 3 }} fontSize={{ base: "xs", lg: "xs", xl: "sm" }}>
                      Coast FIRE ({coastYears}yr)
                    </Badge>
                  )}
                </HStack>
              </VStack>
            </HStack>
            <HStack spacing={{ base: 1, lg: 1, xl: 2 }}>
              <IconButton
                icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
                onClick={toggleColorMode}
                variant="ghost"
                size={{ base: "sm", lg: "sm", xl: "md" }}
                borderRadius="full"
                aria-label="Toggle color mode"
              />
              <Button
                leftIcon={<FiDownload />}
                variant="outline"
                colorScheme="brand"
                size={{ base: "sm", lg: "sm", xl: "md" }}
                borderRadius="full"
                onClick={handleExportCSV}
              >
                CSV
              </Button>
              <Button
                leftIcon={<FiBarChart2 />}
                colorScheme="brand"
                size={{ base: "sm", lg: "sm", xl: "md" }}
                borderRadius="full"
                onClick={handleExportXLSX}
              >
                Excel
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Box>

      <Container maxW={{ base: "100%", lg: "6xl", xl: "7xl" }} py={{ base: 4, lg: 4, xl: 6 }}>
        {/* KPI Cards - Sticky */}
        <Box position="sticky" top={{ base: "70px", lg: "70px", xl: "80px" }} zIndex={50} bg={bgColor} py={{ base: 3, lg: 3, xl: 4 }} mb={{ base: 4, lg: 4, xl: 6 }}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={{ base: 4, lg: 4, xl: 6 }}>
            <Stat bg={cardBg} p={{ base: 4, lg: 4, xl: 6 }} borderRadius="xl" shadow="sm" border="1px" borderColor={useColorModeValue("gray.200", "gray.600")}>
              <Flex justify="space-between" align="start">
                <Box>
                  <StatLabel color={useColorModeValue("gray.600", "gray.400")} fontSize={{ base: "xs", lg: "xs", xl: "sm" }}>Retirement Corpus</StatLabel>
                  <StatNumber fontSize={{ base: "xl", lg: "xl", xl: "2xl" }} color="brand.600">₹{(retirementCorpus/10000000).toFixed(2)}Cr</StatNumber>
                  <StatHelpText color={useColorModeValue("gray.500", "gray.400")} fontSize={{ base: "xs", lg: "xs", xl: "sm" }}>At age {retirementAge}</StatHelpText>
                </Box>
                <Icon as={FiTarget} color="brand.500" boxSize={{ base: 5, lg: 5, xl: 6 }} />
              </Flex>
            </Stat>

            {coastEnabled && (
              <Stat bg={cardBg} p={{ base: 4, lg: 4, xl: 6 }} borderRadius="xl" shadow="sm" border="1px" borderColor={useColorModeValue("gray.200", "gray.600")}>
                <Flex justify="space-between" align="start">
                  <Box>
                    <StatLabel color={useColorModeValue("gray.600", "gray.400")} fontSize={{ base: "xs", lg: "xs", xl: "sm" }}>After Coast</StatLabel>
                    <StatNumber fontSize={{ base: "xl", lg: "xl", xl: "2xl" }} color="orange.500">₹{(corpusAtWithdrawal/10000000).toFixed(2)}Cr</StatNumber>
                    <StatHelpText color={useColorModeValue("gray.500", "gray.400")} fontSize={{ base: "xs", lg: "xs", xl: "sm" }}>+₹{(coastGrowth/10000000).toFixed(2)}Cr in {coastYears}yr</StatHelpText>
                  </Box>
                  <Icon as={FiTrendingUp} color="orange.500" boxSize={{ base: 5, lg: 5, xl: 6 }} />
                </Flex>
              </Stat>
            )}

            <Stat bg={cardBg} p={{ base: 4, lg: 4, xl: 6 }} borderRadius="xl" shadow="sm" border="1px" borderColor={useColorModeValue("gray.200", "gray.600")}>
              <Flex justify="space-between" align="start">
                <Box>
                  <StatLabel color={useColorModeValue("gray.600", "gray.400")} fontSize={{ base: "xs", lg: "xs", xl: "sm" }}>End Savings</StatLabel>
                  <StatNumber fontSize={{ base: "xl", lg: "xl", xl: "2xl" }} color="green.500">₹{(peakSavings/10000000).toFixed(2)}Cr</StatNumber>
                  <StatHelpText color={useColorModeValue("gray.500", "gray.400")} fontSize={{ base: "xs", lg: "xs", xl: "sm" }}>
                    ₹{(presentValueEndSavings/10000000).toFixed(2)}Cr in today's money
                  </StatHelpText>
                </Box>
                <Icon as={FiDollarSign} color="green.500" boxSize={{ base: 5, lg: 5, xl: 6 }} />
              </Flex>
            </Stat>

            <Stat bg={cardBg} p={{ base: 4, lg: 4, xl: 6 }} borderRadius="xl" shadow="sm" border="1px" borderColor={useColorModeValue("gray.200", "gray.600")}>
              <Flex justify="space-between" align="start">
                <Box>
                  <StatLabel color={useColorModeValue("gray.600", "gray.400")} fontSize={{ base: "xs", lg: "xs", xl: "sm" }}>Money Lasts Until</StatLabel>
                  <StatNumber fontSize={{ base: "xl", lg: "xl", xl: "2xl" }} color={isFullyFunded ? "pink.300" : "red.500"}>
                    Age {lastPositiveAge}
                  </StatNumber>
                  <StatHelpText>
                    <Badge colorScheme={isFullyFunded ? "pink" : "red"} variant="subtle">
                      {isFullyFunded ? "✓ Fully funded" : "⚠ Shortfall"}
                    </Badge>
                  </StatHelpText>
                </Box>
                <Icon as={FiClock} color={isFullyFunded ? "pink.500" : "red.500"} boxSize={{ base: 5, lg: 5, xl: 6 }} />
              </Flex>
            </Stat>
          </SimpleGrid>
        </Box>

        {/* Tabs */}
        <Box bg={cardBg} borderRadius="xl" shadow="sm" border="1px" borderColor="gray.200">
          <Tabs variant="enclosed" colorScheme="brand">
            <TabList>
              <Tab>⚙️ Configuration</Tab>
              <Tab>📈 Projections</Tab>
              <Tab>💰 SIP Tracker</Tab>
              <Tab>📋 Summary</Tab>
              <Tab>📚 Methodology</Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={8}>
                <InputsTab
                  currentAge={currentAge} setCurrentAge={setCurrentAge}
                  retirementAge={retirementAge} setRetirementAge={setRetirementAge}
                  expensesUntilAge={expensesUntilAge} setExpensesUntilAge={setExpensesUntilAge}
                  currentSavings={currentSavings} setCurrentSavings={setCurrentSavings}
                  monthlyInvestment={monthlyInvestment} setMonthlyInvestment={setMonthlyInvestment}
                  stepUp={stepUp} setStepUp={setStepUp}
                  postRetirementMonthly={postRetirementMonthly} setPostRetirementMonthly={setPostRetirementMonthly}
                  inflation={inflation} setInflation={setInflation}
                  coastEnabled={coastEnabled} setCoastEnabled={setCoastEnabled}
                  coastYears={coastYears} setCoastYears={setCoastYears}
                  withdrawalStartAge={withdrawalStartAge}
                  coastApproach={coastApproach} setCoastApproach={setCoastApproach} coastBlended={coastBlended}
                  currentApproach={currentApproach} setCurrentApproach={setCurrentApproach} currentBlended={currentBlended}
                  retApproach={retApproach} setRetApproach={setRetApproach} retBlended={retBlended}
                  yearlyBumps={yearlyBumps} setYearlyBumps={setYearlyBumps}
                  majorWithdrawals={majorWithdrawals} setMajorWithdrawals={setMajorWithdrawals}
                  realEstateAssets={realEstateAssets} setRealEstateAssets={setRealEstateAssets}
                  corpusAtWithdrawal={corpusAtWithdrawal}
                  retirementCorpus={retirementCorpus}
                />
              </TabPanel>

              <TabPanel p={8}>
                <ProjectionTab
                  yearData={yearData} peakSavings={peakSavings}
                  currentAge={currentAge} retirementAge={retirementAge}
                  expensesUntilAge={expensesUntilAge}
                  coastEnabled={coastEnabled} withdrawalStartAge={withdrawalStartAge}
                  yearlyBumps={yearlyBumps} setYearlyBumps={setYearlyBumps}
                  majorWithdrawals={majorWithdrawals} setMajorWithdrawals={setMajorWithdrawals}
                />
              </TabPanel>

              <TabPanel p={8}>
                <SIPTab 
                  currentApproach={currentApproach} 
                  monthlyInvestment={monthlyInvestment} 
                  currentBlended={currentBlended}
                />
              </TabPanel>

              <TabPanel p={8}>
                <SummaryTab
                  currentAge={currentAge}
                  retirementAge={retirementAge}
                  expensesUntilAge={expensesUntilAge}
                  currentSavings={currentSavings}
                  monthlyInvestment={monthlyInvestment}
                  stepUp={stepUp}
                  postRetirementMonthly={postRetirementMonthly}
                  inflation={inflation}
                  retirementCorpus={retirementCorpus}
                  corpusAtWithdrawal={corpusAtWithdrawal}
                  coastGrowth={coastGrowth}
                  peakSavings={peakSavings}
                  lastPositiveAge={lastPositiveAge}
                  isFullyFunded={isFullyFunded}
                  coastEnabled={coastEnabled}
                  coastYears={coastYears}
                  withdrawalStartAge={withdrawalStartAge}
                  currentBlended={currentBlended}
                  coastBlended={coastBlended}
                  retBlended={retBlended}
                  currentApproach={currentApproach}
                  coastApproach={coastApproach}
                  retApproach={retApproach}
                  yearlyBumps={yearlyBumps}
                  majorWithdrawals={majorWithdrawals}
                  totalWithdrawals={totalWithdrawals}
                  wealthLoss={wealthLoss}
                  yearData={yearData}
                />
              </TabPanel>

              <TabPanel p={8}>
                <MethodologyTab />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </Box>
  );
}
