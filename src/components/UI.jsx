import { useState } from "react";
import {
  Box, VStack, HStack, Text, Input, FormControl, FormLabel, FormHelperText,
  Select, NumberInput, NumberInputField, Switch, Button, Divider,
  Collapse, IconButton, useDisclosure, Grid, GridItem, Badge, useColorModeValue
} from "@chakra-ui/react";
import { FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
import { pct, FUND_CATALOG, getFund } from "../utils/calc";

export function Section({ title, icon, defaultOpen = true, children, accentColor = "brand.500" }) {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: defaultOpen });
  const cardBg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  
  return (
    <Box bg={cardBg} borderRadius="xl" shadow="sm" border="1px" borderColor={useColorModeValue("gray.200", "gray.600")} mb={6}>
      <HStack
        p={6} cursor="pointer" onClick={onToggle}
        justify="space-between" _hover={{ bg: hoverBg }}
        borderRadius="xl"
      >
        <HStack spacing={3}>
          <Box
            w={10} h={10} borderRadius="lg"
            bg={`${accentColor}22`} display="flex"
            alignItems="center" justifyContent="center"
            fontSize="lg"
          >
            {icon}
          </Box>
          <Text fontSize="lg" fontWeight="bold">{title}</Text>
        </HStack>
        <IconButton
          icon={isOpen ? <FiChevronUp /> : <FiChevronDown />}
          variant="ghost"
          size="sm"
          aria-label="Toggle section"
        />
      </HStack>
      <Collapse in={isOpen}>
        <Box px={6} pb={6}>
          <Divider mb={4} />
          {children}
        </Box>
      </Collapse>
    </Box>
  );
}

export function Field({ label, value, onChange, type = "number", suffix, prefix, min, max, step, helpText }) {
  return (
    <FormControl>
      <FormLabel fontSize="sm" fontWeight="semibold">{label}</FormLabel>
      <NumberInput
        value={value}
        onChange={(_, val) => onChange(val)}
        min={min} max={max} step={step}
      >
        <NumberInputField
          border="1px"
          borderColor={useColorModeValue("gray.300", "gray.600")}
          _hover={{ borderColor: useColorModeValue("gray.400", "gray.500") }}
          _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px brand.500" }}
        />
      </NumberInput>
      {helpText && <FormHelperText fontSize="xs">{helpText}</FormHelperText>}
    </FormControl>
  );
}

export function ApproachRow({ item, onChange, monthlyInvestment }) {
  const cat = FUND_CATALOG[item.category];
  if (!cat) return null;

  const handleFundChange = (e) => {
    const fundId = e.target.value;
    const fund = getFund(item.category, fundId);
    if (fund) {
      onChange({ ...item, fundId, name: fund.name, returns: fund.returns });
    }
  };

  const monthlyAlloc = monthlyInvestment ? Math.round(monthlyInvestment * item.share) : 0;

  return (
    <Box p={4} borderBottom="1px" borderColor={useColorModeValue("gray.200", "gray.600")}>
      <Grid templateColumns="2fr 1fr 1fr 1fr" gap={4} alignItems="center">
        <GridItem>
          <FormControl>
            <FormLabel fontSize="xs" fontWeight="semibold" mb={1}>
              {cat.label}
            </FormLabel>
            <Select
              value={item.fundId}
              onChange={handleFundChange}
              size="sm"
              _focus={{ borderColor: "brand.500" }}
            >
              {cat.funds.map((f) => (
                <option key={f.id} value={f.id}>{f.name} ({f.desc})</option>
              ))}
            </Select>
          </FormControl>
        </GridItem>
        
        <GridItem>
          <NumberInput
            value={+(item.returns * 100).toFixed(2)}
            onChange={(_, val) => onChange({ ...item, returns: val / 100 })}
            step={0.5} size="sm"
          >
            <NumberInputField textAlign="center" _focus={{ borderColor: "brand.500" }} />
          </NumberInput>
        </GridItem>
        
        <GridItem>
          <NumberInput
            value={+(item.tax * 100).toFixed(2)}
            onChange={(_, val) => onChange({ ...item, tax: val / 100 })}
            step={1} size="sm"
          >
            <NumberInputField textAlign="center" _focus={{ borderColor: "brand.500" }} />
          </NumberInput>
        </GridItem>
        
        <GridItem>
          <NumberInput
            value={+(item.share * 100).toFixed(1)}
            onChange={(_, val) => onChange({ ...item, share: val / 100 })}
            step={5} size="sm"
          >
            <NumberInputField textAlign="center" _focus={{ borderColor: "brand.500" }} />
          </NumberInput>
        </GridItem>
      </Grid>
      
      {monthlyInvestment > 0 && (
        <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} mt={2}>
          ₹{monthlyAlloc.toLocaleString("en-IN")}/mo → {item.name}
        </Text>
      )}
    </Box>
  );
}

export function ApproachSummary({ blended, accentColor = "brand.500" }) {
  const isValidShare = Math.abs(blended.totalShare - 1) < 0.001;
  
  return (
    <VStack spacing={2} mt={3}>
      <HStack justify="space-between" wrap="wrap" spacing={4} w="full" p={3} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="md">
        <HStack spacing={2}>
          <Text fontSize="sm">Total Share:</Text>
          <Badge colorScheme={isValidShare ? "green" : "red"} variant="subtle">
            {(blended.totalShare * 100).toFixed(0)}%
          </Badge>
        </HStack>
        <HStack spacing={2}>
          <Text fontSize="sm">Blended Return:</Text>
          <Text fontSize="sm" fontWeight="bold" color={accentColor}>
            {pct(blended.grossReturn)}
          </Text>
          <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")}>
            (Post-tax: {pct(blended.postTaxReturn)})
          </Text>
          
        </HStack>
      </HStack>
      <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} textAlign="center">
        ⚠️ Blended return reduced by 2% for conservative worst-case planning
      </Text>
    </VStack>
  );
}

export function SIPRow({ item, onChange, onRemove }) {
  return (
    <HStack spacing={3} mb={3}>
      <Input
        value={item.name}
        onChange={(e) => onChange({ ...item, name: e.target.value })}
        placeholder="Fund name"
        flex={2}
        size="sm"
        _focus={{ borderColor: "brand.500" }}
      />
      <NumberInput
        value={item.amount}
        onChange={(_, val) => onChange({ ...item, amount: val })}
        flex={1} size="sm"
      >
        <NumberInputField textAlign="right" _focus={{ borderColor: "brand.500" }} />
      </NumberInput>
      <IconButton
        icon={<FiX />}
        onClick={onRemove}
        colorScheme="red"
        variant="ghost"
        size="sm"
        aria-label="Remove SIP"
      />
    </HStack>
  );
}

export function Toggle({ enabled, onToggle, label, colorScheme = "brand" }) {
  return (
    <HStack spacing={3}>
      <Switch
        isChecked={enabled}
        onChange={onToggle}
        colorScheme={colorScheme}
        size="md"
      />
      <Text fontSize="sm" fontWeight="semibold" color={enabled ? `${colorScheme}.600` : "gray.500"}>
        {label}
      </Text>
    </HStack>
  );
}