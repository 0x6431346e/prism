import queryString from 'query-string';

/**
 * Check whether the user is autheticated
 */
function getLogin() {
  const oldToken = localStorage.getItem('token')

  if (oldToken) {
    console.log('old token found')
    return true
  }

  if (window.location.hash) {
    console.log('new login')
    const query = queryString.parse(window.location.hash)
    const newToken = query.access_token

    console.log('saving token')
    localStorage.setItem('token', newToken)

    console.log('resetting hash')
    window.location.hash = ''
    return true
  }

  return false
}

/**
 * Redirect to Spotify for authentication
 */
function login() {
  const client_id = '28ffe0bc2e5b46c3a559f351f8c90006'
  const redirect_uri = 'http://localhost:3000'
  const scope = 'user-library-read playlist-read-private playlist-modify-private'

  let url = 'https://accounts.spotify.com/authorize'
  url += '?response_type=token'
  url += '&client_id=' + encodeURIComponent(client_id)
  url += '&scope=' + encodeURIComponent(scope)
  url += '&redirect_uri=' + encodeURIComponent(redirect_uri)

  window.location = url
}

export default {
  getLogin,
  login,
}
