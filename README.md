# gfycat-sdk
[![NPM](https://nodei.co/npm/gfycat-sdk.png)](https://nodei.co/npm/gfycat-sdk/)
[![Build Status](https://api.travis-ci.org/kngroo/gfycat-sdk.svg?branch=master)](https://travis-ci.org/kngroo/gfycat-sdk)
[![Dependencies](https://david-dm.org/kngroo/gfycat-sdk.svg)](https://david-dm.org/kngroo/gfycat-sdk.svg)

Javascript API wrapper for [Gfycat.com](https://gfycat.com) [API](https://developers.gfycat.com) that supports **promises**.


## Installation
```bash
npm install gfycat-sdk --save
```

## Usage
Obtain a client_id and client_secret for your integration from the [Gfycat developers portal](https://developers.gfycat.com/signup/#/apiform).

```javascript
const Gfycat = require('gfycat-sdk');

var gfycat = new Gfycat(client_id, client_secret);

gfycat.authenticate();
//Your app is now authenticated
```

**For security reasons, we suggest storing the client id and secret in a secure location.**


## Methods
Currently supported:
### Authenticate
Returns a promise that resolves to the api authentication token that is valid for 1 hour

### Search
Returns a promise that resolves to a gfycats object.

Example
```javascript
gfycat.search('hello').then(data => {
  console.log('gfycats', data);
});
```
