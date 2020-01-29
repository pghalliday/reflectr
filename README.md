# flickr-test

Create a `secrets.js` file to contain the Flickr API token and secret

```javascript
module.exports = {
  key: 'KEY',
  secret: 'SECRET',
}
```

To generate SSL cert run the following script

```
./keys.sh
```

To override the Google Chrome warning for the the certificate type the following after clicking anywhere on the error page

```
thisisunsafe
```
