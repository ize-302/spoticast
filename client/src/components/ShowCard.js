import React from 'react';
import { Box, Heading, Image, Text, Flex } from '@chakra-ui/react';
import { navigate } from "@reach/router"

const ShowCard = ({item}) => {
  return (
    <Box onClick={() => navigate(`/show/${item.id}`)} key={item.id} bg='#191919' boxShadow='lg' rounded="md" padding={[2, 4]} _hover={{ boxShadow: '2xl', cursor: 'pointer', transform: 'scale(1.05)' }}
      transition='all .25s cubic-bezier(.645,.045,.355,1) 0s'>
      <Flex direction={['row', 'column']} >
        <Image width={['80px', "100%"]} objectFit="cover" h={['80px', "235px"]} marginBottom={[0, 3]} boxShadow='lg' src={item.images[0].url} />
        <Box marginLeft={[5, 0]}>
          <Heading marginBottom={1} fontSize={16}>{item.name}</Heading>
          <Text fontSize={12}>{item.publisher}</Text>
        </Box>
      </Flex>
    </Box>
  );
}
 
export default ShowCard;