import React from 'react'
import { getShowMetadata, checkUserSavedShows, subscribeToShows, UnfollowShows } from '../spotify'
import { catchErrors, formatDurationForHumans } from '../utils';
import { useParams, Link as ReachLink, navigate } from "@reach/router"
import { Box, useDisclosure, Image, Text, Heading, Flex, Link, SlideFade, Progress, ScaleFade, Grid, Stack, Button, Icon } from '@chakra-ui/react';
import { prominent } from 'color.js'
import dayjs from 'dayjs'
import Loading from '../components/Loading';
import { MdPlayArrow, MdBarChart } from "react-icons/md";
import { usePlayer } from '../contexts/PlayerContext';

const Show = () => {
  const { currentEpisode, pauseEpisode, playEpisode } = usePlayer();
  const { isOpen, onToggle } = useDisclosure()
  const [metadata, setmetadata] = React.useState(null);
  const [colors, setcolors] = React.useState([])
  const [following, setfollowing] = React.useState(false);
  const [isloading, setisloading] = React.useState(true);
  const params = useParams();


  // fectch show
  const fetchShow = async () => {
    const { data } = await getShowMetadata(params.id)
    const getcolors = await prominent(data.images[0].url, { amount: 5, format: 'hex' })
    setcolors(getcolors)
    setmetadata(data)
  };

  // follow / unfollow show
  const handleFollow = () => {
    if (following) {
      const unfollow = async () => {
        await UnfollowShows(params.id)
        fetchShow()
        showIsSaved()
      };
      catchErrors(unfollow());
    } else {
      const subscribe = async () => {
        await subscribeToShows(params.id)
        fetchShow()
        showIsSaved()
      };
      catchErrors(subscribe());
    }
  }

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

  // check if a show is saved
  const showIsSaved = async () => {
    const { data } = await checkUserSavedShows(params.id)
    setfollowing(data[0])
  };

  React.useEffect(() => {
    setTimeout(() => {
      setisloading(false)
      onToggle()
    }, 1000);
  }, []);


  React.useEffect(() => {
    fetchShow()
    showIsSaved()
    catchErrors(fetchShow());
  }, []);

  return (
    <Box>
      {!isloading ? (
        <>
          <ScaleFade initialScale={0.3} in={isOpen}>
            <Box bgGradient={`linear(transparent 0, ${colors[3]} 100%)`} paddingTop={[5, 10, 20]} paddingBottom={[5, 10]}>
              <Flex alignItems={['flex-start', 'inherit', 'flex-end']} direction={['column', 'column', 'row']} width="100%" paddingX={3} maxW="1200px" margin="0 auto">
                <Image width={['100px', '150px', '200px']} marginRight={10} boxShadow='lg' rounded="md" src={metadata?.images[0].url} />
                <Box marginTop={[3, 5, 0]}>
                  <Heading fontWeight={700} fontSize={[20, 32, 54, 62]} color='#fff'>{metadata?.name}</Heading>
                  <Text fontWeight={500} fontSize={[14, 16, 18]} color='#fff'>{metadata?.publisher}</Text>
                  <Button onClick={() => handleFollow()} marginTop={2} variant='outline'>{following ? 'FOLLOWING' : 'FOLLOW'}</Button>
                </Box>
              </Flex>
            </Box>
          </ScaleFade>
          <Stack marginTop={[0, 10, 20]} gap={[10, 14]} width="100%" paddingX={4} maxW="1200px" margin="0 auto">
            <SlideFade offsetY='20px' in={isOpen}>
              <Box marginTop={5}>
                <Text fontWeight={600} fontSize={[24, 24, 32]} marginBottom={3}>About</Text>
                <Text color="#aaa" fontSize={[14, 16]} dangerouslySetInnerHTML={{ __html: metadata?.html_description }} />
              </Box>
            </SlideFade>

            <Box marginTop={[8, 0]}>
              <Text fontWeight={600} marginBottom={5} fontSize={[24, 24, 32]}>Episodes</Text>
              <Stack>
                <SlideFade offsetY='-100px' in={isOpen}>
                  {metadata?.episodes?.items.map(episode => (
                    <Stack borderLeft={currentEpisode?.id === episode.id && '5px solid'} borderLeftColor={currentEpisode?.id === episode.id && 'brand.spotify-green'} transition={['all .25s cubic-bezier(.645,.045,.355,1) 0s']} key={episode.id} gap={3} direction={['column', 'column', 'row']} borderTop="1px solid #333" paddingY={[4]} paddingX={[2,2,4]} _hover={{ bg: ['transparent', 'transparent', '#333'], rounded: 'md', transform: ['scale(1)', 'scale(1)', 'scale(1.02)'] }}>
                      <Image cursor='pointer' onClick={() => navigate(`/episode/${episode.id}`)} width={['100px']} height={['100px']} boxShadow='lg' rounded="md" src={episode?.images[0].url} />
                      <Box>
                        <Link as={ReachLink} to={`/episode/${episode.id}`} fontWeight={500}>{episode.name}</Link>
                        <Text marginY={2} fontSize={14} color="#888">{episode.description.length > 200 ? episode.description.slice(0, 200) + '...' : episode.description}</Text>
                        <Stack direction={['column', 'row']} spacing={2} alignItems={['flex-start', 'center']}>
                          <Flex alignItems='center'>
                            <Icon cursor='pointer' color='brand.spotify-green' onClick={() => currentEpisode?.id === episode.id ? pauseEpisode() : playEpisode(episode)} w={8} height={8} as={currentEpisode?.id === episode.id ? MdBarChart : MdPlayArrow} />
                            <Box>
                              <Progress width='150px' rounded='md' height="6px" bg='#444' colorScheme='green' size='sm' value={(episode.resume_point.resume_position_ms / episode.duration_ms) * 100} />
                            </Box>
                          </Flex>
                          <Text color="#888" fontSize={14}>{episodeDate(episode.release_date)} | {formatDurationForHumans(episode.duration_ms - episode.resume_point.resume_position_ms)} left</Text>
                        </Stack>
                      </Box>
                    </Stack>
                  ))}
                </SlideFade>
              </Stack>
            </Box>
          </Stack>
        </>
      ) : (
        <Grid placeItems='center' height='90vh'>
          <Loading /></Grid>
      )}
    </Box>
  );
}

export default Show;