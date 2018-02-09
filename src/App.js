import React from 'react';
// import logo from './logo.svg';
import './App.css';
import queryString from 'query-string';
import SpotifyWebApi from 'spotify-web-api-js';
import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList';
// import { loadState, saveState } from './localStorage';

class App extends React.Component {
  constructor() {
    super();

    let loggedIn = false;
    // old token
    const oldToken = localStorage.getItem('token');
    if (oldToken) {
      // inst spotifyApi
      this.spotifyApi = new SpotifyWebApi();
      this.spotifyApi.setAccessToken(oldToken);
      // save the loggedIn state
      loggedIn = true;
    }
    // new login
    if (window.location.hash) {
      const accessToken = queryString.parse(window.location.hash).access_token;
      // reset hash
      window.location.hash = '';
      // save token to ls
      localStorage.setItem('token', accessToken);
      // inst spotifyApi
      this.spotifyApi = new SpotifyWebApi();
      this.spotifyApi.setAccessToken(accessToken);
      // save the loggedIn state
      loggedIn = true;
      // go get the data
    }
    
    if(loggedIn) {
      this.fetchAllSavedTracksAndFeatures();
    }

    this.state = {
      loggedIn,
      sources: {
        list: undefined,
        fetched: false
      }
    };
  }

  fetchAllSavedTracksAndFeatures() {
    this.spotifyApi.getMySavedTracks({ limit: 50 })
      .then((data) => {
        console.log('getMySavedTracks', data);
        return data.items.map((item) => item.track.id);
      })
      .then((trackIds) => {
        console.log('trackIds', trackIds);
        return this.spotifyApi.getAudioFeaturesForTracks(trackIds);
      })
      .then((trackFeatures) => {
        console.log('trackFeatures', trackFeatures);
      })
      .catch((err) => {
        const res = JSON.parse(err.response);
        console.error(res.error);
        if (res.error.status === 401) {
          localStorage.removeItem('token');
        }
      });
  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  componentDidUpdate(/*prevProps, prevState*/) {
    console.log('componentDidUpdate');
  }

  render() {
    console.log('state', this.state);
    const { loggedIn, sources } = this.state;

    return (
      <div className="App">
        {
          !loggedIn &&
          <button onClick={this.handleLogin}>Login</button>
        }
        {
          sources.fetched &&
          <GridList cellHeight={160} cols={2}>
            {
              sources.list.map(item => (
                <GridListTile key={item.id} cols={1}>
                  <img src={item.images[0].url} alt={item.name} />
                </GridListTile>
              ))
            }
          </GridList>
        }
      </div>
    );
  }

  handleLogin() {
    const client_id = '28ffe0bc2e5b46c3a559f351f8c90006';
    const redirect_uri = 'http://localhost:3000';
    const scope = 'user-library-read playlist-read-private';

    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);

    window.location = url;
  }

}

export default App;

      // this.spotifyApi.getPlaylistTracks('theruffled', '6FFr9lesNWMwKMTooTfodw')
      //   .then(function (data) {
      //     console.log('getMySavedTracks', data);
      //   }, function (err) {
      //     console.error(err);
      //   });