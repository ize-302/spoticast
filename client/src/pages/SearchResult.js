import React from 'react';
import { Box, Heading, SimpleGrid, SlideFade, useDisclosure } from '@chakra-ui/react';
import { search } from '../spotify'
import { catchErrors } from '../utils';
import { useLocation } from "@reach/router"
import ShowCard from '../components/ShowCard';

const SearchResult = () => {
  const { isOpen, onToggle } = useDisclosure()
  const [results, setresults] = React.useState([]);
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q');
  const location = useLocation()

  React.useEffect(() => {
    onToggle()
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      const { data } = await search(query)
      setresults(data.shows.items)
    };
    catchErrors(fetchData());
  }, [location.search, query]);
  
  return (
    <Box width="100%" paddingX={3} maxW="1200px" margin="0 auto">
      {/* saved shows */}
      <SlideFade offsetY='-20px' in={isOpen}>
        <Heading marginTop={[5, 10]} fontSize={20}>Search Result</Heading>
        <SimpleGrid minChildWidth='220px' marginY={[5, 10]} spacing={['10px', '30px']}>
          {results.map((item) => (
            <ShowCard key={item.id} item={item} />
          ))
          }
        </SimpleGrid >
      </SlideFade >
    </Box >
  );
}
 
export default SearchResult;