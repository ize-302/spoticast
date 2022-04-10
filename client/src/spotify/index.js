import axios from 'axios';
import { getHashParams } from '../utils';

const REFRESH_URI =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:8888/api/v1/refresh_token'
    : 'https://spoticast.herokuapp.com/api/v1/refresh_token';

// TOKENS ******************************************************************************************
const EXPIRATION_TIME = 3600 * 1000; // 3600 seconds * 1000 = 1 hour in milliseconds

const setTokenTimestamp = () => window.localStorage.setItem('spotify_token_timestamp', Date.now());
const setLocalAccessToken = token => {
  setTokenTimestamp();
  window.localStorage.setItem('spotify_access_token', token);
};
const setLocalRefreshToken = token => window.localStorage.setItem('spotify_refresh_token', token);
const getTokenTimestamp = () => window.localStorage.getItem('spotify_token_timestamp');
const getLocalAccessToken = () => window.localStorage.getItem('spotify_access_token');
const getLocalRefreshToken = () => window.localStorage.getItem('spotify_refresh_token');

// Refresh the token
const refreshAccessToken = async () => {
  try {
    const { data } = await axios.get(`${REFRESH_URI}?refresh_token=${getLocalRefreshToken()}`);
    const { access_token } = data;
    setLocalAccessToken(access_token);
    window.location.reload();
    return;
  } catch (e) {
    console.error(e);
  }
};

// Get access token off of query params (called on application init)
export const getAccessToken = () => {
  const { error, access_token, refresh_token } = getHashParams();

  if (error) {
    console.error(error);
    refreshAccessToken();
  }

  // If token has expired
  if (Date.now() - getTokenTimestamp() > EXPIRATION_TIME) {
    console.warn('Access token has expired, refreshing...');
    refreshAccessToken();
  }

  const localAccessToken = getLocalAccessToken();

  // If there is no ACCESS token in local storage, set it and return `access_token` from params
  if ((!localAccessToken || localAccessToken === 'undefined') && access_token) {
    setLocalAccessToken(access_token);
    setLocalRefreshToken(refresh_token);
    return access_token;
  }

  return localAccessToken;
};

export const token = getAccessToken();

export const logout = () => {
  window.localStorage.removeItem('spotify_token_timestamp');
  window.localStorage.removeItem('spotify_access_token');
  window.localStorage.removeItem('spotify_refresh_token');
  window.location.reload();
};

// API CALLS ***************************************************************************************

const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
  Accept: 'application/json'
};


/**
 * Get User's saved shows
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-saved-shows
 */
export const getSavedShows = (offset) => axios.get(`https://api.spotify.com/v1/me/shows?offset=${offset}`, { headers });


/**
 * Get metadata for a single show
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-a-show
 */
export const getShowMetadata = (id) => axios.get(`https://api.spotify.com/v1/shows/${id}`, { headers });

/**
 * List episodes for a show
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-a-shows-episodes
 */
export const getShowEpisodes = (id) => axios.get(`https://api.spotify.com/v1/shows/${id}/episodes`, { headers });

/**
 * Get information about an episode
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-episode
 */
export const getEpisode = (id) => axios.get(`https://api.spotify.com/v1/episodes/${id}`, { headers });

/**
 * Check if show is in user's library
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/check-users-saved-shows
 */
export const checkUserSavedShows = (ids) => axios.get(`https://api.spotify.com/v1/me/shows/contains?ids=${ids}`, { headers });

/**
 * Subscribe to a list of shows
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/save-shows-user
 */
export const subscribeToShows = (ids) => axios.put(`https://api.spotify.com/v1/me/shows?ids=${ids}`, {}, { headers });


/**
* unfollow list of shows
* https://developer.spotify.com/documentation/web-api/reference/#/operations/remove-shows-user
*/
export const UnfollowShows = (ids) => axios.delete(`https://api.spotify.com/v1/me/shows?ids=${ids}`, { headers });

/**
* search for shows/episodes
* https://developer.spotify.com/documentation/web-api/reference/#/operations/remove-shows-user
*/
export const search = (q, offset) => axios.get(`https://api.spotify.com/v1/search?q=${q}&type=show&offset=${offset}`, { headers });


/**
* Start/Resume Playback
* https://developer.spotify.com/documentation/web-api/reference/#/operations/start-a-users-playback
*/
export const play = ({ episode, position_ms }) => axios.put(`https://api.spotify.com/v1/me/player/play`, {
  uris: [episode.uri],
  position_ms
}, { headers });

/**
* pause playback
* https://developer.spotify.com/documentation/web-api/reference/#/operations/pause-a-users-playback
*/
export const pause = () => axios.put(`https://api.spotify.com/v1/me/player/pause`, {}, { headers });


/**
* available devices
* https://developer.spotify.com/documentation/web-api/reference/#/operations/get-a-users-available-devices
*/
export const devices = () => axios.get(`https://api.spotify.com/v1/me/player/devices`, { headers });


/**
* transfer devices
* https://developer.spotify.com/documentation/web-api/reference/#/operations/transfer-a-users-playback
*/
export const transferPlayback = (device_ids) => axios.put(`https://api.spotify.com/v1/me/player`, { device_ids: device_ids }, { headers });

/**
* Get Playback State
* https://developer.spotify.com/documentation/web-api/reference/#/operations/get-information-about-the-users-current-playback
*/
export const getPlaybackState = () => axios.get(`https://api.spotify.com/v1/me/player`, { headers });

/**
* Set Playback Volumne
* https://developer.spotify.com/documentation/web-api/reference/#/operations/get-information-about-the-users-current-playback
*/
export const setPlaybackVolumne = (volume_percent) => axios.put(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume_percent}`, {}, { headers });

/**
 * Get Current User's Profile
 * https://developer.spotify.com/documentation/web-api/reference/users-profile/get-current-users-profile/
 */
export const getUser = () => axios.get('https://api.spotify.com/v1/me', { headers });