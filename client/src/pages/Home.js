import { Box, Heading, SimpleGrid, SlideFade, useDisclosure } from '@chakra-ui/react';
import React from 'react'
import { getSavedShows } from '../spotify'
import { catchErrors } from '../utils';
import ShowCard from '../components/ShowCard';

const Home = () => {
  const { isOpen, onToggle } = useDisclosure()
  const [savedShows, setsavedShows] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const { data } = await getSavedShows()
      setsavedShows(data.items)
      onToggle()
    };
    catchErrors(fetchData());
  }, []);

  return (
    <Box width="100%" paddingX={3} maxW="1200px" margin="0 auto">
      {/* saved shows */}
      <SlideFade offsetY='-20px' in={isOpen}>
        <Heading marginTop={[5, 10]} fontSize={20}>Saved shows</Heading>
        <SimpleGrid minChildWidth='220px' marginTop={[5, 10]} spacing={['10px', '30px']}>
          {savedShows.map((item) => (
            <ShowCard key={item.show.id} item={item.show} />
          ))
          }
        </SimpleGrid >
      </SlideFade >
    </Box>
  );
}

export default Home;