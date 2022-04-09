import React from 'react';
import { token } from './spotify';
import { Router } from "@reach/router"
import { Box } from '@chakra-ui/react';
// components
import NavBar from './components/NavBar';
import NowPlaying from './components/NowPlaying';
// pages
import LoginScreen from './pages/LoginScreen';
import Home from './pages/Home'
import Show from './pages/Show'
import Episode from './pages/Episode';
import SearchResult from "./pages/SearchResult";

const App = () => {
  const [accessToken, setAccessToken] = React.useState('');

  React.useEffect(() => {
    setAccessToken(token);
    // remove #accesstoken=... from url
    if (window.history) {
      window.history.pushState('', document.title, window.location.href.replace(window.location.hash, ''));
    } else {
      window.location.hash = '';
    }
  }, []);
  return (
    <>
      {accessToken ? (
        <Box>
          <NavBar />
          <Router primary={false}>
            <Home path="/" />
            <Show path="/show/:id" />
            <Episode path="/episode/:id" />
            <SearchResult path="/search" />
          </Router>
          <NowPlaying />
        </Box>
      ) : <LoginScreen />}
    </>
  );
}

export default App;
