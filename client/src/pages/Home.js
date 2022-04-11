import { Box, Heading, SimpleGrid, SlideFade, useDisclosure } from '@chakra-ui/react';
import React from 'react'
import { getSavedShows } from '../spotify'
import { catchErrors } from '../utils';
import ShowCard from '../components/ShowCard';
import More from '../components/More';

const Home = () => {
  const { isOpen, onToggle } = useDisclosure()
  const [savedShows, setsavedShows] = React.useState([]);
  const [offset, setoffset] = React.useState(0);
  const [next, setnext] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      const { data } = await getSavedShows(offset)
      setoffset(data.offset)
      setnext(data.next)
      if (!offset) {
        setsavedShows(data.items)
        onToggle()
      } else {
        const copySavedShows = [...savedShows]
        setsavedShows([])
        setsavedShows([...copySavedShows, ...data.items])
      }
    };
    catchErrors(fetchData());
  }, [offset]);

  return (
    <Box width="100%" paddingX={3} maxW="1200px" margin="0 auto">
      {/* saved shows */}
      <SlideFade offsetY='-20px' in={isOpen}>
        <Heading marginTop={[5, 10]} fontSize={[24, 24, 32]}>Saved shows</Heading>
        <SimpleGrid minChildWidth='220px' marginTop={[5, 10]} spacing={['10px', '30px']}>
          {savedShows.map((item) => (
            <ShowCard key={item.show.id} item={item.show} />
          ))}
        </SimpleGrid >
        {next && <Box mt={10}><More oldOffset={offset} setNewOffset={() => setoffset(offset+20)} label="More shows..." /></Box>}
      </SlideFade >
    </Box>
  );
}

export default Home;