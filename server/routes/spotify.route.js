const { Router } = require("express");

const login = require("../controllers/spotify/login.controller");
const callback = require("../controllers/spotify/callback.controller");
const refreshToken = require("../controllers/spotify/refreshToken.controller");

const spotifyRoute = Router();

spotifyRoute.get("/login", login);
spotifyRoute.get("/callback", callback);
spotifyRoute.get("/refresh_token", refreshToken);

module.exports = spotifyRoute;