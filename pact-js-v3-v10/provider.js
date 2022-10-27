const express = require('express');
const cors = require('cors');

const server = express();
server.use(cors());
server.use((req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8');
  next();
});

server.get('/products/:id', (req, res) => {
  res.json({ id: 1, name: 'aussie', type: 'hamburger', version: '1.0.0' });
});
server.get('/matchers/v2', (req, res) => {
  res.json({
    boolean: true,
    booleanFalse: false,
    booleanTrue: true,
    decimal: 13.01,
    decimalPattern: 10.1,
    eachLikeArray: [[1, 2, 3]],
    eachLikeComplexStructure: [
      [
        {
          colour: 'red',
          size: 10,
          tag: [
            ['jumper', 'shirt'],
            ['jumper', 'shirt']
          ]
        }
      ]
    ],
    eachLikeNested: [['blue']],
    eachLikeNull: [null],
    eachLikeObject: [
      {
        a: 1
      }
    ],
    eachLikeOptionsMinOne: [
      {
        a: 1
      }
    ],
    eachLikeOptionsMinThree: [
      {
        a: 1
      },
      {
        a: 1
      },
      {
        a: 1
      }
    ],
    eachLikeTerm: [
      {
        colour: 'red'
      }
    ],
    eachLikeValue: ['test'],
    eachLikeWithMatchers: [
      {
        id: 10
      }
    ],
    email: 'hello@pact.io',
    emailA: 'hello@world.com',
    emailB: 'hello@world.com.au',
    emailC: 'hello@a.co',
    hexadecimal: '3F',
    hexadecimalPattern: '6F',
    integer: 13,
    integerPattern: 10.1,
    ipv4Address: '127.0.0.13',
    ipv4AddressPattern: '127.0.0.1',
    ipv6Address: '::ffff:192.0.2.128',
    ipv6AddressLoopback: '::1',
    ipv6AddressPattern: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
    iso8601Date: '2013-02-01',
    iso8601DatePattern: '2017-12-05',
    iso8601DateTime: '2015-08-06T16:53:10+01:00',
    iso8601DateTimePattern: '2015-08-06T16:53:10+01:00',
    iso8601DateTimeWithMillis: '2015-08-06T16:53:10.123+01:00',
    iso8601DateTimeWithMillisA: '2020-12-10T09:01:29.1Z',
    iso8601DateTimeWithMillisB: '2020-12-10T09:01:29.06Z',
    iso8601DateTimeWithMillisC: '2015-08-06T16:53:10.537357Z',
    iso8601DateTimeWithMillisD: '2015-08-06T16:53:10.123+01:00',
    iso8601Time: 'T22:44:30.652Z',
    iso8601TimePattern: 'T22:44:30.652Z',
    rfc1123Timestamp: 'Mon, 31 Oct 2016 15:21:41 -0400',
    rfc1123TimestampPattern: 'Mon, 31 Oct 2016 15:21:41 -0400',
    somethingLike: 'myspecialvalue',
    string: 'iloveorange',
    stringPattern: 'test',
    term: 'myawesomeword',
    uuid: 'ce118b6e-d8e1-11e7-9296-cec278b6b50a',
    uuidPattern: 'ce118b6e-d8e1-11e7-9296-cec278b6b50a',
    validateExample: true,
    // complex structure
    anotherStringMatcher: {
      anotherSetting: 'this',
      nestedSetting: {
        anotherStringMatcherSubSetting: true
      }
    },
    arrayMatcher: {
      lotsOfValues: ['useful', 'useful', 'useful']
    },
    arrayOfMatchers: {
      lotsOfValues: [
        {
          baz: 'bat',
          foo: 'bar'
        },
        {
          baz: 'bat',
          foo: 'bar'
        },
        {
          baz: 'bat',
          foo: 'bar'
        }
      ]
    },
    stringMatcher: {
      awesomeSetting: 'a string'
    }
  });
});

server.get('/matchers/v3', (req, res) => {
  res.json({
    boolean: true,
    booleanFalse: false,
    booleanTrue: true,
    decimal: 12.34,
    decimalPattern: 10.1,
    eachLikeArray: [[1, 2, 3]],
    eachLikeComplexStructure: [
      [
        {
          colour: 'red',
          size: 10,
          tag: [
            ['jumper', 'shirt'],
            ['jumper', 'shirt']
          ]
        }
      ]
    ],
    eachLikeNested: [['blue']],
    eachLikeNull: [null],
    eachLikeObject: [
      {
        a: 1
      }
    ],
    eachLikeOptionsMinOne: [
      {
        a: 1
      }
    ],
    eachLikeOptionsMinThree: [
      {
        a: 1
      },
      {
        a: 1
      },
      {
        a: 1
      }
    ],
    eachLikeTerm: [
      {
        colour: 'red'
      }
    ],
    eachLikeValue: ['test'],
    eachLikeWithMatchers: [
      {
        id: 10
      }
    ],
    integer: 101,
    integerPattern: 10,
    like: 'myspecialvalue',
    regex: 'myawesomeword',
    string: 'some string',
    stringPattern: 'test',
    uuid: 'e2490de5-5bd3-43d5-b7c4-526e33f71304',
    uuidPattern: 'ce118b6e-d8e1-11e7-9296-cec278b6b50a',
    // complex structure
    anotherStringMatcher: {
      anotherSetting: 'this',
      nestedSetting: {
        anotherStringMatcherSubSetting: true
      }
    },
    arrayMatcher: {
      lotsOfValues: ['useful', 'useful', 'useful']
    },
    arrayOfMatchers: {
      lotsOfValues: [
        {
          baz: 'bat',
          foo: 'bar'
        },
        {
          baz: 'bat',
          foo: 'bar'
        },
        {
          baz: 'bat',
          foo: 'bar'
        }
      ]
    },
    stringMatcher: {
      awesomeSetting: 'a string'
    }
  });
});

module.exports = {
  server
};
