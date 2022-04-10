import React from 'react';
import { Box, Stack, Image, Icon, SliderTrack, SliderThumb, SliderFilledTrack, Slider, Text, Grid, Progress } from '@chakra-ui/react';
import { MdPlayArrow, MdPause, MdVolumeOff } from "react-icons/md";
import { usePlayer } from '../contexts/PlayerContext';
import { formatDurationForHumans } from '../utils';

const NowPlaying = () => {
  const { playEpisode,
    pauseEpisode,
    setvolumePercent,
    volumePercent,
    playing,
    currentEpisode,
  } = usePlayer();

  return (
    <>
      {currentEpisode && (
        <Stack justifyContent='center' direction='row' position='fixed' bottom={0} right={0} width='100%' padding={[0, 2, 2, 4]} gap={1}>
          <Stack direction='row' alignItems='center' gap={2} bg="#333" padding={5} rounded={["none", "lg"]}>
            <Stack justifyContent='center' alignItems="center" position='relative' width='70px' height='70px' >
              <Image rounded='md' src={currentEpisode?.images[0].url} />
              {volumePercent === 0 && (
                <Grid position='absolute' placeItems='center' bg='brand.spotify-green' rounded='full' padding={2}>
                  <Icon color="brand.spotify-black" w={8} height={8} as={MdVolumeOff} />
                </Grid>
              )}
            </Stack>
            <Box>
              <Text fontSize={[14,14,16]}>{currentEpisode?.description.length > 50 ? currentEpisode?.description.slice(0, 50) + '...' : currentEpisode?.name}</Text>
              <Text color='#999' fontSize={12}>{currentEpisode?.name.length > 50 ? currentEpisode?.name.slice(0, 50) + '...' : currentEpisode?.name}</Text>
              <Stack direction={['column', 'row']} spacing={2} alignItems={['flex-start', 'center']} marginTop={2}>
                <Progress width='150px' rounded='md' height="6px" bg='#444' colorScheme='green' size='sm' value={(currentEpisode.resume_point.resume_position_ms / currentEpisode.duration_ms) * 100} />
                <Text color="#888" fontSize={14}>{formatDurationForHumans(currentEpisode.duration_ms - currentEpisode.resume_point.resume_position_ms)} left</Text>
              </Stack>
            </Box>
            <Grid placeItems='center' bg='brand.spotify-green' rounded='full' padding={2} cursor='pointer'>
              {!playing ? (<Icon color="#000" onClick={() => playEpisode(currentEpisode)} w={8} height={8} as={MdPlayArrow} />) : (<Icon color="#000" onClick={() => pauseEpisode()} w={8} height={8} as={MdPause} />)}
            </Grid>
          </Stack>
          <Box display={['none', 'none', 'block']} rounded="lg" paddingX={2} paddingY={3} bg="#333">
            <Slider
              aria-label='slider-ex-3'
              defaultValue={volumePercent}
              orientation='vertical'
              onChange={(value) => setvolumePercent(value)}
            >
              <SliderTrack bg='gray.900'>
                <SliderFilledTrack bg='brand.spotify-green' />
              </SliderTrack>
              <SliderThumb width={3} height={3} />
            </Slider>
          </Box>
        </Stack>
      )}
    </>
  );
}

export default NowPlaying;