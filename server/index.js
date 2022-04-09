// SPOTIFY WEB API AUTHORIZATION CODE FLOW
// https://developer.spotify.com/documentation/general/guides/authorization-guide/
// https://github.com/spotify/web-api-auth-examples

require('dotenv').config();
let REDIRECT_URI = process.env.REDIRECT_URI
let FRONTEND_URI = process.env.FRONTEND_URI
const PORT = process.env.PORT || 8888;
const API_VERSION = process.env.API_VERSION

if (process.env.NODE_ENV !== 'production') {
  REDIRECT_URI = 'http://localhost:8888/callback';
  FRONTEND_URI = 'http://localhost:3000';
}

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const history = require('connect-history-api-fallback');

const api = require("./routes/index");

// Multi-process to utilize all CPU cores.
if (cluster.isMaster) {
  console.warn(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`,
    );
  });
} else {
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../client/build')));

  app
    .use(express.static(path.resolve(__dirname, '../client/build')))
    .use(cors())
    .use(cookieParser())
    .use(
      history({
        verbose: false,
        rewrites: [
          { from: /\/login/, to: `${API_VERSION}/login` },
          { from: /\/callback/, to: `${API_VERSION}/callback` },
          { from: /\/refresh_token/, to: `${API_VERSION}/refresh_token` },
        ],
      }),
    )
    .use(express.static(path.resolve(__dirname, '../client/build')));

  app.get('/', function (req, res) {
    res.render(path.resolve(__dirname, '../client/build/index.html'));
  });

  // api route
  app.use(API_VERSION, api);

  // All remaining requests return the React app, so it can handle routing.
  app.all('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../client/public', 'index.html'));
  });

  app.listen(PORT, function () {
    console.warn(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
  });
}