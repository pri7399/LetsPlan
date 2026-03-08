import {
  VStack, Box, Text, Heading, SimpleGrid, Code, Alert, AlertIcon, AlertDescription,
  useColorModeValue, Divider, HStack, Badge
} from "@chakra-ui/react";

export default function MethodologyTab() {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const codeBg = useColorModeValue("gray.100", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const mutedTextColor = useColorModeValue("gray.500", "gray.400");

  const FormulaBox = ({ title, formula, description, example }) => (
    <Box p={4} bg={cardBg} borderRadius="lg" border="1px" borderColor={borderColor}>
      <Text fontSize="md" fontWeight="bold" mb={2} color="brand.600">{title}</Text>
      <Code p={2} bg={codeBg} borderRadius="md" fontSize="sm" display="block" mb={2}>
        {formula}
      </Code>
      <Text fontSize="sm" color={textColor} mb={2}>
        {description}
      </Text>
      {example && (
        <Text fontSize="xs" color={mutedTextColor} fontStyle="italic">
          Example: {example}
        </Text>
      )}
    </Box>
  );

  const AssumptionBox = ({ title, description, impact }) => (
    <Box p={4} bg={cardBg} borderRadius="lg" border="1px" borderColor={borderColor}>
      <HStack mb={2}>
        <Text fontSize="md" fontWeight="bold" color="purple.600">{title}</Text>
        <Badge colorScheme="purple" variant="subtle" size="sm">Assumption</Badge>
      </HStack>
      <Text fontSize="sm" color={textColor} mb={2}>
        {description}
      </Text>
      <Text fontSize="xs" color={mutedTextColor} fontWeight="medium">
        Impact: {impact}
      </Text>
    </Box>
  );

  return (
    <VStack spacing={8} align="stretch">
      {/* Overview */}
      <Box>
        <Heading size="lg" mb={4} color="brand.600">Calculation Methodology</Heading>
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <AlertDescription fontSize="sm">
            This retirement planner uses a year-by-year simulation approach with three distinct phases: 
            <Text as="span" fontWeight="bold"> Earning → Coast (optional) → Withdrawal</Text>. 
            All calculations include inflation adjustments and conservative assumptions.
          </AlertDescription>
        </Alert>
      </Box>

      {/* Core Formulas */}
      <Box>
        <Heading size="md" mb={4} color="brand.600">Core Calculation Formulas</Heading>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
          <FormulaBox
            title="Earning Phase"
            formula="Ending = Starting × (1 + Return) + Annual_Investment + Bumps - Withdrawals"
            description="During earning years, portfolio grows through returns and new investments, minus any major withdrawals."
            example="₹10L × 1.12 + ₹4.8L + ₹0 - ₹0 = ₹16L"
          />
          
          <FormulaBox
            title="Coast Phase"
            formula="Ending = Starting × (1 + Coast_Return)"
            description="During coast years, portfolio grows untouched through returns only. No new investments, no withdrawals. Living expenses funded separately."
            example="₹2Cr × 1.145 = ₹2.29Cr"
          />
          
          <FormulaBox
            title="Withdrawal Phase"
            formula="Ending = Starting × (1 + Retired_Return) - Retirement_Expenses"
            description="During retirement, portfolio provides returns while funding retirement lifestyle."
            example="₹3Cr × 1.105 - ₹15L = ₹3.16Cr"
          />
          
          <FormulaBox
            title="Real Estate Appreciation"
            formula="Property_Value = Initial_Value × (1 + 5%)^Years_Held"
            description="Home purchases appreciate at 5% annually and contribute to total asset growth."
            example="₹50L home after 5 years = ₹50L × 1.05^5 = ₹63.8L"
          />
          
          <FormulaBox
            title="Total Assets"
            formula="Total_Assets = Portfolio_Value + Real_Estate_Value"
            description="Combined liquid (mutual funds, stocks) and non-liquid (real estate) asset values."
            example="₹2Cr portfolio + ₹60L home = ₹2.6Cr total assets"
          />
          
          <FormulaBox
            title="Blended Returns"
            formula="Blended_Return = Σ(Fund_Return × Fund_Share) - 2%"
            description="Weighted average of all fund returns, reduced by 2% for conservative planning."
            example="(12% × 35% + 18% × 20% + 22% × 15% + 8.15% × 30%) - 2% = 11.5%"
          />
          
          <FormulaBox
            title="Inflation Adjustment"
            formula="Future_Expense = Today_Expense × (1 + Inflation)^Years"
            description="All expenses are inflated from current age to the year they occur."
            example="₹1L × (1.06)^18 = ₹2.85L at age 46"
          />
          
          <FormulaBox
            title="Step-up Growth"
            formula="Next_Year_SIP = Current_SIP × (1 + Step_Up_Rate)"
            description="Monthly investments increase annually by the step-up percentage during earning phase."
            example="₹40K × 1.05 = ₹42K next year"
          />
          
          <FormulaBox
            title="Present Value Calculation"
            formula="Present_Value = Future_Value ÷ (1 + Inflation)^Years"
            description="Converts future money values to today's purchasing power using inflation adjustment."
            example="₹10Cr in 25 years = ₹10Cr ÷ (1.06)^25 = ₹2.3Cr in today's money"
          />
        </SimpleGrid>
      </Box>

      {/* Default Values */}
      <Box>
        <Heading size="md" mb={4} color="brand.600">Default User Configuration</Heading>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
          <Box p={4} bg={cardBg} borderRadius="lg" border="1px" borderColor={borderColor}>
            <Text fontSize="md" fontWeight="bold" mb={3} color="brand.600">Basic Parameters</Text>
            <VStack align="start" spacing={2} fontSize="sm" color={textColor}>
              <HStack justify="space-between" w="full">
                <Text>Current Age:</Text>
                <Text fontWeight="bold">28 years</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text>Retirement Age:</Text>
                <Text fontWeight="bold">46 years</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text>Life Expectancy:</Text>
                <Text fontWeight="bold">80 years</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text>Current Savings:</Text>
                <Text fontWeight="bold">₹8 lakhs</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text>Monthly Investment:</Text>
                <Text fontWeight="bold">₹40,000</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text>Annual Step-up:</Text>
                <Text fontWeight="bold">5%</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text>Retirement Expenses:</Text>
                <Text fontWeight="bold">₹1L/month</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text>Inflation Rate:</Text>
                <Text fontWeight="bold">6%</Text>
              </HStack>
            </VStack>
          </Box>
          
          <Box p={4} bg={cardBg} borderRadius="lg" border="1px" borderColor={borderColor}>
            <Text fontSize="md" fontWeight="bold" mb={3} color="brand.600">Coast FIRE Settings</Text>
            <VStack align="start" spacing={2} fontSize="sm" color={textColor}>
              <HStack justify="space-between" w="full">
                <Text>Coast Period:</Text>
                <Text fontWeight="bold">Enabled (7 years)</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text>Coast Duration:</Text>
                <Text fontWeight="bold">Age 46-53</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text>Withdrawal Start:</Text>
                <Text fontWeight="bold">Age 53</Text>
              </HStack>
            </VStack>
            
            <Text fontSize="md" fontWeight="bold" mt={4} mb={3} color="brand.600">Default Life Events</Text>
            <VStack align="start" spacing={2} fontSize="sm" color={textColor}>
              <HStack justify="space-between" w="full">
                <Text>Home Purchase (Age 35):</Text>
                <Text fontWeight="bold">₹45L loan + ₹1.5Cr value</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text>Car Purchase (Age 40):</Text>
                <Text fontWeight="bold">₹33.75L total</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text>Property Sale (Age 40):</Text>
                <Text fontWeight="bold">₹50L windfall</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text>Insurance Payout (Age 44):</Text>
                <Text fontWeight="bold">₹25L windfall</Text>
              </HStack>
            </VStack>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Investment Phases */}
      <Box>
        <Heading size="md" mb={4} color="brand.600">Investment Phase Logic</Heading>
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={4}>
          <Box p={4} bg={useColorModeValue("blue.50", "blue.800")} borderRadius="lg" border="1px" borderColor={useColorModeValue("blue.200", "blue.600")}>
            <Text fontSize="md" fontWeight="bold" mb={2} color={useColorModeValue("blue.700", "blue.200")}>Earning Phase (Age 28-46)</Text>
            <VStack align="start" spacing={1} fontSize="sm" color={textColor}>
              <Text>• Monthly SIP: ₹40K (5% annual step-up)</Text>
              <Text>• PF Split: 30% EPF, 70% Mutual Funds</Text>
              <Text>• Returns: ~11.5% (conservative)</Text>
              <Text>• Major events: Home, car purchases</Text>
              <Text>• Windfalls: Property sale, insurance</Text>
            </VStack>
          </Box>
          
          <Box p={4} bg={useColorModeValue("orange.50", "orange.800")} borderRadius="lg" border="1px" borderColor={useColorModeValue("orange.200", "orange.600")}>
            <Text fontSize="md" fontWeight="bold" mb={2} color={useColorModeValue("orange.700", "orange.200")}>Coast Phase (Age 46-53)</Text>
            <VStack align="start" spacing={1} fontSize="sm" color={textColor}>
              <Text>• No new investments</Text>
              <Text>• No portfolio withdrawals</Text>
              <Text>• Returns: ~14.5% (growth focused)</Text>
              <Text>• Duration: 7 years</Text>
              <Text>• Living expenses funded separately</Text>
              <Text>• Portfolio compounds untouched</Text>
              <Text>• Real estate appreciates at 5% annually</Text>
            </VStack>
          </Box>
          
          <Box p={4} bg={useColorModeValue("green.50", "green.800")} borderRadius="lg" border="1px" borderColor={useColorModeValue("green.200", "green.600")}>
            <Text fontSize="md" fontWeight="bold" mb={2} color={useColorModeValue("green.700", "green.200")}>Withdrawal Phase (Age 53-80)</Text>
            <VStack align="start" spacing={1} fontSize="sm" color={textColor}>
              <Text>• Retirement expenses: ₹1L/month</Text>
              <Text>• 50% reduction after age 65</Text>
              <Text>• Returns: ~10.5% (conservative)</Text>
              <Text>• Duration: 27 years</Text>
              <Text>• Portfolio funds retirement lifestyle</Text>
            </VStack>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Key Assumptions */}
      <Box>
        <Heading size="md" mb={4} color="purple.600">Key Assumptions & Conservative Measures</Heading>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
          <AssumptionBox
            title="2% Return Reduction"
            description="All blended returns are reduced by 2% for worst-case scenario planning."
            impact="More conservative projections, higher safety margin"
          />
          
          <AssumptionBox
            title="12.5% Tax on Withdrawals"
            description="Major life event withdrawals incur 12.5% tax (LTCG + cess)."
            impact="Realistic tax planning, higher actual withdrawal amounts"
          />
          
          <AssumptionBox
            title="6% Annual Inflation"
            description="All future expenses are inflated at 6% per year from current age."
            impact="Realistic expense projections, accounts for cost of living increases"
          />
          
          <AssumptionBox
            title="50% Expense Reduction at 65"
            description="Retirement expenses reduce by 50% after age 65 (home paid, children independent)."
            impact="More sustainable retirement, reflects typical expense patterns"
          />
          
          <AssumptionBox
            title="PF Contribution Split"
            description="30% of monthly investment goes to EPF/VPF, 70% to mutual funds."
            impact="Realistic allocation reflecting mandatory PF contributions"
          />
          
          <AssumptionBox
            title="Real Estate Appreciation"
            description="Home purchases appreciate at 5% annually, contributing to total asset growth alongside liquid investments."
            impact="Diversified wealth building, realistic property growth expectations"
          />
          
          <AssumptionBox
            title="Lifetime Events Flexibility"
            description="Windfalls and withdrawals can occur at any age throughout entire lifetime, not just during earning phase."
            impact="More realistic planning for inheritances, medical costs, and life events"
          />
          
          <AssumptionBox
            title="Home Purchase Integration"
            description="When withdrawing for home purchase, property value is tracked and appreciates separately from liquid portfolio."
            impact="Accounts for real estate as wealth-building asset, not just expense"
          />
        </SimpleGrid>
      </Box>

      {/* Risk Factors */}
      <Box>
        <Heading size="md" mb={4} color="red.600">Risk Factors & Limitations</Heading>
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          <VStack align="start" spacing={2}>
            <AlertDescription fontSize="sm">
              <Text fontWeight="bold">Market Risk:</Text> Actual returns may vary significantly from projections due to market volatility.
            </AlertDescription>
            <AlertDescription fontSize="sm">
              <Text fontWeight="bold">Inflation Risk:</Text> Higher than expected inflation can erode purchasing power.
            </AlertDescription>
            <AlertDescription fontSize="sm">
              <Text fontWeight="bold">Sequence Risk:</Text> Poor returns early in retirement can significantly impact portfolio longevity.
            </AlertDescription>
            <AlertDescription fontSize="sm">
              <Text fontWeight="bold">Health Costs:</Text> Medical expenses in later years may exceed projections.
            </AlertDescription>
          </VStack>
        </Alert>
      </Box>

      {/* Disclaimer */}
      <Box p={4} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="lg">
        <Text fontSize="sm" color={textColor} textAlign="center">
          <Text as="span" fontWeight="bold">Disclaimer:</Text> This calculator provides estimates based on assumptions and historical data. 
          Actual results may vary. Consult with a qualified financial advisor for personalized advice. 
          Past performance does not guarantee future results.
        </Text>
      </Box>
    </VStack>
  );
}