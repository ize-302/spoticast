import React from 'react';
import { Link, Grid, Icon, Text, Heading, Stack } from '@chakra-ui/react'
import { FaSpotify } from "react-icons/fa";

const LOGIN_URI =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:8888/api/v1/login'
    : 'https://spoticast.herokuapp.com/api/v1/login';

const LoginScreen = () => (
  <>
    <Grid placeItems='center' height="80vh">
      <Icon color="brand.spotify-green" fontSize='150px' as={FaSpotify} />
      <Stack alignItems='center' gap={5}>
        <Heading fontSize={58}>Spotify + Podcast = Spoticast!</Heading>
        <Text>Pick up your podcast right where you left off.</Text>
        <Link href={LOGIN_URI} bg="brand.spotify-green" textAlign='center' color="black" rounded='50px' padding="10px 40px" fontWeight={700}>CONTINUE LISTENING</Link>
      </Stack>
    </Grid>
  </>
);

export default LoginScreen;