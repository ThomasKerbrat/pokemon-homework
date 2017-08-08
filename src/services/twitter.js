import config from '../config.js'
const { twitterBaseUrl } = config
let bearerToken

function _auth(uri) {
  return twitterBaseUrl + uri
}

function _url(uri) {
  return twitterBaseUrl + '/1.1' + uri
}

export function authenticate(key, secret) {
  return new Promise(function (resolve, reject) {
    const encodedKey = encodeURI(key)
    const encodedSecret = encodeURI(secret)
    const token = btoa(encodedKey + ':' + encodedSecret)

    fetch(_auth('/oauth2/token'), {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + token,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: 'grant_type=client_credentials',
    })
      .then(response => response.json())
      .then(json => {
        if ('token_type' in json && json.token_type === 'bearer') {
          bearerToken = json.access_token
          resolve()
        } else {
          reject(new Error('Unexpected Twitter API response:', json))
        }
      })
      .catch(reject)
  })
}

export function getTweets(pokemon) {
  const query = encodeURI(`"${pokemon}"`)
  return fetch(_url('/search/tweets.json?q=' + query), {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + bearerToken,
    },
  })
}
