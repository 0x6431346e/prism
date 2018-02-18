import SpotifyWebApi from 'spotify-web-api-js'

const spotifyApi = new SpotifyWebApi()
const token = localStorage.getItem('token')
if (token) spotifyApi.setAccessToken(token)

export default spotifyApi
