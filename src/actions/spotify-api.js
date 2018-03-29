import SpotifyWebApi from 'spotify-web-api-js'

const spotifyApi = new SpotifyWebApi()
const token = localStorage.getItem('token')
if (token) {
  console.log('initializing spotify with token')
  spotifyApi.setAccessToken(token)
} else {
  console.log('initializing spotify without token')
}

export default spotifyApi
