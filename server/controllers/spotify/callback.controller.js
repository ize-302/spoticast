const stateKey = require('../../utils/index');
let REDIRECT_URI = process.env.REDIRECT_URI
let FRONTEND_URI = process.env.FRONTEND_URI
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const request = require('request');

async function callback(
  req, res
) {
  try {
    // your application requests refresh and access tokens
    // after checking the state parameter
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
      res.redirect(`/#${new URLSearchParams({ error: 'state_mismatch' })}`);
    } else {
      res.clearCookie(stateKey);
      const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code',
        },
        headers: {
          Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
            'base64',
          )}`,
        },
        json: true,
      };

      request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          const access_token = body.access_token;
          const refresh_token = body.refresh_token;

          // we can also pass the token to the browser to make requests from there
          res.redirect(
            `${FRONTEND_URI}/#${new URLSearchParams({
              access_token,
              refresh_token,
            })}`,
          );
        } else {
          res.redirect(`/#${new URLSearchParams({ error: 'invalid_token' })}`);
        }
      });
    }

  } catch (error) {
    console.log(error)
  }
}

module.exports = callback;