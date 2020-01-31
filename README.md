# reflectr

CLI tool to mirror photos, albums, tags, descriptions, etc for a Flickr account.

## Install

```
npm install -g reflectr
```

## Usage

First create an application at [Flickr](https://www.flickr.com/services/apps/) to generate an API key and secret.

Then create a folder to store the mirrored data and run the following command in that folder.

```
reflectr
```

You will then be prompted for a passphrase to store encrypted Flickr secrets, your Flickr API key and secret, and to authorize that API key for your account.

This information will be stored, encrypted, in the folder as `.reflectr.json` so that on subsequent runs you only need to enter the passphrase to resync with your account.
