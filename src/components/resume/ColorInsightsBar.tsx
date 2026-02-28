import { Box, HStack, VStack, Text, Badge } from '@chakra-ui/react';

const cards = [
  {
    title: 'ATS Score',
    value: '94%',
    tone: 'blue',
    delta: '+6%',
    progress: 94,
  },
  {
    title: 'Keywords Match',
    value: '81%',
    tone: 'purple',
    delta: '+3%',
    progress: 81,
  },
  {
    title: 'Readability',
    value: 'A-',
    tone: 'orange',
    delta: 'Great',
    progress: 88,
  },
];

const ColorInsightsBar = () => {
  return (
    <HStack gap={4} align="stretch" w="full" overflowX="auto" py={1}>
      {cards.map((card) => (
        <Box
          key={card.title}
          minW="240px"
          flex="1"
          bgGradient={`linear(to-br, ${card.tone}.50, white)`}
          _dark={{
            bgGradient: `linear(to-br, ${card.tone}.900, gray.800)`,
            borderColor: `${card.tone}.700`,
          }}
          borderWidth="1px"
          borderColor={`${card.tone}.200`}
          borderRadius="xl"
          p={4}
          boxShadow="sm"
        >
          <VStack align="start" gap={2}>
            <HStack justify="space-between" w="full">
              <Text fontSize="sm" fontWeight="700" color="gray.600" _dark={{ color: 'gray.200' }}>
                {card.title}
              </Text>
              <Badge colorScheme={card.tone}>{card.delta}</Badge>
            </HStack>
            <Text fontSize="2xl" fontWeight="800" color={`${card.tone}.600`} _dark={{ color: `${card.tone}.200` }}>
              {card.value}
            </Text>
            <Box w="full" h="8px" bg="blackAlpha.200" _dark={{ bg: 'whiteAlpha.300' }} borderRadius="full" overflow="hidden">
              <Box
                h="full"
                w={`${card.progress}%`}
                bg={`${card.tone}.500`}
                _dark={{ bg: `${card.tone}.300` }}
                borderRadius="full"
              />
            </Box>
          </VStack>
        </Box>
      ))}
    </HStack>
  );
};

export default ColorInsightsBar;
