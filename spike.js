const fs = require('fs')
const https = require('https')
const open = require('open')
const express = require('express')
const Flickr = require('flickr-sdk')
const secrets = require('./secrets')

const app = express()
const port = 3000
const oauth = new Flickr.OAuth(
  secrets.key,
  secrets.secret,
)
const oauthCallback = `https://localhost:${port}/`
const sslOptions = {
  key: fs.readFileSync('localhost.key'),
  cert: fs.readFileSync('localhost.crt'),
}
const server = https.createServer(sslOptions, app)
const requestTokens = {}
let serverListening = false

app.get('/', ({query}, res, next) => {
  console.log(query)
  oauth.verify(query.oauth_token, query.oauth_verifier, requestTokens[query.oauth_token])
    .then(({body}) => {
      console.log(body)
      const flickr = new Flickr(oauth.plugin(
        body.oauth_token,
        body.oauth_token_secret,
      ))
      main(flickr)
      res.end('Authorised, you can close this page now')
      cleanup()
    })
    .catch((err) => {
      console.error(err.message)
      next(err)
      cleanup()
    })
  delete requestTokens[query.oauth_token]
})

if (secrets.oauth_token) {
  const flickr = new Flickr(Flickr.OAuth.createPlugin(
    secrets.key,
    secrets.secret,
    secrets.oauth_token,
    secrets.oauth_token_secret,
  ))
  main(flickr)
} else {
  server.listen(port, () => {
    serverListening = true
    oauth.request(oauthCallback)
      .then(({body}) => {
        console.log(body)
        requestTokens[body.oauth_token] = body.oauth_token_secret
        const url = oauth.authorizeUrl(body.oauth_token)
        return open(url)
      })
      .then(() => {
        console.log('requested login')
      })
      .catch((err) => {
        console.error(err.message)
        cleanup()
      })
  })
}

function cleanup() {
  if (serverListening) {
    server.close()
  }
}

function main(flickr) {
  if (secrets.user_id) {
    flickr.people.getPhotos({
      user_id: secrets.user_id,
      per_page: 500,
      extras: 'description,tags,machine_tags,url_t,url_o,views,date_taken,date_upload,geo,last_update',
    })
      .then(({body}) => {
        print(body);
        print(body.photos.page);
        print(body.photos.pages);
        print(body.photos.total);
      })
      .catch((err) => {
        console.error(err);
      })
  } else {
    flickr.contacts.getList()
      .then(({body}) => {
        print(body);
      })
      .catch((err) => {
        console.error(err);
      })
  }
}

function print(obj) {
  console.log(JSON.stringify(obj, null, 2))
}
