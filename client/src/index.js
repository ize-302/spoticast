import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './styles/globals.css'
import "@fontsource/inter"
import { PlayerProvider } from './contexts/PlayerContext';

import { extendTheme, ChakraProvider } from '@chakra-ui/react'

const colors = {
  brand: {
    'spotify-green': '#1DB954',
    'spotify-black': '#191414',
  },
}

const fonts = {
  heading: 'Inter, sans-serif',
  body: 'Inter, sans-serif',
}

const theme = extendTheme({ colors, fonts })

const greeting = 'HGllo';

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <PlayerProvider>
        <App />
      </PlayerProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
