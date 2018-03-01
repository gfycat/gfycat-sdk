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

var gfycat = new Gfycat({clientId: YOUR_CLIENT_ID, clientSecret: YOUR_CLIENT_SECRET});
```

**For security reasons, we suggest storing the client id and secret in a secure location.**


## Methods

### Authenticate
Returns a callback, or promise that resolves to the api authentication token that is valid for 1 hour

#### Callback
```javascript
gfycat.authenticate((err, data) => {
  //Your app is now authenticated
  assert.equal(data.access_token, gfycat.token);
  console.log('token', gfycat.token);
})
```

#### Promise
```javascript
gfycat.authenticate().then(res => {
  //Your app is now authenticated
  assert.equal(res.access_token, gfycat.token);
  console.log('token', gfycat.token);
});
```

### Search
Returns a promise that resolves to a gfycats object. API supports pagination using cursors and count/first.
The optional random attribute will randomize the result returned by the API - do not supply pagination attributes with this.

```javascript
let options = {
  search_text: 'hello',
  count: 20,
  first: 30
};

gfycat.search(options).then(data => {
  console.log('gfycats', data);
});
```

### Get User Details
Returns user account information by username

```javascript
let options = {
  userId: 'myUsername'
};

gfycat.getUserDetails(options).then(data => {
  console.log(data);
});
```

### Get Gfycat Details
Return Gfycat json by gfycat name

```javascript
let options = {
  gfyId: 'richpepperyferret'
};

gfycat.getGifDetails(options).then(data => console.log(data))
```

### Get Related Content
Return a list of Gfycats related to the one provided.

```javascript
let options = {
  gfyId: 'richpepperyferret'
};

gfycat.getRelatedContent(options).then(data => console.log(data))
```

### Get User Feed
Return the gfycats uploaded and shared by a given username.

```javascript
let options = {
  userId: 'myUsername'
};

gfycat.userFeed(options).then(data => console.log(data))
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
