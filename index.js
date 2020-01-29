const fs = require('fs')
const https = require('https')
const express = require('express')
const Flickr = require('flickr-sdk')
const secrets = require('./secrets')

const app = express()
const port = 3000
const oauth = new Flickr.OAuth(
  secrets.key,
  secrets.secret,
)
const oauthCallback = `https://localhost:${port}/auth/callback`
const sslOptions = {
  key: fs.readFileSync('localhost.key'),
  cert: fs.readFileSync('localhost.crt'),
}
const server = https.createServer(sslOptions, app)
const requestTokens = {}

app.get('/', (req, res, next) => {
  oauth.request(oauthCallback)
    .then(({body}) => {
      console.log(body)
      requestTokens[body.oauth_token] = body.oauth_token_secret
      const url = oauth.authorizeUrl(body.oauth_token)
      res.redirect(url)
    })
    .catch((err) => {
      console.error(err.message)
      next(err)
    })
})

app.get('/auth/callback', ({query}, res, next) => {
  console.log(query)
  oauth.verify(query.oauth_token, query.oauth_verifier, requestTokens[query.oauth_token])
    .then(({body}) => {
      console.log(body)
      const flickr = new Flickr(oauth.plugin(
        body.oauth_token,
        body.oauth_token_secret,
      ))
      return flickr.test.login()
    })
    .then(({body}) => {
      console.log(body)
      res.json(body)
    })
    .catch((err) => {
      console.error(err.message)
      next(err)
    })
  delete requestTokens[query.oauth_token]
})

server.listen(port, () => console.log(`Listening on port ${port}!`))
