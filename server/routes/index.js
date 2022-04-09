const { Router } = require("express");
const mainRouter = Router();
const spotifyRoute = require("./spotify.route");

mainRouter.use("/", spotifyRoute);

mainRouter.get(
  "/",
  (
    _req, res
  ) => {
    res.send({
      message:
        "The Incredible True Story & Transformation of the man who saved the world",
    });
  }
);

module.exports = mainRouter;