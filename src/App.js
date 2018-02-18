import './App.css'
import React from 'react'
import actions from './actions'

class App extends React.Component {
  constructor() {
    super()

    const loggedIn = actions.auth.getLogin()

    this.state = {
      loggedIn,
      trackFeatures: null
    }
  }

  componentDidMount() {
    if (this.state.loggedIn) {
      actions.collections.getSavedTracks()
        // .then(tracks => {
        //   console.log(tracks)
        //   return tracks
        // })
        .then(tracks => tracks.map(track => track.id))
        .then(trackIds => actions.collections.getTrackFeatures(trackIds))
        .then(trackFeatures => this.setState({ trackFeatures }))
        .catch(console.error)
    }
  }

  render() {
    console.log('state', this.state);
    const { loggedIn } = this.state;

    return (
      <div className="App">
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
