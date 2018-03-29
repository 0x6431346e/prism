import spotifyApi from './spotify-api'

/**
 *
 * ```
 * Track {
 *  id: string
 *  name: string
 * }
 * ```
 *
 * @returns Promise<Track[]>
 */
function getSavedTracks() {
  // get the total number of tracks
  return spotifyApi.getPlaylistTracks('theruffled', '6FFr9lesNWMwKMTooTfodw', { limit: 1 })
    .then(result => {
      const pages = result.total / 50

      const promises = []
      for (let i = 0; i < pages; i++) {
        const promise = spotifyApi.getPlaylistTracks('theruffled', '6FFr9lesNWMwKMTooTfodw', { offset: 50 * i, limit: 50 })
        promises.push(promise)
      }

      return Promise.all(promises)
        .then(result => {
          const tracks = []
          result.forEach(page => {
            tracks.push(...page.items.map(x => x.track))
          })

          return tracks
        })
    })
}

/**
 *
 * ```
 * TrackFeatures {
 *  id: string
 *  uri: string
 *  energy: integer (0...1)
 *  valence: integer (0...1)
 * }
 * ```
 *
 * @param string[] trackIds
 * @returns Promise<TrackFeatures[]>
 */
function getTrackFeatures(trackIds) {
  const pages = trackIds.length / 50

  const promises = []
  for (let i = 0; i < pages; i++) {
    const pageStart = i * 50
    const pageEnd = pageStart + 50

    const promise = spotifyApi.getAudioFeaturesForTracks(trackIds.slice(pageStart, pageEnd))
    promises.push(promise)
  }

  return Promise.all(promises)
    .then(result => {
      const tracks = []
      result.forEach(page => {
        tracks.push(...page.audio_features)
      })

      return tracks
    })
}

/**
 *
 * ```
 * Playlist {
 *  id: string
 *  name: string
 * }
 * ```
 *
 * @param string name
 * @param string trackUris
 * @returns Promise<Playlist>
 */
function createPlaylistWithTracks(name, trackUris) {
  if (trackUris.length === 0) {
    console.log(`${name} has no tracks`)
    return Promise.resolve()
  }

  const options = {
    name,
    public: false
  }

  return spotifyApi.createPlaylist('theruffled', options)
    .then(playlist => {
      // pagination of 100
      const pages = trackUris.length / 100

      const promises = []
      for (let i = 0; i < pages; i++) {
        const pageStart = i * 100
        const pageEnd = pageStart + 100

        const slice = trackUris.slice(pageStart, pageEnd)
        const promise = spotifyApi.addTracksToPlaylist('theruffled', playlist.id, slice)

        promises.push(promise)
      }

      return Promise.all(promises)
    })
}

//   .catch((err) => {
//     const result = JSON.parse(err.response);
//     console.error(result.error);
//     if (result.error.status === 401) {
//       localStorage.removeItem('token');
//     }
//   });

export default {
  getSavedTracks,
  getTrackFeatures,
  createPlaylistWithTracks
}
