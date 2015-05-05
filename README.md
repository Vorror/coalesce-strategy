[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

Coalesce Strategy
=========================
[![MEGANPM][MEGANPM-image]][downloads-url]


__coalesce-strategy__ is a nodejs module that allows you to create relatively* complex merging strategies for javascript objects. This module really shines if you're consuming json objects from various services and you need fine grained control over which fields you'll use in your application.

\**coalesce-strategy* doesn't support *deep* priorities i.e flat objects are preferred.

## Install
```sh
$ npm install --save coalesce-strategy
```
## Purpose
For example, if you created an app that gathered ID3 tag data for songs from various services, you would probably want to cherry pick which field gets used from each service. e.g always use song titles from Spotify, but only use genres from Lastfm.

And before now you would probably hard code this manually. And this may be ok for 2 services, but when you need to *coalesce* objects from 10+ services the code gets unwieldy and unmanageable. Especially in a real life scenario where the items you're merging may be missing fields. e.g if Lastfm was missing genre data, you would probably want to fallback to Spotify.

 And that's where *coalesce-strategy* comes into play. It allows you to define a strategy object which has the *strategies* and *priorities* that should be used to coalesce your items.

## Quick Example

Based on our song meta data example above, here's how we would solve our problem using *coalesce-strategy*

First lets define our strategy file(basic_strat.json):

```js
{
  "strategies": {
    "Spotify" : { "priorities": { "title": 10 } },
    "Lastfm" : { "priorities": { "genre": 3,  "releaseDate": 3 } } }
}    
```

Now for the coalescing:

```js
// load our strategy
var strategy = require('./basic_strat.json');

// define our central model to coalesce against
var songModel = {
    title: '',
    genre: '',
    releaseDate: '',
    length: ''
};

var merger = require('coalesce-strategy')(strategy, songModel);

var items = [];
items.push(merger.createItem('Spotify', {
    title: 'The FooBars',
    genre: 'country-horror', // ;)
    releaseDate: '10-21-2200' // LastFM has a higher priority,
                              // but it doesn't exist on LastFM's item
}));
items.push(merger.createItem('Lastfm', {
    title: 'The Fo&^$o_Bars!',
    genre: 'dubstep',
    pizzaFactor: 'supreme' // doesn't exist on the model
}));

// anonymous items have priorities of 0
items.push(merger.createItem({
    title: 'Fizzies',    // priority == 0; loses to Spotify
    length: '10 Minutes' // priority == 0;
}));

// coalesce our items
merger.merge(items, function(err, result) {
    console.log(result);     // => { title: 'The FooBars', genre: 'dubstep', releaseDate: '10-21-2200', length: '10 Minutes' }
});
```

By using *coalesce-strategy* we no longer have to hard code the properties we wish to use and allows us to quickly and easily modify existing priorities, as well as add new strategies when we add additional services. All *without* changing existing code logic.

## Documentation

### Methods

* [`createItem ([id] , item)`](#createItem)
* [`merge (items, callback)`](#merge)

### Modifiers

* [Understanding Modifiers & Priorities (Intro)](#understandMod)
* [`winOnDefault`](#winOnDefault)
* [`ignore`](#ignore)
* [`useOnly`](#useOnly)
* [`baseline`](#baseline)
* [`priority`](#priority)
* [`skipKeysWithFunctionValues`](#skipKeysWithFunctionValues)
* [`allowMergingOfEmptyValues`](#allowMergingOfEmptyValues)

## Methods

<a name="createItem" />
### createItem ([id] , item)

Wraps `item` into an object with the specified a `id` which can be understood by the library. 

The `id` should match an existing *id* in the strategy object. Items without an `id` will be assigned a randomly generated `id` and all properties will be treated as having an priority of 0.

__Arguments__

* `id` - The id of the strategy.
* `item` - The data/payload.

__Returns__

* `{object}` - a strategy item.

__Examples__

```js
// strategy.json
{
  "strategies": {
    "Spotify" : { "priorities": { "title": 10 } } }
}
```

```js
// Anonymous item
var item1 = merger.createItem({
    title: 'Fizzies',
    length: '10 Minutes'
});

// Item with an id
var item2 = merger.createItem('Spotify', { // <-- matches id in strategy.json
    title: 'The FooBars',
    genre: 'country'
});
```

---------------------------------------

<a name="merge" />
### merge (items, callback)

Merges/Coalesces an `array` of strategy items into a central model.

__Arguments__

* `items` - An array of strategy items.
* `callback(err, result)` - A callback which is called when the coalescing is complete. `result` will be the initial model with its property values modified to conform to the desired priorities.

As of writing the `err` parameter is unused and will always be assigned `null`. This is to remain compatible with libraries that require the traditional `callback(err, data)` pattern.

__Examples__

```js
// basic_strat.json
{
  "strategies": {
    "Spotify" : { "priorities": { "title": 10 } },
    "Lastfm" : { "priorities": { "genre": 3,  "releaseDate": 3 } } }
}    
```

```js
// load our strategy
var strategy = require('./basic_strat.json');

// define our central model to coalesce against
var songModel = {
    title: '',
    genre: '',
    releaseDate: '',
    length: ''
};

// initialize coalesce strategy library
var merger = require('coalesce-strategy')(strategy, songModel);

var items = [];
items.push(merger.createItem('Spotify', {
    title: 'The FooBars',
    genre: 'country-horror', // ;)
    releaseDate: '10-21-2200' // LastFM has a higher priority,
                              // but it doesn't exist on LastFM's item
}));
items.push(merger.createItem('Lastfm', {
    title: 'The Fo&^$o_Bars!',
    genre: 'dubstep',
    pizzaFactor: 'supreme' // doesn't exist on the model
}));

// anonymous items have priorities of 0
items.push(merger.createItem({
    title: 'Fizzies',    // priority == 0; loses to Spotify
    length: '10 Minutes' // priority == 0;
}));

// coalesce our items
merger.merge(items, function(err, result) {
    console.log(result);     // => { title: 'The FooBars', genre: 'dubstep', releaseDate: '10-21-2200', length: '10 Minutes' }
});
```

---------------------------------------

## Modifiers

<a name="understandMod" />
### Understanding Modifiers & Priorities (Intro)

Modifiers are a powerful feature of coalesce-strategy that allows intricate customization of the coalescing process. Coalesce-strategy supports blacklisting and whitelisting of properties, as well as a few other customization options.

To understand the modifier documentation below, it's important to understand the various levels/ways a modifier can be set inside a strategy file(`model`, `strategy`, `priority`).

Modifiers set on the `strategy` level affects *all* properties on that item(including ones that aren't explicitly defined).

A strategy object inside a strategy file *does not* need to include every property an item may have. Anything not given an explicit priority will be assumed to have a priority of 0.

```js
// SomeStrategyFile.json
{
  "model" : {
    "ignore": ["title"] // set on the "Model" level
  },

  "strategies": {
    "Spotify": { // Spotify Strategy
      "winOnDefault": false, // set on the "Strategy" level

      "priorities": {
        "title": 10,

        "release-date": { // setting a priority using an object
          "winOnDefault": true, // set on the "Priority" level
          "priority": 5
        },

        "genre": 2
      }
    }
  }
}   
```

---------------------------------------

<a name="winOnDefault" />
### winOnDefault

Generally the property with the highest priority always wins, but when two or more properties have the same priority, we refer to this as the "Default" or  "Conflict" state. This modifier allows coalesce-strategy to decide who should "win" in that scenario. 

Without the use of `winOnDefault` the item who appears later in the array of strategy items wins.

__Supported On__

`strategy` `priority`

__Type__

`boolean`

__Examples__

```js
//basic_strat.json
{
  "strategies": {
    "Spotify" : {
      "priorities": { "title": 10 }
    },
    "Lastfm" : {
      "priorities": {
        "title": {
          "winOnDefault": true,
          "priority": 10
        },
        "releaseDate": 3
      },
      "rdio" : {
        "winOnDefault": false,
        "priorities": {
          "releaseDate": 3
        }
      }
    }
  }
}
```

```js
var strategy = require('./basic_strat.json');
var songModel = {
    title: '',
    genre: '',
    releaseDate: '',
    length: ''
};

var merger = require('coalesce-strategy')(strategy, songModel);

var items = [];
items.push(merger.createItem('Spotify', {
    title: 'The FooBars', // conflicts with Lastfm but LastFM has winOnDefault true
    releaseDate: 'Spotify releaseDate'
}));
items.push(merger.createItem('Lastfm', {
    title: 'The Fo&^$o_Bars!', // will beat spotify in conflict(winOnDefault)
    releaseDate: 'Lastfm releaseDate' // conflicts with Lastfm but rdio has winOnDefault false
}));
items.push(merger.createItem('rdio', {
    title: 'Fizzies',
    releaseDate: 'rdio releaseDate' // has winOnDefault false
}));

merger.merge(items, function(err, result) {
    console.log(result); // => { title: 'The Fo&^$o_Bars!', genre: '', releaseDate: 'Lastfm releaseDate', length: '' }
});
```

---------------------------------------

<a name="ignore" />
### ignore

A blacklist of properties. Properties that are blacklisted will be ignored during the coalescing process.

__Supported On__

`model` `strategy`

__Type__

`array`

__Examples__

```js
//basic_strat.json
{
  "model": {
    "ignore": ["author"]
  },
  "strategies": {
    "BarnesNobles": {},
    "Amazon": {
      "ignore": ["summary"]
    }
  }
}
```

```js
var strategy = require('./basic_strat.json');
var bookModel = {
    title: '',
    author: '',
    summary: '',
    rating: ''
};
var merger = require('coalesce-strategy')(strategy, bookModel);
var items = [];
items.push(merger.createItem('BarnesNobles', {
    title: 'Stack Underflow', // priority == 0
    author: 'Manny', // ignored on model
    summary: 'A story about a little byte that could.'
}));
items.push(merger.createItem('Amazon', {
    title: 'The Fo&^$o_Bars!', // priority == 0; but is later in the array
    author: 'Pacquiao', // ignored on model
    summary: 'Fake summary' // ignored on strategy
}));
merger.merge(items, function(err, result) {
    console.log(result); // => { title: 'The Fo&^$o_Bars!', author: '', summary: 'A story about a little byte that could.', rating: '' }
});
```

---------------------------------------

<a name="useOnly" />
### useOnly

A whitelist of properties. Only properties listed in the array will be used to populate the central model.

__Supported On__

`model` `strategy`

__Type__

`array`

__Examples__

```js
//basic_strat.json
{
  "model": {
    "useOnly": ["studio", "rating", "revenue"]
  },
  "strategies": {
    "IMDB": {
      "useOnly": ["rating"]
    },
    "metacritic": {
      "useOnly": ["title", "revenue"]
    }
  }
}
```

```js
var strategy = require('./basic_strat.json');
var movieModel = {
    title: '',
    studio: '',
    rating: '',
    revenue: ''
};
var merger = require('coalesce-strategy')(strategy, movieModel);
var items = [];
items.push(merger.createItem('IMDB', {
    title: 'Pizza Party',
    studio: 'Lions Gate',
    revenue: '10M',
    rating: '5.9' // only this property is whitelisted/allowed
}));
items.push(merger.createItem('metacritic', {
    title: 'The Matrix', // whitelisted by strategy; but isn't whitelisted by the model
    studio: 'WB',
    revenue: '900M', // whitelisted
    rating: '1.0'
}));
items.push(merger.createItem({ // anonymous item
    studio: 'RocketJump' // whitelisted
}));
merger.merge(items, function(err, result) {
    console.log(result); // => { title: '', studio: 'RocketJump', rating: '5.9', revenue: '900M' }
});
```

---------------------------------------

<a name="baseline" />
### baseline

Shifts the priorities of all the properties on an strategy. This also applies to properties that are not explicitly defined in the strategy file. The property's final priority will be the sum of the baseline and the property's own priority(if defined).

__Supported On__

`strategy`

__Type__

`number`

__Examples__

```js
//basic_strat.json
{
  "strategies": {
    "npm": {
      "baseline": 10,
      "priorities": {
        "maintainer": 5
      }
    },
    "enterprise":{
      "priorities": {
        "maintainer": 8,
        "packageName": 6
      }
    }
  }
}
```

```js
var strategy = require('./basic_strat.json');
var npmModel = {
    packageName: '',
    maintainer: ''
};
var merger = require('coalesce-strategy')(strategy, npmModel);
var items = [];
items.push(merger.createItem('npm', {
    // notice how packageName wasn't given an explicit priority
    packageName: 'coalesce-strategy', // Baseline shift; priority == 10
    maintainer: 'vorror' // priority == 15(10+5)
}));
items.push(merger.createItem('enterprise', {
    packageName: 'fake package', // priority == 6
    maintainer: 'other_guy' // priority == 8
}));
merger.merge(items, function(err, result) {
    console.log(result); // => { packageName: 'coalesce-strategy', maintainer: 'vorror' }
});
```

---------------------------------------

<a name="priority" />
### priority

Sets the priority of a particular property. Useful when combining multiple modifiers at the `priority` level.

__Supported On__

`priority`

__Type__

`number`

__Examples__

```js
//basic_strat.json
{
  "strategies": {
    "npm": {
      "priorities": {
        "maintainer": 5,
        "downloads": {
        	"priority": 10,
        	"winOnDefault": true
        }
      }
    }
  }
}
```

---------------------------------------

<a name="skipKeysWithFunctionValues" />
### skipKeysWithFunctionValues

Any property/key on the central model object that has been assigned a `function` will be ignored during the coalescing process.

__Supported On__

`model`

__Type__

`boolean`

__Examples__

```js
//basic_strat.json
{
  "model": {
    "skipKeysWithFunctionValues": true
  },
  "strategies": {
    "npm": {
      "priorities": { "maintainer": 5 } } }
}
```

```js
var strategy = require('./basic_strat.json');
var npmModel = {
    packageName: '',
    calculateDownloads: function() {
        console.log('Some function');
    }
};
var merger = require('coalesce-strategy')(strategy, npmModel);
var items = [];
items.push(merger.createItem('npm', {
    packageName: 'coalesce-strategy',
    calculateDownloads: 'Hello World' // ignored because typeof calculateDownloads === function on npmModel
}));
merger.merge(items, function(err, result) {
    console.log(result); // => { packageName: 'coalesce-strategy', calculateDownloads: [Function] }
});
```

---------------------------------------

<a name="allowMergingOfEmptyValues" />
### allowMergingOfEmptyValues

Optionally disable coalescing properties with `empty` values.
Default is `true`.

__Supported On__

`model`

__Type__

`boolean`

__Examples__

```js
//basic_strat.json
{
  "model": { "allowMergingOfEmptyValues": false }
}
```

```js
var strategy = require('./basic_strat.json');
var npmModel = {
    packageName: 'coalesce-strategy'
};
var merger = require('coalesce-strategy')(strategy, npmModel);
var items = [];
items.push(merger.createItem('npm', {
    packageName: '' // empty so it will be ignored
}));
merger.merge(items, function(err, result) {
    console.log(result); // => { packageName: 'coalesce-strategy' }
});
```

And just so there's no confusion as to what qualifies as `empty`:

```js
var merger = require('coalesce-strategy');
console.log(merger.tests.isEmpty('')); // => true
console.log(merger.tests.isEmpty(String())); // => true
console.log(merger.tests.isEmpty([])); // => true
console.log(merger.tests.isEmpty({})); // => true
console.log(merger.tests.isEmpty(null)); // => true
console.log(merger.tests.isEmpty(undefined)); // => true
console.log(merger.tests.isEmpty({a: ''})); // => false
console.log(merger.tests.isEmpty('Stuff')); // => false
console.log(merger.tests.isEmpty(function(){})); // => false
console.log(merger.tests.isEmpty(false)); // => false
console.log(merger.tests.isEmpty(true)); // => false
console.log(merger.tests.isEmpty(10)); // => false
```
Never **EVER** use anything under *`tests`*. It's only exposed for unit testing purposes. You have been warned.

---------------------------------------

## License
The MIT License (MIT)

Copyright (c) 2015 Paul J. Miller

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[MEGANPM-image]: https://nodei.co/npm/coalesce-strategy.png
[npm-image]: https://img.shields.io/npm/v/coalesce-strategy.svg?style=flat-square
[npm-url]: https://npmjs.org/package/coalesce-strategy
[travis-image]: https://img.shields.io/travis/Vorror/coalesce-strategy.svg?style=flat-square
[travis-url]: https://travis-ci.org/Vorror/coalesce-strategy
[coveralls-image]: https://img.shields.io/coveralls/Vorror/coalesce-strategy.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/Vorror/coalesce-strategy
[david-image]: http://img.shields.io/david/vorror/coalesce-strategy.svg?style=flat-square
[david-url]: https://david-dm.org/vorror/coalesce-strategy
[license-image]: http://img.shields.io/npm/l/coalesce-strategy.svg?style=flat-square
[license-url]: https://raw.githubusercontent.com/Vorror/coalesce-strategy/master/LICENSE
[downloads-image]: http://img.shields.io/npm/dm/coalesce-strategy.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/coalesce-strategy