import React from 'react'
import { getEpisode } from '../spotify'
import { formatDurationForHumans } from '../utils';
import { useParams, Link as ReachLink } from "@reach/router"
import { Box, useDisclosure, Image, Text, Heading, Flex, ScaleFade, SlideFade, Stack, Link, Grid, } from '@chakra-ui/react';
import { prominent } from 'color.js'
import dayjs from 'dayjs'
import Loading from '../components/Loading';

const Episode = () => {
  const { isOpen, onToggle } = useDisclosure()
  const [episode, setepisode] = React.useState(null);
  const [colors, setcolors] = React.useState([])
  const [isloading, setisloading] = React.useState(true);
  const params = useParams();

  // fectch show
  const fetchEpisode = async () => {
    const { data } = await getEpisode(params.id)
    const getcolors = await prominent(data.images[0].url, { amount: 5, format: 'hex' })
    setcolors(getcolors)
    setepisode(data)
  };


  // set condition for release date format
  const episodeDate = (date) => {
    const nowYear = dayjs().format('YYYY')
    const releaseYear = dayjs(date).format('YYYY')
    if (parseInt(nowYear) > parseInt(releaseYear)) {
      return dayjs(date).format('MMM YYYY')
    } else {
      return dayjs(date).format('MMM DD')
    }
  }

  React.useEffect(() => {
    fetchEpisode()
    setTimeout(() => {
      setisloading(false)
      onToggle()
    }, 1000);
  }, []);

  return (
    <Box>
      {!isloading ? (
        <>
          <ScaleFade initialScale={0.3} in={isOpen}>
            <Box bgGradient={`linear(transparent 0, ${colors[3]} 100%)`} paddingTop={[5, 10, 20]} paddingBottom={[5, 10]}>
              <Flex alignItems={['flex-start', 'inherit', 'inherit', 'center']} direction={['column', 'column', 'column', 'row']} width="100%" paddingX={3} maxW="1200px" margin="0 auto">
                <Image width={['100px', '150px', '200px']} marginRight={10} boxShadow='lg' rounded="md" src={episode?.images[0].url} />
                <Box marginTop={[3, 5, 5, 0]}>
                  <Heading fontWeight={700} fontSize={[20, 32, 44]} color='#fff'>{episode?.name}</Heading>
                  <Link as={ReachLink} to={`/show/${episode?.show.id}`} fontWeight={600} textDecoration='underline' fontSize={[14, 16, 24]} color='#fff'>{episode?.show.name}</Link>
                  <Stack marginTop={2} direction={['row']} fontSize={16} color="#fff" gap={1}>
                    <Text>{episodeDate(episode.release_date)}</Text>
                    <Text>{formatDurationForHumans(episode.duration_ms)}</Text>
                  </Stack>
                </Box>
              </Flex>
            </Box>
          </ScaleFade>
          <Stack marginTop={[0, 10, 20]} marginBottom={[10, 10, 20]} gap={[10, 14]} width="100%" paddingX={4} maxW="1200px" marginX="auto">
            <SlideFade offsetY='20px' in={isOpen}>
              <Box marginTop={10}>
                <Text fontWeight={600} fontSize={[24, 24, 32]}>Episode description</Text>
                <Text color="#aaa" fontSize={[14, 16]} dangerouslySetInnerHTML={{ __html: episode?.html_description }} />
              </Box>
            </SlideFade>
          </Stack>
        </>
      ) : (
        <Grid placeItems='center' height='90vh'>
          <Loading /></Grid>
      )}
    </Box>
  );
}

export default Episode;