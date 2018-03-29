import './App.css'
import React from 'react'
import actions from './actions'

class App extends React.Component {
  playlists = {
    '0': {
      name: 'Blue',
      color: 'hsl(225, 100, 50)',
      trackUris: []
    },
    '1': {
      name: 'Cyan',
      color: 'hsl(180, 100, 50)',
      trackUris: []
    },
    '2': {
      name: 'Green',
      color: 'hsl(135, 100, 50)',
      trackUris: []
    },
    '3': {
      name: 'Violet',
      color: 'hsl(270, 100, 50)',
      trackUris: []
    },
    '4': {
      name: 'White',
      color: 'hsl(0, 0, 100)',
      trackUris: []
    },
    '5': {
      name: 'Yellow',
      color: 'hsl(90, 100, 50)',
      trackUris: []
    },
    '6': {
      name: 'Pink',
      color: 'hsl(315, 100, 50)',
      trackUris: []
    },
    '7': {
      name: 'Red',
      color: 'hsl(0, 100, 50)',
      trackUris: []
    },
    '8': {
      name: 'Amber',
      color: 'hsl(45, 100, 50)',
      trackUris: []
    }
  }

  constructor() {
    super()

    const loggedIn = actions.auth.getLogin()

    this.state = {
      loggedIn,
      trackFeatures: null
    }
  }

  componentDidMount() {
    // this.playlists.map(playlist => playlist.name)

    // return actions.collections.createPlaylist()
    //   .then(console.log)

    if (this.state.loggedIn) {
      actions.collections.getSavedTracks()
        .then(tracks => tracks.map(track => track.id))
        .then(trackIds => actions.collections.getTrackFeatures(trackIds))
        .then(trackFeatures => {
          trackFeatures.forEach(trackFeature => {
            // 0.33 * 3 = 0.99
            // 0.34 * 3 = 1.02
            // 0.67 * 3 = 2.01
            const column = parseInt(trackFeature.valence * 3)
            const row = parseInt(trackFeature.energy * 3)
            // 3 * 0 + 0 = 0 (blue)
            // 3 * 0 + 1 = 1 (cyan)
            // 3 * 0 + 2 = 2 (green)
            // 3 * 1 + 0 = 3 (violet)
            const playlistNo = 3 * row + column

            this.playlists[playlistNo].trackUris.push(trackFeature.uri)
          })

          console.log('playlists ready', this.playlists)

          const promises = []
          for (let i = 0; i < 9; i++) {
            const { name, trackUris } = this.playlists[i]

            promises.push(actions.collections.createPlaylistWithTracks(name, trackUris))
          }

          return Promise.all(promises)
        })
        .then(console.log)
        .catch(console.error)
    }
  }

  render() {
    console.log('state', this.state);
    const { loggedIn } = this.state;

    return (
      <div>
        {
          !loggedIn &&
          <button onClick={actions.auth.login}>Login</button>
        }
      </div>
    );
  }
}

export default App;

// <GridList cellHeight={160} cols={2}>
//   {
//     trackFeatures.map(item => (
//       <GridListTile key={item.id} cols={1}>
//         <img src={item.images[0].url} alt={item.name} />
//       </GridListTile>
//     ))
//   }
// </GridList>
