import React from 'react';
import { Box, Heading, SimpleGrid, SlideFade, useDisclosure, Grid } from '@chakra-ui/react';
import { search } from '../spotify'
import { catchErrors } from '../utils';
import { useLocation } from "@reach/router"
import ShowCard from '../components/ShowCard';
import More from '../components/More';

const SearchResult = () => {
  const { isOpen, onToggle } = useDisclosure()
  const [results, setresults] = React.useState([]);
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q');
  const location = useLocation()
  const [offset, setoffset] = React.useState(0);
  const [next, setnext] = React.useState(null);

  React.useEffect(() => {
    onToggle()
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      const { data } = await search(query, offset)
      setoffset(data.shows.offset)
      setnext(data.shows.next)
      if (!offset) {
        setresults(data.shows.items)
      } else {
        const copyResult = [...results]
        setresults([])
        setresults([...copyResult, ...data.shows.items])
      }
    };
    catchErrors(fetchData());
  }, [location.search, query, offset]);
  
  return (
    <Box width="100%" paddingX={3} maxW="1200px" margin="0 auto">
      {/* saved shows */}
      {results.length > 0 ? (
        <SlideFade offsetY='-20px' in={isOpen}>
          <Heading marginTop={[5, 10]} fontSize={[24, 24, 32]}>Search Result</Heading>
          <SimpleGrid minChildWidth='220px' marginY={[5, 10]} spacing={['10px', '30px']}>
            {results.map((item, index) => (
              <ShowCard key={index} item={item} />
            ))
            }
          </SimpleGrid>
          {next && <More oldOffset={offset} setNewOffset={() => setoffset(offset+20)} label="More shows..." />}
        </SlideFade >
      ) : (
        <Grid marginTop={40} placeItems='center' fontSize={32} fontWeight={600}>No search results</Grid>
      )}
    </Box >
  );
}
 
export default SearchResult;