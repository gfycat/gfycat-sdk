# gfycat-sdk
[![NPM](https://nodei.co/npm/gfycat-sdk.png)](https://nodei.co/npm/gfycat-sdk/)

[![Build Status](https://api.travis-ci.org/kngroo/gfycat-sdk.svg?branch=master)](https://travis-ci.org/kngroo/gfycat-sdk)

Javascript API wrapper for [Gfycat.com](https://gfycat.com) [API](https://developers.gfycat.com) that supports **callbacks** and **promises**.


## Installation
```bash
npm install gfycat-sdk --save
```

## Usage
Obtain a client_id and client_secret for your integration from the [Gfycat developers portal](https://developers.gfycat.com/signup/#/apiform).

```javascript
const Gfycat = require('gfycat-sdk');

var gfycat = new Gfycat({client_id: YOUR_CLIENT_ID, client_secret: YOUR_CLIENT_SECRET});
```

**For security reasons, we suggest storing the client id and secret in a secure location.**


## Methods

### Authenticate
Returns a promise that resolves to the api authentication token that is valid for 1 hour

```javascript
gfycat.authenticate().then(data => {
  //Your app is now authenticated
  assert.equal(data, gfycat.token);
  console.log('token', gfycat.token);
});
```

### Search
Returns a promise that resolves to a gfycats object. API supports pagination using cursors and count/first.
The random attribute will randomize the result returned by the API - use only with count: 1 and no pagination.

```javascript
let options = {
  search_text: 'hello',
  count: 20,
  first: 30,
  random: false
};

gfycat.search(options).then(data => {
  console.log('gfycats', data);
});
```

### Get User Details
Returns user account information by username

```javascript
gfycat.getUserDetails('USERNAME').then(data => {
  console.log(data);
});
```

### Get Gfycat Details
Return Gfycat json by gfycat name

```javascript
gfycat.getGifDetails('richpepperyferret').then(data => console.log(data))
```

### Get User Feed
Return the gfycats uploaded and shared by a given username.

```javascript
gfycat.userFeed('USERNAME').then(data => console.log(data))
```

### Get Trending GIFs
Return JSON of currently trending gifs

```javascript
let options = {
  count: 10,
  cursor: ''
}

gfycat.trendingGifs(options).then(data => console.log(data))
```

### Get Trending Tags
Return JSON of currently trending tags

```javascript
let options = {
  count: 10,
  populated: false
}

gfycat.trendingTags(options).then(data => console.log(data))
```
