import {
  VStack, HStack, Box, Text, Button, Progress, Alert, AlertIcon, AlertDescription,
  Stat, StatLabel, StatNumber, StatHelpText, useColorModeValue, SimpleGrid,
  Input, NumberInput, NumberInputField, IconButton, Badge, Divider, Flex
} from "@chakra-ui/react";
import { FiPlus, FiTrash2, FiEdit3, FiPieChart, FiTrendingUp } from "react-icons/fi";
import { useState } from "react";

export default function SIPTab({ currentApproach, monthlyInvestment, currentBlended }) {
  // Convert currentApproach to SIP format
  const sips = currentApproach.map(fund => ({
    name: fund.name,
    amount: Math.round(monthlyInvestment * fund.share),
    returns: fund.returns,
    category: fund.category
  }));
  
  const totalSIP = monthlyInvestment; // Should always match since derived from approach
  
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const colors = ["blue", "green", "purple", "orange", "red", "teal", "pink", "cyan"];

  return (
    <VStack spacing={6} align="stretch">
      {/* Header Stats */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Stat bg={cardBg} p={6} borderRadius="xl" shadow="sm" border="1px" borderColor={borderColor}>
          <Flex justify="space-between" align="start">
            <Box>
              <StatLabel color={useColorModeValue("gray.600", "gray.400")} fontSize="sm">Total Monthly SIP</StatLabel>
              <StatNumber fontSize="2xl" color="green.500">
                ₹{totalSIP.toLocaleString("en-IN")}
              </StatNumber>
              <StatHelpText color={useColorModeValue("gray.500", "gray.400")}>
                {sips.length} fund{sips.length !== 1 ? 's' : ''}
              </StatHelpText>
            </Box>
            <Box p={2} bg={useColorModeValue("green.100", "green.800")} borderRadius="lg">
              <FiPieChart size={20} color={useColorModeValue("green.600", "green.300")} />
            </Box>
          </Flex>
        </Stat>

        <Stat bg={cardBg} p={6} borderRadius="xl" shadow="sm" border="1px" borderColor={borderColor}>
          <Flex justify="space-between" align="start">
            <Box>
              <StatLabel color={useColorModeValue("gray.600", "gray.400")} fontSize="sm">Blended Return</StatLabel>
              <StatNumber fontSize="2xl" color="brand.600">
                {(currentBlended.grossReturn * 100).toFixed(1)}%
              </StatNumber>
              <StatHelpText color={useColorModeValue("gray.500", "gray.400")}>Conservative estimate</StatHelpText>
            </Box>
            <Box p={2} bg={useColorModeValue("blue.100", "blue.800")} borderRadius="lg">
              <FiTrendingUp size={20} color={useColorModeValue("blue.600", "blue.300")} />
            </Box>
          </Flex>
        </Stat>

        <Stat bg={cardBg} p={6} borderRadius="xl" shadow="sm" border="1px" borderColor={borderColor}>
          <Flex justify="space-between" align="start">
            <Box>
              <StatLabel color={useColorModeValue("gray.600", "gray.400")} fontSize="sm">Annual Investment</StatLabel>
              <StatNumber fontSize="2xl" color="purple.500">
                ₹{(totalSIP * 12).toLocaleString("en-IN")}
              </StatNumber>
              <StatHelpText>
                <Badge colorScheme="purple" variant="subtle">
                  Per year
                </Badge>
              </StatHelpText>
            </Box>
          </Flex>
        </Stat>
      </SimpleGrid>

      {/* Fund Allocation */}
      <Box bg={cardBg} borderRadius="xl" shadow="sm" border="1px" borderColor={borderColor}>
        <Box p={6} borderBottom="1px" borderColor={borderColor}>
          <Box>
            <Text fontSize="lg" fontWeight="bold">Fund Allocation Breakdown</Text>
            <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
              Based on your earning phase investment approach (auto-synced)
            </Text>
          </Box>
        </Box>

        <Box p={6}>
          <VStack spacing={4} align="stretch">
            {sips.length === 0 ? (
              <Box textAlign="center" py={12}>
                <FiPieChart size={48} color={useColorModeValue("gray.400", "gray.500")} style={{ margin: "0 auto 16px" }} />
                <Text color={useColorModeValue("gray.500", "gray.400")} fontSize="lg" fontWeight="medium" mb={2}>
                  No funds configured
                </Text>
                <Text color={useColorModeValue("gray.400", "gray.500")} fontSize="sm">
                  Configure your investment approach in the Configuration tab
                </Text>
              </Box>
            ) : (
              sips.map((sip, index) => {
                const percentage = (sip.amount / totalSIP) * 100;
                const colorScheme = colors[index % colors.length];
                
                return (
                  <Box
                    key={index}
                    p={4}
                    borderRadius="lg"
                    border="1px"
                    borderColor={borderColor}
                    bg={hoverBg}
                  >
                    <VStack spacing={3} align="stretch">
                      <HStack justify="space-between">
                        <HStack spacing={3}>
                          <Box
                            w={3}
                            h={3}
                            borderRadius="full"
                            bg={`${colorScheme}.500`}
                          />
                          <Box>
                            <Text fontSize="md" fontWeight="semibold">
                              {sip.name}
                            </Text>
                            <HStack spacing={2}>
                              <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")}>
                                {percentage.toFixed(1)}% allocation
                              </Text>
                              <Text fontSize="xs" color={`${colorScheme}.600`} fontWeight="medium">
                                {(sip.returns * 100).toFixed(1)}% returns
                              </Text>
                            </HStack>
                          </Box>
                        </HStack>
                        
                        <VStack align="end" spacing={0}>
                          <Text fontSize="lg" fontWeight="bold" color={`${colorScheme}.600`}>
                            ₹{sip.amount.toLocaleString("en-IN")}
                          </Text>
                          <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>
                            per month
                          </Text>
                        </VStack>
                      </HStack>
                      
                      <Progress
                        value={percentage}
                        colorScheme={colorScheme}
                        size="sm"
                        borderRadius="full"
                        bg={useColorModeValue("gray.100", "gray.600")}
                      />
                    </VStack>
                  </Box>
                );
              })
            )}
          </VStack>
        </Box>
      </Box>

      {/* Annual Investment Summary */}
      {sips.length > 0 && (
        <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm" border="1px" borderColor={borderColor}>
          <Text fontSize="lg" fontWeight="bold" mb={4}>Annual Investment Summary</Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {sips.map((sip, index) => {
              const annual = sip.amount * 12;
              const colorScheme = colors[index % colors.length];
              
              return (
                <HStack key={index} justify="space-between" p={3} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="md">
                  <HStack spacing={2}>
                    <Box w={2} h={2} borderRadius="full" bg={`${colorScheme}.500`} />
                    <Text fontSize="sm" fontWeight="medium">{sip.name}</Text>
                  </HStack>
                  <Text fontSize="sm" fontWeight="bold" color={`${colorScheme}.600`}>
                    ₹{annual.toLocaleString("en-IN")}
                  </Text>
                </HStack>
              );
            })}
            
            <Divider gridColumn={{ md: "1 / -1" }} />
            
            <HStack justify="space-between" p={3} bg={useColorModeValue("brand.50", "brand.900")} borderRadius="md" gridColumn={{ md: "1 / -1" }}>
              <Text fontSize="md" fontWeight="bold">Total Annual Investment</Text>
              <Text fontSize="lg" fontWeight="bold" color="brand.600">
                ₹{(totalSIP * 12).toLocaleString("en-IN")}
              </Text>
            </HStack>
          </SimpleGrid>
        </Box>
      )}
    </VStack>
  );
}