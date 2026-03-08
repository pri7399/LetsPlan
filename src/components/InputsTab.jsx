import { useState } from "react";
import {
  VStack, HStack, Box, Text, Button, SimpleGrid, Badge, Progress,
  Alert, AlertIcon, AlertDescription, Divider, useColorModeValue, Select, FormControl, FormLabel
} from "@chakra-ui/react";
import { Section, Field, ApproachRow, ApproachSummary, Toggle } from "./UI";

export default function InputsTab({
  currentAge, setCurrentAge, retirementAge, setRetirementAge,
  expensesUntilAge, setExpensesUntilAge, currentSavings, setCurrentSavings,
  monthlyInvestment, setMonthlyInvestment, stepUp, setStepUp,
  postRetirementMonthly, setPostRetirementMonthly, inflation, setInflation,
  coastEnabled, setCoastEnabled, coastYears, setCoastYears,
  withdrawalStartAge, coastApproach, setCoastApproach, coastBlended,
  currentApproach, setCurrentApproach, currentBlended,
  retApproach, setRetApproach, retBlended,
  yearlyBumps, setYearlyBumps, majorWithdrawals, setMajorWithdrawals,
  realEstateAssets, setRealEstateAssets,
  corpusAtWithdrawal, retirementCorpus,
}) {
  // All useColorModeValue calls at the top level
  const orangeBg = useColorModeValue("orange.50", "orange.900");
  const orangeBorder = useColorModeValue("orange.200", "orange.700");
  const whiteBg = useColorModeValue("white", "gray.800");
  const grayBg = useColorModeValue("gray.50", "gray.700");
  const grayBorder = useColorModeValue("gray.200", "gray.600");
  const grayBorder2 = useColorModeValue("gray.100", "gray.600");
  const blueBg = useColorModeValue("blue.50", "blue.900");
  const blueBorder = useColorModeValue("blue.200", "blue.700");
  const greenBg = useColorModeValue("green.50", "green.900");
  const greenBorder = useColorModeValue("green.200", "green.700");
  const redBg = useColorModeValue("red.50", "red.900");
  const redBorder = useColorModeValue("red.200", "red.700");
  const purpleBg = useColorModeValue("purple.50", "purple.900");
  const purpleBorder = useColorModeValue("purple.200", "purple.700");
  
  const [showBumpEditor, setShowBumpEditor] = useState(false);
  const [bumpAge, setBumpAge] = useState(currentAge + 5);
  const [bumpAmount, setBumpAmount] = useState(100000);
  const [bumpReason, setBumpReason] = useState("Bonus");
  
  const [showWithdrawalEditor, setShowWithdrawalEditor] = useState(false);
  const [withdrawalAge, setWithdrawalAge] = useState(currentAge + 10);
  const [withdrawalAmount, setWithdrawalAmount] = useState(500000);
  const [withdrawalPurpose, setWithdrawalPurpose] = useState("Marriage");
  const [homeValue, setHomeValue] = useState(5000000);

  const addBump = () => {
    if (bumpAge >= currentAge && bumpAge < expensesUntilAge && bumpAmount > 0) {
      setYearlyBumps((prev) => ({ 
        ...prev, 
        [bumpAge]: { 
          amount: bumpAmount, 
          reason: bumpReason 
        }
      }));
      setShowBumpEditor(false);
    }
  };

  const removeBump = (age) => {
    setYearlyBumps((prev) => {
      const n = { ...prev };
      delete n[age];
      return n;
    });
  };

  const bumpEntries = Object.entries(yearlyBumps || {}).map(([k, v]) => [Number(k), v]).sort((a, b) => a[0] - b[0]);

  const addWithdrawal = () => {
    if (withdrawalAge >= currentAge && withdrawalAge < expensesUntilAge && withdrawalAmount > 0) {
      const taxAmount = withdrawalAmount * 0.125; // 12.5% tax
      const totalWithdrawal = withdrawalAmount + taxAmount;
      const withdrawalData = {
        amount: withdrawalAmount,
        tax: taxAmount,
        total: totalWithdrawal,
        purpose: withdrawalPurpose
      };
      
      // Add home value if it's a home purchase
      if (withdrawalPurpose === "Home Purchase" && homeValue > 0) {
        withdrawalData.homeValue = homeValue;
        // Add to real estate assets
        setRealEstateAssets((prev) => ({
          ...prev,
          [withdrawalAge]: {
            initialValue: homeValue,
            purchaseAge: withdrawalAge,
            appreciationRate: 0.05 // 5% annual appreciation
          }
        }));
      }
      
      setMajorWithdrawals((prev) => ({ 
        ...prev, 
        [withdrawalAge]: withdrawalData
      }));
      setShowWithdrawalEditor(false);
    }
  };

  const removeWithdrawal = (age) => {
    setMajorWithdrawals((prev) => {
      const n = { ...prev };
      delete n[age];
      return n;
    });
    // Also remove real estate asset if it exists for this age
    setRealEstateAssets((prev) => {
      const n = { ...prev };
      delete n[age];
      return n;
    });
  };

  const withdrawalEntries = Object.entries(majorWithdrawals || {}).map(([k, v]) => [Number(k), v]).sort((a, b) => a[0] - b[0]);

  return (
    <VStack spacing={6} align="stretch">
      <Section title="Personal Details" icon="👤" accentColor="brand.500">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Field label="Current Age" value={currentAge} onChange={setCurrentAge} min={18} max={80} />
          <Field label="Retirement Age" value={retirementAge} onChange={setRetirementAge} min={currentAge + 1} max={90} />
          <Field label="Expenses Until Age" value={expensesUntilAge} onChange={setExpensesUntilAge} min={retirementAge} max={100} />
        </SimpleGrid>
      </Section>

      {/* COAST FIRE */}
      <Section title="Coast FIRE" icon="🏖️" defaultOpen={true} accentColor="orange.500">
        <VStack align="stretch" spacing={4}>
          <Toggle 
            enabled={coastEnabled} 
            onToggle={() => setCoastEnabled(!coastEnabled)} 
            label="Enable Coast FIRE" 
            colorScheme="orange"
          />
          
          {!coastEnabled ? (
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <AlertDescription fontSize="sm">
                <Text as="span" fontWeight="bold" color="orange.600">Coast FIRE</Text> — retire but don't touch your portfolio for a few years. Let compounding grow it while you cover expenses from other sources.
              </AlertDescription>
            </Alert>
          ) : (
            <VStack align="stretch" spacing={4}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Field 
                  label="Coast Years" 
                  value={coastYears} 
                  onChange={setCoastYears} 
                  min={1} max={20}
                  helpText={`Withdrawals start at age ${withdrawalStartAge}`} 
                />
              </SimpleGrid>
              
              <Box p={4} bg={orangeBg} borderRadius="md" border="1px" borderColor={orangeBorder}>
                <VStack spacing={3}>
                  <Box w="full" h={4} bg={useColorModeValue("gray.200", "gray.600")} borderRadius="md" overflow="hidden">
                    <HStack spacing={0} h="full">
                      <Box 
                        flex={retirementAge - currentAge} 
                        bg="brand.500" 
                        h="full"
                      />
                      <Box 
                        flex={coastYears} 
                        bg="orange.500" 
                        h="full"
                      />
                      <Box 
                        flex={Math.max(1, expensesUntilAge - withdrawalStartAge)} 
                        bg="green.500" 
                        h="full"
                      />
                    </HStack>
                  </Box>
                  <HStack justify="space-between" w="full" fontSize="xs">
                    <Text>Age {currentAge}</Text>
                    <Text ml={1} color="brand.600" fontWeight="semibold">Retire {retirementAge}</Text>
                    <Text color="green.600" fontWeight="semibold">Withdraw starts {withdrawalStartAge}</Text>
                    <Text color="gray.400" fontWeight="semibold">Living life...</Text>
                    <Text>Dead {expensesUntilAge}</Text>
                  </HStack>
                </VStack>
              </Box>
              
              <Box>
                <Text fontSize="sm" fontWeight="semibold" color="orange.600" mb={3}>
                  Coast Period Investment Mix
                </Text>
                <Box bg={whiteBg} borderRadius="md" border="1px" borderColor={grayBorder}>
                  <SimpleGrid columns={4} spacing={3} p={3} bg={grayBg} borderTopRadius="md">
                    {["Fund", "Returns %", "Tax %", "Share %"].map((h) => (
                      <Text key={h} fontSize="xs" fontWeight="semibold">{h}</Text>
                    ))}
                  </SimpleGrid>
                  {coastApproach.map((item, i) => (
                    <ApproachRow 
                      key={i} 
                      item={item} 
                      onChange={(u) => { 
                        const n = [...coastApproach]; 
                        n[i] = u; 
                        setCoastApproach(n); 
                      }} 
                    />
                  ))}
                </Box>
                <ApproachSummary blended={coastBlended} accentColor="orange.500" />
                
                <Box mt={4} p={3} bg={orangeBg} borderRadius="md" border="1px" borderColor={orangeBorder}>
                  <Text fontSize="sm" fontWeight="semibold" color="orange.600" mb={2}>Total Fund Allocation During Coast Phase</Text>
                  <Text fontSize="xs" color="orange.500" mb={2}>Based on Retirement Corpus: ₹{(retirementCorpus / 10000000).toFixed(2)}Cr</Text>
                  <Box bg={whiteBg} borderRadius="md" border="1px" borderColor={grayBorder}>
                    <SimpleGrid columns={4} spacing={2} p={2} bg={grayBg} borderTopRadius="md">
                      <Text fontSize="xs" fontWeight="semibold">Fund</Text>
                      <Text fontSize="xs" fontWeight="semibold">Amount</Text>
                      <Text fontSize="xs" fontWeight="semibold">Return %</Text>
                      <Text fontSize="xs" fontWeight="semibold">Annual Income</Text>
                    </SimpleGrid>
                    {coastApproach.map((fund, i) => {
                      const totalAmount = (retirementCorpus * fund.share / 10000000).toFixed(2);
                      const annualIncome = (retirementCorpus * fund.share * fund.returns / 10000000).toFixed(2);
                      return (
                        <SimpleGrid key={i} columns={4} spacing={2} p={2} borderBottom="1px" borderColor={grayBorder2}>
                          <Text fontSize="xs">{fund.name}</Text>
                          <Text fontSize="xs" fontWeight="semibold">₹{totalAmount}Cr</Text>
                          <Text fontSize="xs">{(fund.returns * 100).toFixed(1)}%</Text>
                          <Text fontSize="xs" fontWeight="semibold" color="green.600">₹{annualIncome}Cr</Text>
                        </SimpleGrid>
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            </VStack>
          )}
        </VStack>
      </Section>

      <Section title="Current Financial Position" icon="💰" accentColor="green.500">
        <VStack align="stretch" spacing={4}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Field label="Current Savings" value={currentSavings} onChange={setCurrentSavings} step={100000} />
            <Field label="Monthly Investment" value={monthlyInvestment} onChange={setMonthlyInvestment} step={5000} />
            <Field label="Annual Step-up %" value={stepUp} onChange={setStepUp} step={0.5} />
          </SimpleGrid>

          <HStack justify="flex-start">
            <Button 
              colorScheme="green" 
              variant="outline"
              size="sm"
              w="15%"
              onClick={() => setShowBumpEditor(true)}
            >
              Add Extra Amount
            </Button>
          </HStack>

          {bumpEntries.length > 0 && (
            <Box p={3} bg={useColorModeValue("blue.50", "blue.900")} borderRadius="md" border="1px" borderColor={useColorModeValue("blue.200", "blue.700")}>
              <Text fontSize="sm" fontWeight="semibold" mb={2}>Scheduled Windfalls</Text>
              <VStack spacing={1}>
                {bumpEntries.map(([age, bump]) => (
                  <HStack key={age} justify="space-between" w="full">
                    <Text fontSize="sm">
                      Age <Text as="span" fontWeight="bold">{age}</Text>: {bump.reason} +₹{bump.amount.toLocaleString("en-IN")}
                    </Text>
                    <HStack spacing={1}>
                      <Button 
                        size="xs" 
                        colorScheme="blue" 
                        variant="ghost" 
                        onClick={() => {
                          setBumpAge(age);
                          setBumpAmount(bump.amount);
                          setBumpReason(bump.reason);
                          setShowBumpEditor(true);
                        }}
                      >
                        ✏️
                      </Button>
                      <Button size="xs" colorScheme="red" variant="ghost" onClick={() => removeBump(age)}>
                        ✕
                      </Button>
                    </HStack>
                  </HStack>
                ))}
              </VStack>
            </Box>
          )}

          {showBumpEditor && (
            <Box p={4} bg={useColorModeValue("green.50", "green.900")} borderRadius="md" border="1px" borderColor={useColorModeValue("green.200", "green.700")}>
              <HStack justify="space-between" mb={4}>
                <Text fontSize="sm">
                  Got a bonus, sold property, or salary hike? Add one-time lump sum amounts to your savings at specific ages, <Text as="span" fontWeight="semibold">on top of</Text> the {stepUp}% annual step-up.
                </Text>
                <Button 
                  size="xs" 
                  variant="ghost" 
                  onClick={() => setShowBumpEditor(false)}
                  aria-label="Close editor"
                >
                  ✕
                </Button>
              </HStack>
              
              <HStack spacing={3} mb={4} wrap="wrap">
                <Field label="At Age" value={bumpAge} onChange={setBumpAge} min={currentAge} max={expensesUntilAge - 1} />
                <Field label="One-time Amount" value={bumpAmount} onChange={setBumpAmount} step={50000} />
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold">Reason</FormLabel>
                  <Select 
                    value={bumpReason} 
                    onChange={(e) => setBumpReason(e.target.value)}
                    size="sm"
                  >
                    <option value="Bonus">Bonus</option>
                    <option value="Inheritance">Inheritance</option>
                    <option value="Property Sale">Property Sale</option>
                    <option value="Stock Options">Stock Options</option>
                    <option value="Business Sale">Business Sale</option>
                    <option value="Insurance Payout">Insurance Payout</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormControl>
                <VStack spacing={2}>
                  <Button colorScheme="green" size="sm" onClick={addBump}>
                    Add Bump
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowBumpEditor(false)}>
                    Cancel
                  </Button>
                </VStack>
              </HStack>
            </Box>
          )}
        </VStack>
      </Section>

      <Section title="Major Life Events" icon="🏠" accentColor="red.500">
        <VStack align="stretch" spacing={4}>
          <HStack justify="flex-start">
            <Button 
              colorScheme="red" 
              variant="outline"
              size="sm"
              w="15%"
              onClick={() => setShowWithdrawalEditor(true)}
            >
              Add Major Expense
            </Button>
          </HStack>

          {withdrawalEntries.length > 0 && (
            <Box p={3} bg={useColorModeValue("red.50", "red.900")} borderRadius="md" border="1px" borderColor={useColorModeValue("red.200", "red.700")}>
              <Text fontSize="sm" fontWeight="semibold" mb={2}>Scheduled Withdrawals</Text>
              <VStack spacing={1}>
                {withdrawalEntries.map(([age, withdrawal]) => (
                  <HStack key={age} justify="space-between" w="full">
                    <Text fontSize="sm">
                      Age <Text as="span" fontWeight="bold">{age}</Text>: {withdrawal.purpose} -₹{withdrawal.total.toLocaleString("en-IN")} (incl. 12.5% tax)
                    </Text>
                    <HStack spacing={1}>
                      <Button 
                        size="xs" 
                        colorScheme="blue" 
                        variant="ghost" 
                        onClick={() => {
                          setWithdrawalAge(age);
                          setWithdrawalAmount(withdrawal.amount);
                          setWithdrawalPurpose(withdrawal.purpose);
                          if (withdrawal.homeValue) setHomeValue(withdrawal.homeValue);
                          setShowWithdrawalEditor(true);
                        }}
                      >
                        ✏️
                      </Button>
                      <Button size="xs" colorScheme="red" variant="ghost" onClick={() => removeWithdrawal(age)}>
                        ✕
                      </Button>
                    </HStack>
                  </HStack>
                ))}
              </VStack>
            </Box>
          )}

          {showWithdrawalEditor && (
            <Box p={4} bg={useColorModeValue("red.50", "red.900")} borderRadius="md" border="1px" borderColor={useColorModeValue("red.200", "red.700")}>
              <HStack justify="space-between" mb={4}>
                <Text fontSize="sm">
                  Planning major life events? Add withdrawals for marriage, home purchase, car, child education etc. <Text as="span" fontWeight="semibold">12.5% tax</Text> will be applied.
                </Text>
                <Button 
                  size="xs" 
                  variant="ghost" 
                  onClick={() => setShowWithdrawalEditor(false)}
                  aria-label="Close editor"
                >
                  ✕
                </Button>
              </HStack>
              
              <HStack spacing={3} mb={4} wrap="wrap">
                <Field label="At Age" value={withdrawalAge} onChange={setWithdrawalAge} min={currentAge} max={expensesUntilAge - 1} />
                <Field label="Withdrawal Amount" value={withdrawalAmount} onChange={setWithdrawalAmount} step={100000} />
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold">Purpose</FormLabel>
                  <Select 
                    value={withdrawalPurpose} 
                    onChange={(e) => setWithdrawalPurpose(e.target.value)}
                    size="sm"
                  >
                    <option value="Marriage">Marriage</option>
                    <option value="Home Purchase">Home Purchase</option>
                    <option value="Car Purchase">Car Purchase</option>
                    <option value="Child Education">Child Education</option>
                    <option value="Medical Emergency">Medical Emergency</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormControl>
                {withdrawalPurpose === "Home Purchase" && (
                  <Field label="Home Value" value={homeValue} onChange={setHomeValue} step={100000} />
                )}
                <VStack spacing={2}>
                  <Button colorScheme="red" size="sm" onClick={addWithdrawal}>
                    Add Withdrawal
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowWithdrawalEditor(false)}>
                    Cancel
                  </Button>
                </VStack>
              </HStack>
              
              <Alert status="warning" size="sm" borderRadius="md">
                <AlertIcon />
                <AlertDescription fontSize="xs">
                  Total deduction: ₹{withdrawalAmount.toLocaleString("en-IN")} + ₹{(withdrawalAmount * 0.125).toLocaleString("en-IN")} (tax) = ₹{(withdrawalAmount * 1.125).toLocaleString("en-IN")}
                </AlertDescription>
              </Alert>
            </Box>
          )}
        </VStack>
      </Section>

      <Section title="Post-Retirement Expenses" icon="🌴" accentColor="yellow.500">
        <VStack align="stretch" spacing={4}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Field label="Monthly Expenses (today's rate)" value={postRetirementMonthly} onChange={setPostRetirementMonthly} step={10000} />
            <Field label="Inflation Rate %" value={inflation} onChange={setInflation} step={0.5} />
          </SimpleGrid>
          
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <AlertDescription fontSize="sm">
              💡 ₹{postRetirementMonthly.toLocaleString("en-IN")}/mo today → ₹{Math.round(postRetirementMonthly * Math.pow(1 + inflation / 100, withdrawalStartAge - currentAge)).toLocaleString("en-IN")}/mo at withdrawal start (age {withdrawalStartAge})
            </AlertDescription>
          </Alert>
        </VStack>
      </Section>

      <Section title="Earning Phase — Investment Approach" icon="📊" accentColor="brand.500">
        <VStack align="stretch" spacing={4}>
          <Text fontSize="sm">
            Pick funds from each category. Monthly investment (₹{monthlyInvestment.toLocaleString("en-IN")}) is auto-split by share %.
          </Text>
          
          <Box bg={whiteBg} borderRadius="md" border="1px" borderColor={grayBorder}>
            <SimpleGrid columns={4} spacing={3} p={3} bg={grayBg} borderTopRadius="md">
              {["Fund", "Returns %", "Tax %", "Share %"].map((h) => (
                <Text key={h} fontSize="xs" fontWeight="semibold">{h}</Text>
              ))}
            </SimpleGrid>
            {currentApproach.map((item, i) => (
              <ApproachRow 
                key={i} 
                item={item} 
                monthlyInvestment={monthlyInvestment}
                onChange={(u) => { 
                  const n = [...currentApproach]; 
                  n[i] = u; 
                  setCurrentApproach(n); 
                }} 
              />
            ))}
          </Box>
          <ApproachSummary blended={currentBlended} accentColor="brand.500" />
        </VStack>
      </Section>

      <Section title="Withdrawal Phase — Investment Approach" icon="💜" accentColor="purple.500">
        <VStack align="stretch" spacing={4}>
          <Box bg={whiteBg} borderRadius="md" border="1px" borderColor={grayBorder}>
            <SimpleGrid columns={4} spacing={3} p={3} bg={grayBg} borderTopRadius="md">
              {["Fund", "Returns %", "Tax %", "Share %"].map((h) => (
                <Text key={h} fontSize="xs" fontWeight="semibold">{h}</Text>
              ))}
            </SimpleGrid>
            {retApproach.map((item, i) => (
              <ApproachRow 
                key={i} 
                item={item}
                onChange={(u) => { 
                  const n = [...retApproach]; 
                  n[i] = u; 
                  setRetApproach(n); 
                }} 
              />
            ))}
          </Box>
          <ApproachSummary blended={retBlended} accentColor="purple.500" />
          
          <Box mt={4} p={3} bg={useColorModeValue("purple.50", "purple.900")} borderRadius="md" border="1px" borderColor={useColorModeValue("purple.200", "purple.700")}>
            <Text fontSize="sm" fontWeight="semibold" color="purple.600" mb={2}>Fund Allocation at Withdrawal Phase Start</Text>
            <Box bg={useColorModeValue("white", "gray.800")} borderRadius="md" border="1px" borderColor={useColorModeValue("gray.200", "gray.600")}>
              <SimpleGrid columns={4} spacing={2} p={2} bg={useColorModeValue("gray.50", "gray.700")} borderTopRadius="md">
                <Text fontSize="xs" fontWeight="semibold">Fund</Text>
                <Text fontSize="xs" fontWeight="semibold">Amount</Text>
                <Text fontSize="xs" fontWeight="semibold">Return %</Text>
                <Text fontSize="xs" fontWeight="semibold">Annual Income</Text>
              </SimpleGrid>
              {retApproach.map((fund, i) => {
                const fundAmount = (corpusAtWithdrawal * fund.share / 10000000).toFixed(2);
                const annualIncome = (corpusAtWithdrawal * fund.share * fund.returns / 10000000).toFixed(2);
                return (
                  <SimpleGrid key={i} columns={4} spacing={2} p={2} borderBottom="1px" borderColor={useColorModeValue("gray.100", "gray.600")}>
                    <Text fontSize="xs">{fund.name}</Text>
                    <Text fontSize="xs" fontWeight="semibold">₹{fundAmount}Cr</Text>
                    <Text fontSize="xs">{(fund.returns * 100).toFixed(1)}%</Text>
                    <Text fontSize="xs" fontWeight="semibold" color="green.600">₹{annualIncome}Cr</Text>
                  </SimpleGrid>
                );
              })}
              <SimpleGrid columns={4} spacing={2} p={2} bg={useColorModeValue("gray.50", "gray.700")} borderBottomRadius="md">
                <Text fontSize="xs" fontWeight="bold">Total</Text>
                <Text fontSize="xs" fontWeight="bold">₹{(corpusAtWithdrawal / 10000000).toFixed(2)}Cr</Text>
                <Text fontSize="xs" fontWeight="bold">{(retBlended.grossReturn * 100).toFixed(1)}%</Text>
                <Text fontSize="xs" fontWeight="bold" color="green.600">₹{(corpusAtWithdrawal * retBlended.grossReturn / 10000000).toFixed(2)}Cr</Text>
              </SimpleGrid>
            </Box>
          </Box>
        </VStack>
      </Section>
    </VStack>
  );
}