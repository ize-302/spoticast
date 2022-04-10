import React from "react";
import { token, play, pause, devices, transferPlayback, getPlaybackState, setPlaybackVolumne } from '../spotify'

export const PlayerContext = React.createContext(
  {}
);

export const PlayerProvider = ({ children }) => {
  const [playing, setplaying] = React.useState(false);
  const [currentEpisode, setcurrentEpisode] = React.useState(null);
  const [playbackstate, setplaybackstate] = React.useState(null);
  const [volumePercent, setvolumePercent] = React.useState(null);

  const updatePlayer = (episode) => {
    setcurrentEpisode(episode)
  };

  // const timerRef = React.useRef(null);
  let player = React.useRef(null);

  const loadScript = () => {
    const script = document.createElement("script");

    script.id = "spotify-player";
    script.type = "text/javascript";
    script.async = "async";
    script.defer = "defer";
    script.src = "https://sdk.scdn.co/spotify-player.js";

    document.body.appendChild(script);
  };


  React.useEffect(() => {
    loadScript();

    window.onSpotifyWebPlaybackSDKReady = () => playerInit();

    return () => {
      // clearTimeout(timerRef.current);
      player.disconnect();
    };
  }, []);

  React.useEffect(() => {
    setPlaybackVolumne(volumePercent)
  }, [volumePercent]);

  const playEpisode = async (episode) => {
    let devices = await transferDevices()
    setvolumePercent(devices[0]['volume_percent'])
    setPlaybackVolumne(devices[0]['volume_percent'])
    await play({ episode, position_ms: playbackState.progress_ms })
    setcurrentEpisode(episode)
    setplaying(true)
  }

  const pauseEpisode = async () => {
    await pause()
    setplaying(false)
    await playbackState()
  }

  const playbackState = async () => {
    const response = await getPlaybackState()
    setplaybackstate(response.data)
  }

  const transferDevices = async () => {
    const response = await devices()
    let device_ids = response.data.devices.filter(device => {
      return device.name === 'spoticast'
    })
    const selected_device_id = [device_ids[0]['id']]
    await transferPlayback(selected_device_id)
    console.log(device_ids[0])
    return device_ids
  }


  const playerInit = () => {
    console.log("player init");
    player = new window.Spotify.Player({
      name: "spoticast",
      getOAuthToken: (cb) => {
        cb(token);
      },
    });

    // Error handling
    player.addListener("initialization_error", ({ message }) => {
      // setMessage(message);
    });
    player.addListener("authentication_error", ({ message }) => {
      // setMessage(message);
    });
    player.addListener("account_error", ({ message }) => {
      // setMessage(message);
    });
    player.addListener("playback_error", ({ message }) => {
      // setMessage(message);
    });

    // Playback status updates
    player.addListener("player_state_changed", (state) => {
      try {
        // const {
        //   duration,
        //   position,
        //   paused,
        // } = state;
      } catch (error) {
        console.log(error);
      }
    });

    // Connect to the player!
    player.connect();
  };

  return (
    <PlayerContext.Provider
      value={{
        playEpisode,
        pauseEpisode,
        updatePlayer,
        playing,
        currentEpisode,
        setcurrentEpisode,
        volumePercent,
        setvolumePercent
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => React.useContext(PlayerContext);
