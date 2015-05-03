'use strict';

var chai = require('chai');
var mocha = require('mocha');
var assert = chai.assert;

describe('Coalesce Strategy', function () {

    describe('Test Item creation', function () {
        before(function(done){
            var Merger = require('../lib/coalesce-strategy')().createItem();
            done();
        });

        it('Should create item with random ID', function (done) {
            var Merger = require('../lib/coalesce-strategy')();
            var item = Merger.createItem({pizza: 'what'});
            assert.isObject(item, 'should get an object');
            assert.property(item, 'id', 'should have an id');
            assert.property(item, 'item', 'should have an item object');
            assert.isTrue(item.id.length > 0, 'should have an id length');
            done();
        });

        it('Should have an empty object', function (done) {
            var Merger = require('../lib/coalesce-strategy')();
            var item = Merger.createItem({});
            assert.isObject(item, 'should get an object');
            assert.property(item, 'id', 'should have an id');
            assert.property(item, 'item', 'should have an item object');
            assert.isTrue(item.id.length > 0, 'should have an id length');
            assert.equal(Object.keys(item.item).length, 0, 'should have an empty object');
            done();
        });

        it('Should have an empty object (noop)', function (done) {
            var Merger = require('../lib/coalesce-strategy')();
            var item = Merger.createItem();
            assert.isObject(item, 'should get an object');
            assert.property(item, 'id', 'should have an id');
            assert.property(item, 'item', 'should have an item object');
            assert.isTrue(item.id.length > 0, 'should have an id length');
            assert.equal(Object.keys(item.item).length, 0, 'should have an empty object');
            done();
        });

        it('Should create object with an id and result', function (done) {
            var Merger = require('../lib/coalesce-strategy')();
            var item = Merger.createItem('What', {ok: 'beep'});
            assert.isObject(item, 'should get an object');
            assert.property(item, 'id', 'should have an id');
            assert.property(item, 'item', 'should have an item object');
            assert.equal(item.id, 'What', 'should create an object with correct id');
            assert.isTrue(item.id.length > 0, 'should have an id length');
            assert.deepEqual(item.item, {ok: 'beep'}, 'sesults should contain the exact object');
            done();
        });
    });

    describe('Test isEmpty()', function () {

        it('isEmpty() using empty string', function (done) {
            assert.isTrue(require('../lib/coalesce-strategy').tests.isEmpty(''),
                'string with no length should be empty');
            assert.isTrue(require('../lib/coalesce-strategy').tests.isEmpty(String()),
                'string with no length should be empty');
            done();
        });

        it('isEmpty() using non-empty string', function (done) {
            assert.isFalse(require('../lib/coalesce-strategy').tests.isEmpty('What'),
                'string with length should evaluate as false');
            assert.isFalse(require('../lib/coalesce-strategy').tests.isEmpty(' '),
                'string with length should evaluate as false');
            assert.isFalse(require('../lib/coalesce-strategy').tests.isEmpty(String('ok')),
                'string with length should evaluate as false');
            done();
        });

        it('isEmpty() using empty object', function (done) {
            assert.isTrue(require('../lib/coalesce-strategy').tests.isEmpty({}),
                'empty object should evaluate as empty');
            done();
        });

        it('isEmpty() using non-empty object', function (done) {
            assert.isFalse(require('../lib/coalesce-strategy').tests.isEmpty({a: 'what'}),
                'non-empty object should evaluate as false');
            done();
        });

        it('isEmpty() using non-empty object, but with \'empty\' property', function (done) {
            assert.isFalse(require('../lib/coalesce-strategy').tests.isEmpty({a: ''}),
                'non-empty object should evaluate as false');
            done();
        });

        it('isEmpty() using empty array', function (done) {
            assert.isTrue(require('../lib/coalesce-strategy').tests.isEmpty([]),
                'empty array should evaluate as empty');
            done();
        });

        it('isEmpty() using non-empty array', function (done) {
            assert.isFalse(require('../lib/coalesce-strategy').tests.isEmpty(['Hello World', 'Foo']),
                'non-empty array should evaluate as false');
            assert.isFalse(require('../lib/coalesce-strategy').tests.isEmpty(new Array('Hello World')),
                'non-empty array should evaluate as false');
            done();
        });

        it('isEmpty() using boolean', function (done) {
            assert.isFalse(require('../lib/coalesce-strategy').tests.isEmpty(false),
                'boolean should be false');
            assert.isFalse(require('../lib/coalesce-strategy').tests.isEmpty(true),
                'boolean should be false');
            assert.isFalse(require('../lib/coalesce-strategy').tests.isEmpty(Boolean(false)),
                'boolean should be false');
            assert.isFalse(require('../lib/coalesce-strategy').tests.isEmpty(Boolean(true)),
                'boolean should be false');
            assert.isFalse(require('../lib/coalesce-strategy').tests.isEmpty(Boolean()),
                'boolean should be false');
            done();
        });

        it('isEmpty() using null', function (done) {
            assert.isTrue(require('../lib/coalesce-strategy').tests.isEmpty(null),
                'boolean should be false');
            done();
        });

        it('isEmpty() using number', function (done) {
            assert.isFalse(require('../lib/coalesce-strategy').tests.isEmpty(10),
                'number should be false');
            assert.isFalse(require('../lib/coalesce-strategy').tests.isEmpty(0),
                'number should be false');
            assert.isFalse(require('../lib/coalesce-strategy').tests.isEmpty(-10),
                'number should be false');
            done();
        });

        it('isEmpty() using undefined', function (done) {
            assert.isTrue(require('../lib/coalesce-strategy').tests.isEmpty(),
                'undefined should be empty');
            done();
        });

        it('isEmpty() using function', function (done) {
            assert.isFalse(require('../lib/coalesce-strategy').tests.isEmpty(function () {}),
                'function should be false');
            done();
        });
    });

    describe('Test randomID()', function () {

        it('randomId() using noop', function (done) {
            var id = require('../lib/coalesce-strategy').tests.randomId();
            assert.isString(id, 'should get a string');
            assert.equal(id.length, '15', 'should receive a string of length 15');
            done();
        });

        it('randomId() using length', function (done) {
            var id = require('../lib/coalesce-strategy').tests.randomId(32);
            assert.isString(id, 'should get a string');
            assert.equal(id.length, '32', 'should receive a string of length 32');
            done();
        });

        it('randomId() using negative length', function (done) {
            var id = require('../lib/coalesce-strategy').tests.randomId(-20);
            assert.isString(id, 'should get a string');
            assert.equal(id.length, '0', 'should receive a string of length 0');
            done();
        });
    });

    describe('Test hasProperty()', function () {

        it('hasProperty() using empty object', function (done) {
            var val = require('../lib/coalesce-strategy').tests.hasProperty({}, 'foo');
            assert.isFalse(val, 'shouldn\'t return true on an empty object');
            done();
        });

        it('hasProperty() using property and flat structure', function (done) {
            var val = require('../lib/coalesce-strategy').tests.hasProperty({foo:'bar'}, 'foo');
            assert.isTrue(val, 'Should find foo property');
            done();
        });

        it('hasProperty() using property and nested structure', function (done) {
            var val = require('../lib/coalesce-strategy').tests.hasProperty({foobar:{bar:{foo: 'bar'}}},
                'foobar.bar.foo');
            assert.isTrue(val, 'should find foo property');
            done();
        });

        it('hasProperty() using property and nested structure(excess dots)', function (done) {
            var val = require('../lib/coalesce-strategy').tests.hasProperty({foobar:{bar:{foo: 'bar'}}},
                'foobar.....bar.....foo');
            assert.isFalse(val, 'shouldn\'t find foo');
            done();
        });

        it('hasProperty() using property and nested structure (missing link in chain)', function (done) {
            var val = require('../lib/coalesce-strategy').tests.hasProperty({foobar:{bar:{foo: 'bar'}}},
                'foobar.foo');
            assert.isFalse(val, 'should\ find foo property');
            done();
        });

        it('hasProperty() using boolean false property', function (done) {
            var val = require('../lib/coalesce-strategy').tests.hasProperty({foobar:false},
                'foobar');
            assert.isTrue(val, 'should find a (boolean) false property');
            done();
        });

        it('hasProperty() using empty string property', function (done) {
            var val = require('../lib/coalesce-strategy').tests.hasProperty({foobar:''},
                'foobar');
            assert.isTrue(val, 'should find a empty string');
            done();
        });

        it('hasProperty() using incorrect nested search', function (done) {
            var val = require('../lib/coalesce-strategy').tests.hasProperty({foobar:{bar:{foo: 'bar'}}},
                'foo');
            assert.isFalse(val, 'should\'t find foo using incorrect indirection');
            done();
        });
    });

    describe('Test merging', function () {
        function songFactory() {
            return {
                title: '',
                artist: '',
                rating: '',
                revenue: '',
                genre: '',
                studios: [],
                printNothing: function () {
                    console.log('nothing');
                }
            };
        }

        it('Test merging with no strategy or model', function (done) {
            var merger = require('../lib/coalesce-strategy')();
            var items = [];
            items.push(merger.createItem({
                title: 'Awesome title 1',
                id: 'Fake id',
                revenue: '100,000',
                genre: 'rock'
            }));

            merger.merge(items, function (err, data) {
                assert.equal(Object.keys(data).length, '0', 'should be empty object');
                done();
            });
        });

        it('Test merging with no strategy', function (done) {
            var merger = require('../lib/coalesce-strategy')({}, songFactory());
            var items = [];
            items.push(merger.createItem({
                    title: 'Awesome title 1',
                    id: 'Fake id',
                    revenue: '100,000',
                    genre: 'rock'
                }));

            merger.merge(items, function (err, data) {
                assert.equal(data.title, 'Awesome title 1', 'titles should be equal');
                assert.equal(data.artist, '', 'should be unchanged');
                assert.equal(data.rating, '', 'should be unchanged');
                assert.equal(data.revenue, '100,000', 'revenue should be equal');
                assert.equal(data.genre, 'rock', 'genre should be equal');
                assert.isArray(data.studios, 'should still be an array');
                assert.equal(data.studios.length, '0', 'array should be empty');
                assert.isFunction(data.printNothing, 'should still be a function');
                assert.isUndefined(data.id, 'should be undefined');
                done();
            });
        });

        it('Test merging with multiple items and ignored properties', function (done) {
            var merger = require('../lib/coalesce-strategy')(require('./merge-strategies/ignore_strat.json'),
                songFactory());
            var items = [];
            items.push(merger.createItem({
                title: 'Awesome title 1',
                id: 'Fake id',
                revenue: '100,000',
                genre: 'rock'
            }));

            items.push(merger.createItem({
                title: 'Awesome title 2',
                id: 'Fake id2',
                revenue: '200,000',
                genre: 'rock',
                printNothing: true
            }));

            items.push(merger.createItem({
                title: 'Awesome title 2',
                id: 'Fake id3',
                revenue: '300,000',
                genre: 'rock',
                rating: 'PG13',
                printNothing: true
            }));

            merger.merge(items, function (err, data) {
                assert.equal(data.title, 'Awesome title 2', 'second item should win title');
                assert.equal(data.artist, '', 'should be unchanged');
                assert.equal(data.rating, 'PG13', 'should be updated');
                assert.equal(data.revenue, '', 'should be ignored');
                assert.equal(data.genre, '', 'should be ignored');
                assert.isArray(data.studios, 'should still be an array');
                assert.equal(data.studios.length, '0', 'array should be empty');
                assert.isNotFunction(data.printNothing, 'should no longer be a function');
                assert.isBoolean(data.printNothing, 'should now be a boolean');
                assert.isUndefined(data.id, 'should be undefined');
                done();
            });
        });

        it('Test merging with multiple items and ignored properties on model and strategies', function (done) {
            var merger = require('../lib/coalesce-strategy')(require('./merge-strategies/ignore_strat2.json'),
                songFactory());
            var items = [];

            items.push(merger.createItem('NOT_FOUND_STRAT',
                {
                    rating: 'AMAZING'
                }));

            items.push(merger.createItem('ignore-strat2',
                {
                    title: 'Awesome title 1',
                    id: 'Fake id',
                    revenue: '100,000',
                    genre: 'rock',
                    rating: 'R',
                    studios: ['something']
                }));

            items.push(merger.createItem('ignore-strat',
                {
                    title: 'Awesome title 2',
                    id: 'Fake id2',
                    artist: 'Foo',
                    revenue: '130,000',
                    genre: 'country',
                    printNothing: true
                }));

            items.push(merger.createItem('ignore-strat',
                {
                    title: 'Awesome title 3',
                    id: 'Fake i2',
                    revenue: '300,000',
                    genre: 'dubstep',
                    printNothing: false
                }));

            merger.merge(items, function (err, data) {
                assert.equal(data.title, 'Awesome title 1');
                assert.equal(data.artist, 'Foo');
                assert.equal(data.rating, 'AMAZING');
                assert.equal(data.revenue, '300,000');
                assert.equal(data.genre, 'rock');
                assert.isArray(data.studios, 'should still be an array');
                assert.equal(data.studios.length, '1');
                assert.equal(data.studios[0], 'something');
                assert.isNotFunction(data.printNothing, 'should no longer be a function');
                assert.isBoolean(data.printNothing, 'should now be a boolean');
                assert.isFalse(data.printNothing);
                assert.isUndefined(data.id, 'should be undefined');
                done();
            });
        });

        it('Test merging with useonly/ignore on model/properties', function (done) {
            var merger = require('../lib/coalesce-strategy')(require('./merge-strategies/ignore_useo_strat3.json'),
                songFactory());
            var items = [];

            items.push(merger.createItem('NOT_FOUND_STRAT',
                {
                    rating: 'AMAZING'
                }));

            items.push(merger.createItem('ignore-strat2',
                {
                    title: 'Awesome title 1',
                    id: 'Fake id',
                    revenue: '200,000',
                    genre: 'rock',
                    rating: 'R',
                    studios: ['something']
                }));

            items.push(merger.createItem('ignore-strat',
                {
                    title: 'Awesome title 2',
                    id: 'Fake id2',
                    artist: 'Foo',
                    revenue: '100,000',
                    genre: 'country',
                    printNothing: true
                }));

            items.push(merger.createItem('ignore-strat',
                {
                    title: 'Awesome title 3',
                    id: 'Fake i2',
                    revenue: '300,0000',
                    genre: 'dubstep',
                    printNothing: false
                }));

            merger.merge(items, function (err, data) {
                assert.equal(data.title, '');
                assert.equal(data.artist, 'Foo');
                assert.equal(data.rating, 'AMAZING');
                assert.equal(data.revenue, '200,000');
                assert.equal(data.genre, '');
                assert.isArray(data.studios, 'should still be an array');
                assert.equal(data.studios.length, '0');
                assert.isFunction(data.printNothing);
                assert.isUndefined(data.id, 'should be undefined');
                done();
            });
        });

        it('Test merging with useonly on model and ignores on items', function (done) {
            var merger = require('../lib/coalesce-strategy')(require('./merge-strategies/ignore_useo_strat4.json'),
                songFactory());
            var items = [];

            items.push(merger.createItem('NOT_FOUND_STRAT',
                {
                    rating: 'AMAZING',
                    studios: ['arg']
                }));

            items.push(merger.createItem('ignore-strat2',
                {
                    title: 'Awesome title 1',
                    id: 'Fake id',
                    revenue: '100,000',
                    genre: 'rock',
                    rating: 'R',
                    studios: ['something'],
                    printNothing: false
                }));

            items.push(merger.createItem('ignore-strat',
                {
                    title: 'Awesome title 2',
                    id: 'Fake id2',
                    artist: 'Foo',
                    revenue: '130,000',
                    genre: 'country',
                    printNothing: true
                }));

            items.push(merger.createItem('ignore-strat',
                {
                    title: 'Awesome title 3',
                    id: 'Fake i2',
                    revenue: '300,000',
                    genre: 'dubstep',
                    printNothing: 10
                }));

            merger.merge(items, function (err, data) {
                assert.equal(data.title, '');
                assert.equal(data.artist, '');
                assert.equal(data.rating, 'AMAZING');
                assert.equal(data.revenue, '');
                assert.equal(data.genre, 'dubstep');
                assert.isArray(data.studios, 'should still be an array');
                assert.equal(data.studios.length, '0');
                assert.isNotFunction(data.printNothing, 'should no longer be a function');
                assert.isBoolean(data.printNothing, 'should now be a boolean');
                assert.isFalse(data.printNothing);
                assert.isUndefined(data.id, 'should be undefined');
                done();
            });
        });

        it('Test merging with some simple priorities', function (done) {
            var merger = require('../lib/coalesce-strategy')(require('./merge-strategies/basic_strat.json'),
                songFactory());
            var items = [];

            items.push(merger.createItem('NOT_FOUND_STRAT',
                {
                    rating: 'AMAZING',
                    studios: ['arg']
                }));

            items.push(merger.createItem('basic-strat2',
                {
                    title: 'Awesome title 2',
                    id: 'Fake id2',
                    artist: 'The FooBars',
                    revenue: '100,000',
                    genre: 'country',
                    printNothing: true
                }));

            items.push(merger.createItem('basic-strat5',
                {
                    printNothing: false
                }));

            items.push(merger.createItem('basic-strat',
                {
                    title: 'Winning Title',
                    id: 'Fake id',
                    revenue: '130,000',
                    genre: 'rock',
                    rating: 'R',
                    artist: 'some artist',
                    studios: ['something'],
                    printNothing: false
                }));

            items.push(merger.createItem('basic-strat4',
                {
                    title: 'Awesome title 4',
                    revenue: '400,000'
                }));

            items.push(merger.createItem('basic-strat3',
                {
                    title: 'Awesome title 3',
                    id: 'Fake i2',
                    revenue: '300,000',
                    genre: 'dubstep',
                    rating: 'AO',
                    artist: 'Another artist',
                    studios: ['WOOSH'],
                    printNothing: 10
                }));

            merger.merge(items, function (err, data) {
                assert.equal(data.title, 'Winning Title');
                assert.equal(data.artist, 'The FooBars');
                assert.equal(data.rating, 'AO');
                assert.equal(data.revenue, '400,000');
                assert.equal(data.genre, 'country');
                assert.isArray(data.studios, 'should still be an array');
                assert.equal(data.studios.length, '1');
                assert.equal(data.studios[0], 'something');
                assert.isNotFunction(data.printNothing, 'should no longer be a function');
                assert.isBoolean(data.printNothing, 'should now be a boolean');
                assert.isFalse(data.printNothing);
                assert.isUndefined(data.id, 'should be undefined');
                done();
            });
        });

        it('Test merging with some model features and testing winOnDefault', function (done) {
            var song = songFactory();
            song.genre = 'SONG_FACTORY';
            var merger = require('../lib/coalesce-strategy')(require('./merge-strategies/basic_strat2.json'),
                song);
            var items = [];

            items.push(merger.createItem('basic-strat',
                {
                    title: 'Ignored Title',
                    id: 'Fake id2',
                    artist: 'The FooBars',
                    revenue: '100,000',
                    printNothing: true
                }));

            items.push(merger.createItem({
                title: '??',
                id: 'Fake id',
                revenue: '130,000',
                genre: '',
                rating: 'R',
                artist: 'some artist',
                studios: ['something'],
                printNothing: false
            }));

            merger.merge(items, function (err, data) {
                assert.equal(data.title, '');
                assert.equal(data.artist, 'The FooBars');
                assert.equal(data.rating, 'R');
                assert.equal(data.revenue, '100,000');
                assert.equal(data.genre, 'SONG_FACTORY');
                assert.isArray(data.studios, 'should still be an array');
                assert.equal(data.studios.length, '1');
                assert.equal(data.studios[0], 'something');
                assert.isFunction(data.printNothing);
                assert.isUndefined(data.id, 'should be undefined');
                done();
            });
        });

        it('Testing with allowMergingOfEmptyValues not set', function (done) {
            var song = songFactory();
            song.title = 'SONG_FACTORY';
            song.artist = 'SONG_FACTORY';
            song.revenue = 'SONG_FACTORY';
            song.genre = 'SONG_FACTORY';
            var merger = require('../lib/coalesce-strategy')({}, song);
            var items = [];

            items.push(merger.createItem('basic-strat', {
                title: '',
                id: '',
                artist: '',
                revenue: '',
                genre: ''
            }));

            merger.merge(items, function (err, data) {
                assert.equal(data.title, '');
                assert.equal(data.artist, '');
                assert.equal(data.rating, '');
                assert.equal(data.revenue, '');
                assert.equal(data.genre, '');
                assert.isArray(data.studios, 'should still be an array');
                assert.equal(data.studios.length, '0');
                assert.isFunction(data.printNothing);
                assert.isUndefined(data.id, 'should be undefined');
                done();
            });
        });

        it('Testing with allowMergingOfEmptyValues set to false', function (done) {
            var song = songFactory();
            song.title = 'SONG_FACTORY';
            song.artist = 'SONG_FACTORY';
            song.revenue = 'SONG_FACTORY';
            song.genre = 'SONG_FACTORY';

            var strat = {
                model: {
                    allowMergingOfEmptyValues: false
                }
            };
            var merger = require('../lib/coalesce-strategy')(strat, song);
            var items = [];

            items.push(merger.createItem('basic-strat', {
                title: '',
                id: '',
                artist: '',
                revenue: '',
                genre: ''
            }));

            merger.merge(items, function (err, data) {
                assert.equal(data.title, 'SONG_FACTORY');
                assert.equal(data.artist, 'SONG_FACTORY');
                assert.equal(data.rating, '');
                assert.equal(data.revenue, 'SONG_FACTORY');
                assert.equal(data.genre, 'SONG_FACTORY');
                assert.isArray(data.studios, 'should still be an array');
                assert.equal(data.studios.length, '0');
                assert.isFunction(data.printNothing);
                assert.isUndefined(data.id, 'should be undefined');
                done();
            });
        });

        it('Testing with allowMergingOfEmptyValues set to true', function (done) {
            var song = songFactory();
            song.title = 'SONG_FACTORY';
            song.artist = 'SONG_FACTORY';
            song.revenue = 'SONG_FACTORY';
            song.genre = 'SONG_FACTORY';

            var strat = {
                model: {
                    allowMergingOfEmptyValues: true
                }
            };
            var merger = require('../lib/coalesce-strategy')(strat, song);
            var items = [];

            items.push(merger.createItem('basic-strat', {
                title: '',
                id: '',
                artist: '',
                revenue: '',
                genre: ''
            }));

            merger.merge(items, function (err, data) {
                assert.equal(data.title, '');
                assert.equal(data.artist, '');
                assert.equal(data.rating, '');
                assert.equal(data.revenue, '');
                assert.equal(data.genre, '');
                assert.isArray(data.studios, 'should still be an array');
                assert.equal(data.studios.length, '0');
                assert.isFunction(data.printNothing);
                assert.isUndefined(data.id, 'should be undefined');
                done();
            });
        });

        /**
         *  I like to think of this as the ultimate test suite. Assuming all properties have distinct priorities
         *  then the merge process should be commutative and the order of the items in the array shouldn't matter.
         *  This don't hold iff priority == priority && !(winOnDefault ^ winOnDefault). But there's nothing
         *  we can do about that. But at least in that case we're stable in our merge.
         *  For sanity reasons, we only use 3 items to test our commutative property. Which requires only requires 6
         *  test cases.
         */
        describe('Test commutative merging', function () {

            it('Commutative test #1 [123]', function (done) {
                var merger = require('../lib/coalesce-strategy')(require('./merge-strategies/commutative.json'),
                    songFactory());
                var items = [];

                items.push(merger.createItem('strat',
                    {
                        title: 'Awesome title 1',
                        id: 'Fake id1',
                        artist: 'Fake Artist 1',
                        revenue: 'Fake Revenue 1',
                        rating: 'Fake Rating 1',
                        genre: 'Fake Genre 1',
                        studios: ['Fake Studio 1'],
                        printNothing: true
                    }));

                items.push(merger.createItem('strat2',
                    {
                        title: 'Awesome title 2',
                        id: 'Fake id2',
                        artist: 'Fake Artist 2',
                        revenue: 'Fake Revenue 2',
                        rating: 'Fake Rating 2',
                        genre: 'Fake Genre 2',
                        studios: ['Fake Studio 2'],
                        printNothing: 10
                    }));

                items.push(merger.createItem('strat3',
                    {
                        title: 'Awesome title 3',
                        id: 'Fake id3',
                        artist: 'Fake Artist 3',
                        revenue: 'Fake Revenue 3',
                        rating: 'Fake Rating 3',
                        genre: 'Fake Genre 3',
                        studios: ['Fake Studio 3'],
                        printNothing: false
                    }));

                merger.merge(items, function (err, data) {
                    assert.equal(data.title, 'Awesome title 1');
                    assert.equal(data.artist, 'Fake Artist 2');
                    assert.equal(data.rating, 'Fake Rating 3');
                    assert.equal(data.revenue, 'Fake Revenue 2');
                    assert.equal(data.genre, 'Fake Genre 1');
                    assert.isArray(data.studios, 'should still be an array');
                    assert.equal(data.studios.length, '1');
                    assert.equal(data.studios[0], 'Fake Studio 3');
                    assert.isNotFunction(data.printNothing, 'should no longer be a function');
                    assert.isBoolean(data.printNothing, 'should now be a boolean');
                    assert.isTrue(data.printNothing);
                    assert.isUndefined(data.id, 'should be undefined');
                    done();
                });
            });

            it('Commutative test #2 [132]', function (done) {
                var merger = require('../lib/coalesce-strategy')(require('./merge-strategies/commutative.json'),
                    songFactory());
                var items = [];

                items.push(merger.createItem('strat',
                    {
                        title: 'Awesome title 1',
                        id: 'Fake id1',
                        artist: 'Fake Artist 1',
                        revenue: 'Fake Revenue 1',
                        rating: 'Fake Rating 1',
                        genre: 'Fake Genre 1',
                        studios: ['Fake Studio 1'],
                        printNothing: true
                    }));

                items.push(merger.createItem('strat3',
                    {
                        title: 'Awesome title 3',
                        id: 'Fake id3',
                        artist: 'Fake Artist 3',
                        revenue: 'Fake Revenue 3',
                        rating: 'Fake Rating 3',
                        genre: 'Fake Genre 3',
                        studios: ['Fake Studio 3'],
                        printNothing: false
                    }));

                items.push(merger.createItem('strat2',
                    {
                        title: 'Awesome title 2',
                        id: 'Fake id2',
                        artist: 'Fake Artist 2',
                        revenue: 'Fake Revenue 2',
                        rating: 'Fake Rating 2',
                        genre: 'Fake Genre 2',
                        studios: ['Fake Studio 2'],
                        printNothing: 10
                    }));

                merger.merge(items, function (err, data) {
                    assert.equal(data.title, 'Awesome title 1');
                    assert.equal(data.artist, 'Fake Artist 2');
                    assert.equal(data.rating, 'Fake Rating 3');
                    assert.equal(data.revenue, 'Fake Revenue 2');
                    assert.equal(data.genre, 'Fake Genre 1');
                    assert.isArray(data.studios, 'should still be an array');
                    assert.equal(data.studios.length, '1');
                    assert.equal(data.studios[0], 'Fake Studio 3');
                    assert.isNotFunction(data.printNothing, 'should no longer be a function');
                    assert.isBoolean(data.printNothing, 'should now be a boolean');
                    assert.isTrue(data.printNothing);
                    assert.isUndefined(data.id, 'should be undefined');
                    done();
                });
            });

            it('Commutative test #3 [213]', function (done) {
                var merger = require('../lib/coalesce-strategy')(require('./merge-strategies/commutative.json'),
                    songFactory());
                var items = [];

                items.push(merger.createItem('strat2',
                    {
                        title: 'Awesome title 2',
                        id: 'Fake id2',
                        artist: 'Fake Artist 2',
                        revenue: 'Fake Revenue 2',
                        rating: 'Fake Rating 2',
                        genre: 'Fake Genre 2',
                        studios: ['Fake Studio 2'],
                        printNothing: 10
                    }));

                items.push(merger.createItem('strat',
                    {
                        title: 'Awesome title 1',
                        id: 'Fake id1',
                        artist: 'Fake Artist 1',
                        revenue: 'Fake Revenue 1',
                        rating: 'Fake Rating 1',
                        genre: 'Fake Genre 1',
                        studios: ['Fake Studio 1'],
                        printNothing: true
                    }));

                items.push(merger.createItem('strat3',
                    {
                        title: 'Awesome title 3',
                        id: 'Fake id3',
                        artist: 'Fake Artist 3',
                        revenue: 'Fake Revenue 3',
                        rating: 'Fake Rating 3',
                        genre: 'Fake Genre 3',
                        studios: ['Fake Studio 3'],
                        printNothing: false
                    }));

                merger.merge(items, function (err, data) {
                    assert.equal(data.title, 'Awesome title 1');
                    assert.equal(data.artist, 'Fake Artist 2');
                    assert.equal(data.rating, 'Fake Rating 3');
                    assert.equal(data.revenue, 'Fake Revenue 2');
                    assert.equal(data.genre, 'Fake Genre 1');
                    assert.isArray(data.studios, 'should still be an array');
                    assert.equal(data.studios.length, '1');
                    assert.equal(data.studios[0], 'Fake Studio 3');
                    assert.isNotFunction(data.printNothing, 'should no longer be a function');
                    assert.isBoolean(data.printNothing, 'should now be a boolean');
                    assert.isTrue(data.printNothing);
                    assert.isUndefined(data.id, 'should be undefined');
                    done();
                });
            });

            it('Commutative test #4 [231]', function (done) {
                var merger = require('../lib/coalesce-strategy')(require('./merge-strategies/commutative.json'),
                    songFactory());
                var items = [];

                items.push(merger.createItem('strat2',
                    {
                        title: 'Awesome title 2',
                        id: 'Fake id2',
                        artist: 'Fake Artist 2',
                        revenue: 'Fake Revenue 2',
                        rating: 'Fake Rating 2',
                        genre: 'Fake Genre 2',
                        studios: ['Fake Studio 2'],
                        printNothing: 10
                    }));

                items.push(merger.createItem('strat3',
                    {
                        title: 'Awesome title 3',
                        id: 'Fake id3',
                        artist: 'Fake Artist 3',
                        revenue: 'Fake Revenue 3',
                        rating: 'Fake Rating 3',
                        genre: 'Fake Genre 3',
                        studios: ['Fake Studio 3'],
                        printNothing: false
                    }));

                items.push(merger.createItem('strat',
                    {
                        title: 'Awesome title 1',
                        id: 'Fake id1',
                        artist: 'Fake Artist 1',
                        revenue: 'Fake Revenue 1',
                        rating: 'Fake Rating 1',
                        genre: 'Fake Genre 1',
                        studios: ['Fake Studio 1'],
                        printNothing: true
                    }));

                merger.merge(items, function (err, data) {
                    assert.equal(data.title, 'Awesome title 1');
                    assert.equal(data.artist, 'Fake Artist 2');
                    assert.equal(data.rating, 'Fake Rating 3');
                    assert.equal(data.revenue, 'Fake Revenue 2');
                    assert.equal(data.genre, 'Fake Genre 1');
                    assert.isArray(data.studios, 'should still be an array');
                    assert.equal(data.studios.length, '1');
                    assert.equal(data.studios[0], 'Fake Studio 3');
                    assert.isNotFunction(data.printNothing, 'should no longer be a function');
                    assert.isBoolean(data.printNothing, 'should now be a boolean');
                    assert.isTrue(data.printNothing);
                    assert.isUndefined(data.id, 'should be undefined');
                    done();
                });
            });

            it('Commutative test #5 [312]', function (done) {
                var merger = require('../lib/coalesce-strategy')(require('./merge-strategies/commutative.json'),
                    songFactory());
                var items = [];

                items.push(merger.createItem('strat3',
                    {
                        title: 'Awesome title 3',
                        id: 'Fake id3',
                        artist: 'Fake Artist 3',
                        revenue: 'Fake Revenue 3',
                        rating: 'Fake Rating 3',
                        genre: 'Fake Genre 3',
                        studios: ['Fake Studio 3'],
                        printNothing: false
                    }));

                items.push(merger.createItem('strat',
                    {
                        title: 'Awesome title 1',
                        id: 'Fake id1',
                        artist: 'Fake Artist 1',
                        revenue: 'Fake Revenue 1',
                        rating: 'Fake Rating 1',
                        genre: 'Fake Genre 1',
                        studios: ['Fake Studio 1'],
                        printNothing: true
                    }));

                items.push(merger.createItem('strat2',
                    {
                        title: 'Awesome title 2',
                        id: 'Fake id2',
                        artist: 'Fake Artist 2',
                        revenue: 'Fake Revenue 2',
                        rating: 'Fake Rating 2',
                        genre: 'Fake Genre 2',
                        studios: ['Fake Studio 2'],
                        printNothing: 10
                    }));

                merger.merge(items, function (err, data) {
                    assert.equal(data.title, 'Awesome title 1');
                    assert.equal(data.artist, 'Fake Artist 2');
                    assert.equal(data.rating, 'Fake Rating 3');
                    assert.equal(data.revenue, 'Fake Revenue 2');
                    assert.equal(data.genre, 'Fake Genre 1');
                    assert.isArray(data.studios, 'should still be an array');
                    assert.equal(data.studios.length, '1');
                    assert.equal(data.studios[0], 'Fake Studio 3');
                    assert.isNotFunction(data.printNothing, 'should no longer be a function');
                    assert.isBoolean(data.printNothing, 'should now be a boolean');
                    assert.isTrue(data.printNothing);
                    assert.isUndefined(data.id, 'should be undefined');
                    done();
                });
            });

            it('Commutative test #6 [321]', function (done) {
                var merger = require('../lib/coalesce-strategy')(require('./merge-strategies/commutative.json'),
                    songFactory());
                var items = [];

                items.push(merger.createItem('strat3',
                    {
                        title: 'Awesome title 3',
                        id: 'Fake id3',
                        artist: 'Fake Artist 3',
                        revenue: 'Fake Revenue 3',
                        rating: 'Fake Rating 3',
                        genre: 'Fake Genre 3',
                        studios: ['Fake Studio 3'],
                        printNothing: false
                    }));

                items.push(merger.createItem('strat2',
                    {
                        title: 'Awesome title 2',
                        id: 'Fake id2',
                        artist: 'Fake Artist 2',
                        revenue: 'Fake Revenue 2',
                        rating: 'Fake Rating 2',
                        genre: 'Fake Genre 2',
                        studios: ['Fake Studio 2'],
                        printNothing: 10
                    }));

                items.push(merger.createItem('strat',
                    {
                        title: 'Awesome title 1',
                        id: 'Fake id1',
                        artist: 'Fake Artist 1',
                        revenue: 'Fake Revenue 1',
                        rating: 'Fake Rating 1',
                        genre: 'Fake Genre 1',
                        studios: ['Fake Studio 1'],
                        printNothing: true
                    }));

                merger.merge(items, function (err, data) {
                    assert.equal(data.title, 'Awesome title 1');
                    assert.equal(data.artist, 'Fake Artist 2');
                    assert.equal(data.rating, 'Fake Rating 3');
                    assert.equal(data.revenue, 'Fake Revenue 2');
                    assert.equal(data.genre, 'Fake Genre 1');
                    assert.isArray(data.studios, 'should still be an array');
                    assert.equal(data.studios.length, '1');
                    assert.equal(data.studios[0], 'Fake Studio 3');
                    assert.isNotFunction(data.printNothing, 'should no longer be a function');
                    assert.isBoolean(data.printNothing, 'should now be a boolean');
                    assert.isTrue(data.printNothing);
                    assert.isUndefined(data.id, 'should be undefined');
                    done();
                });
            });
        });

        describe('Bonus tests for winOnDefault', function () {

            it('Test winOnDefault on model', function (done) {
                var strat = {
                    strategies: {
                        'basic-strat': {
                            winOnDefault: false
                        }
                    }
                };

                var merger = require('../lib/coalesce-strategy')(strat, songFactory());
                var items = [];

                items.push(merger.createItem('basic-strat',
                    {
                        title: 'Ignored Title',
                        id: 'Fake id2',
                        artist: 'The FooBars',
                        revenue: '100,000',
                        studios: 10,
                        printNothing: true
                    }));

                items.push(merger.createItem({
                    title: '??',
                    id: 'Fake id',
                    revenue: '130,000',
                    genre: '',
                    rating: 'R',
                    artist: 'some artist',
                    studios: ['something'],
                    printNothing: false
                }));

                merger.merge(items, function (err, data) {
                    assert.equal(data.title, '??');
                    assert.equal(data.artist, 'some artist');
                    assert.equal(data.rating, 'R');
                    assert.equal(data.revenue, '130,000');
                    assert.equal(data.genre, '');
                    assert.isArray(data.studios, 'should still be an array');
                    assert.equal(data.studios.length, '1');
                    assert.equal(data.studios[0], 'something');
                    assert.isBoolean(data.printNothing);
                    assert.isFalse(data.printNothing);
                    assert.isUndefined(data.id, 'should be undefined');
                    done();
                });
            });

            it('Test winOnDefault on model, both false', function (done) {
                var strat = {
                    strategies: {
                        'basic-strat': {
                            winOnDefault: false
                        }
                    }
                };

                var merger = require('../lib/coalesce-strategy')(strat, songFactory());
                var items = [];

                items.push(merger.createItem('basic-strat',
                    {
                        title: 'Ignored Title',
                        id: 'Fake id2',
                        artist: 'The FooBars',
                        revenue: '100,000',
                        studios: 10,
                        printNothing: true
                    }));

                items.push(merger.createItem('basic-strat',
                    {
                        title: '??',
                        id: 'Fake id',
                        revenue: '130,000',
                        genre: '',
                        rating: 'R',
                        artist: 'some artist',
                        studios: ['something'],
                        printNothing: false
                    }));

                merger.merge(items, function (err, data) {
                    assert.equal(data.title, '??');
                    assert.equal(data.artist, 'some artist');
                    assert.equal(data.rating, 'R');
                    assert.equal(data.revenue, '130,000');
                    assert.equal(data.genre, '');
                    assert.isArray(data.studios, 'should still be an array');
                    assert.equal(data.studios.length, '1');
                    assert.equal(data.studios[0], 'something');
                    assert.isBoolean(data.printNothing);
                    assert.isFalse(data.printNothing);
                    assert.isUndefined(data.id, 'should be undefined');
                    done();
                });
            });

        });
    });
});

