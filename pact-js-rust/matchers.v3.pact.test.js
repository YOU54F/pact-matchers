/* tslint:disable:no-unused-expression no-empty object-literal-sort-keys */

// run the following 2 commands in your terminal
//
// npm install @you54f/pact jest axios --save-dev
// $(npm bin)/jest --init
//
// select the following options ( n / node / n / v8 / n )
//
// ✔ Would you like to use Typescript for the configuration file? … no
// ✔ Choose the test environment that will be used for testing › node
// ✔ Do you want Jest to add coverage reports? … no
// ✔ Which provider should be used to instrument code for coverage? › v8
// ✔ Automatically clear mock calls, instances, contexts and results before every test? … no
const axios = require('axios');
const defaultBaseUrl = 'http://your-api.example.com';
const api = (baseUrl = defaultBaseUrl) => ({
  getMatchers: () =>
    axios.get(baseUrl + '/matchers/v3').then((response) => response.data)
  /* other endpoints here */
});

const { PactV3, MatchersV3 } = require('@you54f/pact');
const provider = new PactV3({
  consumer: 'v3-consumer-pact-js',
  provider: 'v3-provider'
});

const {
  eachLike, // doesnt support min prop as per v2
  atLeastLike,
  integer,
  datetime,
  decimal,
  boolean,
  string,
  regex, // exported as term in v2 { generate, matcher } | v3 (pattern: string | RegExp, str: string)
  like, // exported as like in v2,
  eachKeyLike,
  uuid,
  reify // exported as extractPayload in v2,
} = MatchersV3;

describe('showcase pact v3 matchers', () => {
  it('should make a request to test all matchers', () => {
    const responsePayloadWithAllMatchers = {
      regex: regex('\\w+', 'myawesomeword'),
      // validateExample: validateExample('2010-01-01', ISO8601_DATE_FORMAT),
      like: like('myspecialvalue'),
      eachLikeNull: eachLike(null),
      eachLikeObject: eachLike({ a: 1 }),
      eachLikeArray: eachLike([1, 2, 3]),
      eachLikeValue: eachLike('test'),
      eachLikeWithMatchers: eachLike({ id: like(10) }),
      eachLikeTerm: eachLike({
        colour: regex('red|green', 'red')
      }),
      eachLikeNested: eachLike(eachLike('blue')),
      eachLikeComplexStructure: eachLike(
        eachLike({
          colour: regex('red|green|blue', 'red'),
          size: like(10),
          tag: atLeastLike([like('jumper'), like('shirt')], 2)
        })
      ),
      eachLikeOptionsMinOne: eachLike({ a: 1 }),
      eachLikeOptionsMinThree: atLeastLike({ a: 1 }, 3),
      // email: email(),
      // emailA: email('hello@world.com'),
      // emailB: email('hello@world.com.au'),
      // emailC: email('hello@a.co'),
      uuid: uuid(),
      uuidPattern: uuid('ce118b6e-d8e1-11e7-9296-cec278b6b50a'),
      // ipv4Address: ipv4Address(),
      // ipv4AddressPattern: ipv4Address('127.0.0.1'),
      // ipv6Address: ipv6Address(),
      // ipv6AddressPattern: ipv6Address(
      //   '2001:0db8:85a3:0000:0000:8a2e:0370:7334'
      // ),
      // ipv6AddressLoopback: ipv6Address('::1'),
      // hexadecimal: hexadecimal(),
      // hexadecimalPattern: hexadecimal('6F'),
      boolean: boolean(),
      booleanTrue: boolean(true),
      booleanFalse: boolean(false),
      string: string(),
      stringPattern: string('test'),
      decimal: decimal(),
      decimalPattern: decimal(10.1),
      integer: integer(),
      integerPattern: integer(10) // this passes if it is 10.1 using v2 matchers
      // rfc1123Timestamp: rfc1123Timestamp(),
      // rfc1123TimestampPattern: rfc1123Timestamp(
      //   'Mon, 31 Oct 2016 15:21:41 -0400'
      // ),
      // iso8601Time: iso8601Time(),
      // iso8601TimePattern: iso8601Time('T22:44:30.652Z'),
      // iso8601Date: iso8601Date(),
      // iso8601DatePattern: iso8601Date('2017-12-05'),
      // iso8601DateTime: iso8601DateTime(),
      // iso8601DateTimePattern: iso8601DateTime('2015-08-06T16:53:10+01:00'),
      // iso8601DateTimeWithMillis: iso8601DateTimeWithMillis(),
      // iso8601DateTimeWithMillisA: iso8601DateTimeWithMillis(
      //   '2020-12-10T09:01:29.1Z'
      // ),
      // iso8601DateTimeWithMillisB: iso8601DateTimeWithMillis(
      //   '2020-12-10T09:01:29.06Z'
      // ),
      // iso8601DateTimeWithMillisC: iso8601DateTimeWithMillis(
      //   '2015-08-06T16:53:10.537357Z'
      // ),
      // iso8601DateTimeWithMillisD: iso8601DateTimeWithMillis(
      //   '2015-08-06T16:53:10.123+01:00'
      // )
    };

    const expected = {
      regex: 'myawesomeword',
      // validateExample: true,
      like: 'myspecialvalue',
      eachLikeNull: [null],
      eachLikeObject: [{ a: 1 }],
      eachLikeArray: [[1, 2, 3]],
      eachLikeValue: ['test'],
      eachLikeWithMatchers: [{ id: 10 }],
      eachLikeTerm: [{ colour: 'red' }],
      eachLikeNested: [['blue']],
      eachLikeComplexStructure: [
        [
          {
            colour: 'red',
            size: 10,
            tag: [
              ['jumper', 'shirt'], // expected  [['jumper', 'shirt'],  ['jumper', 'shirt']], has min 2 prop on eachLike
              ['jumper', 'shirt']
            ] // renamed to atLeastLike
          }
        ]
      ],
      eachLikeOptionsMinOne: [{ a: 1 }],
      eachLikeOptionsMinThree: [{ a: 1 }, { a: 1 }, { a: 1 }], // renamed eachLike to atLeastLike
      // email: 'hello@pact.io',
      // emailA: 'hello@world.com',
      // emailB: 'hello@world.com.au',
      // emailC: 'hello@a.co',
      uuid: expect.any(String),
      uuidPattern: 'ce118b6e-d8e1-11e7-9296-cec278b6b50a',
      // ipv4Address: '127.0.0.13',
      // ipv4AddressPattern: '127.0.0.1',
      // ipv6Address: '::ffff:192.0.2.128',
      // ipv6AddressPattern: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
      // ipv6AddressLoopback: '::1',
      // hexadecimal: '3F',
      // hexadecimalPattern: '6F',
      boolean: true,
      booleanTrue: true,
      booleanFalse: false,
      string: 'some string', // iloveorange in v2
      stringPattern: 'test',
      decimal: expect.any(Number),
      decimalPattern: 10.1,
      integer: expect.any(Number),
      integerPattern: 10
      // rfc1123Timestamp: 'Mon, 31 Oct 2016 15:21:41 -0400',
      // rfc1123TimestampPattern: 'Mon, 31 Oct 2016 15:21:41 -0400',
      // iso8601Time: 'T22:44:30.652Z',
      // iso8601TimePattern: 'T22:44:30.652Z',
      // iso8601Date: '2013-02-01',
      // iso8601DatePattern: '2017-12-05',
      // iso8601DateTime: '2015-08-06T16:53:10+01:00',
      // iso8601DateTimePattern: '2015-08-06T16:53:10+01:00',
      // iso8601DateTimeWithMillis: '2015-08-06T16:53:10.123+01:00',
      // iso8601DateTimeWithMillisA: '2020-12-10T09:01:29.1Z',
      // iso8601DateTimeWithMillisB: '2020-12-10T09:01:29.06Z',
      // iso8601DateTimeWithMillisC: '2015-08-06T16:53:10.537357Z',
      // iso8601DateTimeWithMillisD: '2015-08-06T16:53:10.123+01:00'
    };

    provider
      .given('Server is V3')
      .uponReceiving('A request for get all v3 matchers')
      .withRequest({
        method: 'GET',
        path: '/matchers/v3'
      })
      .willRespondWith({
        status: 200,
        body: responsePayloadWithAllMatchers
      });
    // console.log(reify(responsePayloadWithAllMatchers.eachLikeComplexStructure));
    // Configure your client under test to use the Pact mock service URL
    return provider.executeTest((mockserver) => {
      const client = api(mockserver.url);
      return client.getMatchers().then((data) => {
        expect(data).toEqual(expected);
      });
    });
  });

  it('should make a request to test a complex structure', () => {
    const responsePayloadWithSomeMatchers = like({
      stringMatcher: {
        awesomeSetting: like('a string')
      },
      anotherStringMatcher: {
        nestedSetting: {
          anotherStringMatcherSubSetting: like(true)
        },
        anotherSetting: regex('this|that', 'this')
      },
      arrayMatcher: {
        lotsOfValues: atLeastLike('useful', 3)
      },
      arrayOfMatchers: {
        lotsOfValues: atLeastLike(
          {
            foo: 'bar',
            baz: like('bat')
          },
          3
        )
      }
    });

    const expected = {
      stringMatcher: {
        awesomeSetting: 'a string'
      },
      anotherStringMatcher: {
        nestedSetting: {
          anotherStringMatcherSubSetting: true
        },
        anotherSetting: 'this'
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
      }
    };

    provider
      .given('Server is V3')
      .uponReceiving('A request for get some v3 matchers')
      .withRequest({
        method: 'GET',
        path: '/matchers/v3'
      })
      .willRespondWith({
        status: 200,
        body: responsePayloadWithSomeMatchers
      });
    // console.log(reify(responsePayloadWithSomeMatchers));

    // Configure your client under test to use the Pact mock service URL
    return provider.executeTest((mockserver) => {
      const client = api(mockserver.url);
      return client.getMatchers().then((data) => {
        expect(data).toEqual(expected);
      });
    });
  });
});

// describe('V3 Matchers', () => {
//   describe('#like', () => {
//     it('returns a JSON representation of a like matcher', () => {
//       const result = MatchersV3.like({
//         a: 'b',
//       });
//       expect(result).to.deep.equal({
//         'pact:matcher:type': 'type',
//         value: {
//           a: 'b',
//         },
//       });
//     });
//   });

//   describe('#eachKeylike', () => {
//     it('returns a JSON representation of an eachKeyLike matcher', () => {
//       const result = MatchersV3.eachKeyLike('004', {
//         id: '004',
//       });
//       expect(result).to.deep.equal({
//         'pact:matcher:type': 'values',
//         value: {
//           '004': {
//             id: '004',
//           },
//         },
//       });
//     });
//   });

//   describe('#eachLike', () => {
//     it('returns a JSON representation of an eachLike matcher', () => {
//       const result = MatchersV3.eachLike({
//         a: 'b',
//       });
//       expect(result).to.deep.equal({
//         'pact:matcher:type': 'type',
//         value: [
//           {
//             a: 'b',
//           },
//         ],
//       });
//     });
//   });

//   describe('#atLeastOneLike', () => {
//     describe('with no examples', () => {
//       it('returns a JSON representation of an atLeastOneLike matcher', () => {
//         const result = MatchersV3.atLeastOneLike({
//           a: 'b',
//         });
//         expect(result).to.deep.equal({
//           'pact:matcher:type': 'type',
//           min: 1,
//           value: [
//             {
//               a: 'b',
//             },
//           ],
//         });
//       });
//     });

//     describe('when provided examples', () => {
//       it('returns a JSON representation of an atLeastOneLike matcher with the correct number of examples', () => {
//         const result = MatchersV3.atLeastOneLike(
//           {
//             a: 'b',
//           },
//           4
//         );
//         expect(result).to.deep.equal({
//           'pact:matcher:type': 'type',
//           min: 1,
//           value: [{ a: 'b' }, { a: 'b' }, { a: 'b' }, { a: 'b' }],
//         });
//       });
//     });
//   });

//   describe('#atLeastLike', () => {
//     describe('with no examples', () => {
//       it('returns a JSON representation of an atLeastLike matcher', () => {
//         const result = MatchersV3.atLeastLike(
//           {
//             a: 'b',
//           },
//           2
//         );
//         expect(result).to.deep.equal({
//           'pact:matcher:type': 'type',
//           min: 2,
//           value: [{ a: 'b' }, { a: 'b' }],
//         });
//       });
//     });

//     describe('when provided examples', () => {
//       it('returns a JSON representation of an atLeastLike matcher with the correct number of examples', () => {
//         const result = MatchersV3.atLeastLike(
//           {
//             a: 'b',
//           },
//           2,
//           4
//         );
//         expect(result).to.deep.equal({
//           'pact:matcher:type': 'type',
//           min: 2,
//           value: [{ a: 'b' }, { a: 'b' }, { a: 'b' }, { a: 'b' }],
//         });
//       });
//     });

//     it('throws an error if the number of examples is less than the minimum', () => {
//       expect(() => MatchersV3.atLeastLike({ a: 'b' }, 4, 2)).to.throw(
//         'atLeastLike has a minimum of 4 but 2 elements were requested. Make sure the count is greater than or equal to the min.'
//       );
//     });
//   });

//   describe('#atMostLike', () => {
//     describe('with no examples', () => {
//       it('returns a JSON representation of an atMostLike matcher', () => {
//         const result = MatchersV3.atMostLike(
//           {
//             a: 'b',
//           },
//           2
//         );
//         expect(result).to.deep.equal({
//           'pact:matcher:type': 'type',
//           max: 2,
//           value: [{ a: 'b' }],
//         });
//       });
//     });

//     describe('when provided examples', () => {
//       it('returns a JSON representation of an atMostLike matcher with the correct number of examples', () => {
//         const result = MatchersV3.atMostLike(
//           {
//             a: 'b',
//           },
//           4,
//           4
//         );
//         expect(result).to.deep.equal({
//           'pact:matcher:type': 'type',
//           max: 4,
//           value: [{ a: 'b' }, { a: 'b' }, { a: 'b' }, { a: 'b' }],
//         });
//       });
//     });

//     it('throws an error if the number of examples is more than the maximum', () => {
//       expect(() => MatchersV3.atMostLike({ a: 'b' }, 2, 4)).to.throw(
//         'atMostLike has a maximum of 2 but 4 elements where requested. Make sure the count is less than or equal to the max.'
//       );
//     });
//   });

//   describe('#constrainedArrayLike', () => {
//     describe('with no examples', () => {
//       it('returns a JSON representation of an constrainedArrayLike matcher', () => {
//         const result = MatchersV3.constrainedArrayLike(
//           {
//             a: 'b',
//           },
//           2,
//           4
//         );
//         expect(result).to.deep.equal({
//           'pact:matcher:type': 'type',
//           min: 2,
//           max: 4,
//           value: [{ a: 'b' }, { a: 'b' }],
//         });
//       });
//     });

//     describe('when provided examples', () => {
//       it('returns a JSON representation of an constrainedArrayLike matcher with the correct number of examples', () => {
//         const result = MatchersV3.constrainedArrayLike(
//           {
//             a: 'b',
//           },
//           2,
//           4,
//           3
//         );
//         expect(result).to.deep.equal({
//           'pact:matcher:type': 'type',
//           min: 2,
//           max: 4,
//           value: [{ a: 'b' }, { a: 'b' }, { a: 'b' }],
//         });
//       });
//     });

//     it('throws an error if the number of examples is less than the minimum', () => {
//       expect(() =>
//         MatchersV3.constrainedArrayLike({ a: 'b' }, 4, 6, 2)
//       ).to.throw(
//         'constrainedArrayLike has a minimum of 4 but 2 elements where requested. Make sure the count is greater than or equal to the min.'
//       );
//     });

//     it('throws an error if the number of examples is more than the maximum', () => {
//       expect(() =>
//         MatchersV3.constrainedArrayLike({ a: 'b' }, 4, 6, 8)
//       ).to.throw(
//         'constrainedArrayLike has a maximum of 6 but 8 elements where requested. Make sure the count is less than or equal to the max.'
//       );
//     });
//   });

//   describe('#integer', () => {
//     it('returns a JSON representation of an integer matcher', () => {
//       const result = MatchersV3.integer(100);
//       expect(result).to.deep.equal({
//         'pact:matcher:type': 'integer',
//         value: 100,
//       });
//     });

//     describe('when the example is zero', () => {
//       it('returns a JSON representation of an integer matcher', () => {
//         const result = MatchersV3.integer(0);
//         expect(result).to.deep.equal({
//           'pact:matcher:type': 'integer',
//           value: 0,
//         });
//       });
//     });

//     describe('when no example is given', () => {
//       it('also includes a random integer generator', () => {
//         const result = MatchersV3.integer();
//         expect(result).to.deep.equal({
//           'pact:matcher:type': 'integer',
//           'pact:generator:type': 'RandomInt',
//           value: 101,
//         });
//       });
//     });
//   });

//   describe('#decimal', () => {
//     it('returns a JSON representation of an decimal matcher', () => {
//       const result = MatchersV3.decimal(100.3);
//       expect(result).to.deep.equal({
//         'pact:matcher:type': 'decimal',
//         value: 100.3,
//       });
//     });

//     describe('when the example is zero', () => {
//       it('returns a JSON representation of an integer matcher', () => {
//         const result = MatchersV3.decimal(0.0);
//         expect(result).to.deep.equal({
//           'pact:matcher:type': 'decimal',
//           value: 0.0,
//         });
//       });
//     });

//     describe('when no example is given', () => {
//       it('also includes a random decimal generator', () => {
//         const result = MatchersV3.decimal();
//         expect(result).to.deep.equal({
//           'pact:matcher:type': 'decimal',
//           'pact:generator:type': 'RandomDecimal',
//           value: 12.34,
//         });
//       });
//     });
//   });

//   describe('#number', () => {
//     it('returns a JSON representation of an number matcher', () => {
//       const result = MatchersV3.number(100.3);
//       expect(result).to.deep.equal({
//         'pact:matcher:type': 'number',
//         value: 100.3,
//       });
//     });

//     describe('when no example is given', () => {
//       it('also includes a random integer generator', () => {
//         const result = MatchersV3.number();
//         expect(result).to.deep.equal({
//           'pact:matcher:type': 'number',
//           'pact:generator:type': 'RandomInt',
//           value: 1234,
//         });
//       });
//     });
//   });

//   describe('#boolean', () => {
//     it('returns a JSON representation of a like matcher', () => {
//       const result = MatchersV3.boolean(true);
//       expect(result).to.deep.equal({
//         'pact:matcher:type': 'type',
//         value: true,
//       });
//     });
//   });

//   describe('#string', () => {
//     it('returns a JSON representation of a like matcher', () => {
//       const result = MatchersV3.string('true');
//       expect(result).to.deep.equal({
//         'pact:matcher:type': 'type',
//         value: 'true',
//       });
//     });
//   });

//   describe('#regex', () => {
//     it('returns a JSON representation of a regex matcher', () => {
//       const result = MatchersV3.regex('\\d+', '1234');
//       expect(result).to.deep.equal({
//         'pact:matcher:type': 'regex',
//         regex: '\\d+',
//         value: '1234',
//       });
//     });

//     describe('when given a regular expression', () => {
//       it('returns a JSON representation of a regex matcher', () => {
//         const result = MatchersV3.regex(/\d+/, '1234');
//         expect(result).to.deep.equal({
//           'pact:matcher:type': 'regex',
//           regex: '\\d+',
//           value: '1234',
//         });
//       });
//     });
//   });

//   describe('#equal', () => {
//     it('returns a JSON representation of an equality matcher', () => {
//       const result = MatchersV3.equal('true');
//       expect(result).to.deep.equal({
//         'pact:matcher:type': 'equality',
//         value: 'true',
//       });
//     });
//   });

//   describe('#datetime', () => {
//     describe('when an example is given', () => {
//       it('returns a JSON representation of a datetime matcher', () => {
//         const result = MatchersV3.datetime(
//           "yyyy-MM-dd'T'HH:mm:ss.SSSX",
//           '2016-02-11T09:46:56.023Z'
//         );
//         expect(result).to.deep.equal({
//           'pact:matcher:type': 'timestamp',
//           format: "yyyy-MM-dd'T'HH:mm:ss.SSSX",
//           value: '2016-02-11T09:46:56.023Z',
//         });
//       });
//     });
//   });

//   describe('#time', () => {
//     it('returns a JSON representation of a time matcher', () => {
//       const result = MatchersV3.time('HH:mm:ss', '09:46:56');
//       expect(result).to.deep.equal({
//         'pact:generator:type': 'Time',
//         'pact:matcher:type': 'time',
//         format: 'HH:mm:ss',
//         value: '09:46:56',
//       });
//     });
//   });

//   describe('#date', () => {
//     it('returns a JSON representation of a date matcher', () => {
//       const result = MatchersV3.date('yyyy-MM-dd', '2016-02-11');
//       expect(result).to.deep.equal({
//         'pact:generator:type': 'Date',
//         'pact:matcher:type': 'date',
//         format: 'yyyy-MM-dd',
//         value: '2016-02-11',
//       });
//     });
//   });

//   describe('#includes', () => {
//     it('returns a JSON representation of an include matcher', () => {
//       const result = MatchersV3.includes('true');
//       expect(result).to.deep.equal({
//         'pact:matcher:type': 'include',
//         value: 'true',
//       });
//     });
//   });

//   describe('#nullValue', () => {
//     it('returns a JSON representation of an null matcher', () => {
//       const result = MatchersV3.nullValue();
//       expect(result).to.deep.equal({
//         'pact:matcher:type': 'null',
//       });
//     });
//   });

//   describe('#url', () => {
//     it('returns a JSON representation of a regex matcher for the URL', () => {
//       const result = MatchersV3.url2('http://localhost:8080', [
//         'users',
//         '1234',
//         'posts',
//         'latest',
//       ]);
//       expect(result).to.deep.equal({
//         'pact:matcher:type': 'regex',
//         regex: '.*(\\/users\\/1234\\/posts\\/latest)$',
//         value: 'http://localhost:8080/users/1234/posts/latest',
//       });
//     });

//     describe('when provided with a regex matcher', () => {
//       it('returns a JSON representation of a regex matcher for the URL', () => {
//         const result = MatchersV3.url2('http://localhost:8080', [
//           'users',
//           MatchersV3.regex('\\d+', '1234'),
//           'posts',
//           'latest',
//         ]);
//         expect(result).to.deep.equal({
//           'pact:matcher:type': 'regex',
//           regex: '.*(\\/users\\/\\d+\\/posts\\/latest)$',
//           value: 'http://localhost:8080/users/1234/posts/latest',
//         });
//       });
//     });

//     describe('when provided with a regular expression', () => {
//       it('returns a JSON representation of a regex matcher for the URL', () => {
//         const result = MatchersV3.url2('http://localhost:8080', [
//           'users',
//           /\d+/,
//           'posts',
//           'latest',
//         ]);
//         expect(result).to.deep.contain({
//           'pact:matcher:type': 'regex',
//           regex: '.*(\\/users\\/\\d+\\/posts\\/latest)$',
//         });
//         expect(result.value).to.match(/\/users\/\d+\/posts\/latest$/);
//       });
//     });

//     describe('when no base URL is provided', () => {
//       it('returns regex matcher and a MockServerURL generator', () => {
//         const result = MatchersV3.url([
//           'users',
//           MatchersV3.regex('\\d+', '1234'),
//           'posts',
//           'latest',
//         ]);
//         expect(result).to.deep.equal({
//           'pact:matcher:type': 'regex',
//           'pact:generator:type': 'MockServerURL',
//           regex: '.*(\\/users\\/\\d+\\/posts\\/latest)$',
//           value: 'http://localhost:8080/users/1234/posts/latest',
//           example: 'http://localhost:8080/users/1234/posts/latest',
//         });
//       });
//     });
//   });

//   describe('#uuid', () => {
//     it('returns a JSON representation of an regex matcher for UUIDs', () => {
//       const result = MatchersV3.uuid('ba4bd1bc-5556-11eb-9286-d71bc5b507be');
//       expect(result).to.deep.equal({
//         'pact:matcher:type': 'regex',
//         regex: '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}',
//         value: 'ba4bd1bc-5556-11eb-9286-d71bc5b507be',
//       });
//     });

//     it('throws an exception if the example value does not match the UUID regex', () => {
//       expect(() => MatchersV3.uuid('not a uuid')).to.throw();
//       expect(() => MatchersV3.uuid('ba4bd1bc-5556-11eb-9286')).to.throw();
//       expect(() =>
//         MatchersV3.uuid('ba4bd1bc-5556-11eb-9286-d71bc5b507be-1234')
//       ).to.throw();
//     });

//     it('if no example is provided, it sets up a generator', () => {
//       const result = MatchersV3.uuid();
//       expect(result).to.deep.equal({
//         'pact:matcher:type': 'regex',
//         'pact:generator:type': 'Uuid',
//         regex: '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}',
//         value: 'e2490de5-5bd3-43d5-b7c4-526e33f71304',
//       });
//     });
//   });

//   describe('#reify', () => {
//     describe('when given an object with no matchers', () => {
//       const object = {
//         some: 'data',
//         more: 'strings',
//         an: ['array'],
//         someObject: {
//           withData: true,
//           withNumber: 1,
//         },
//       };

//       it('returns just that object', () => {
//         expect(MatchersV3.reify(object)).to.deep.equal(object);
//       });
//     });

//     describe('when given an object with null values', () => {
//       const object = {
//         some: 'data',
//         more: null,
//         an: [null],
//         someObject: {
//           withData: true,
//           withNumber: 1,
//           andNull: null,
//         },
//       };

//       it('returns just that object', () => {
//         expect(MatchersV3.reify(object)).to.deep.equal(object);
//       });
//     });

//     describe('when given an object with some matchers', () => {
//       const someMatchers = {
//         some: MatchersV3.like('data'),
//         more: 'strings',
//         an: ['array'],
//         another: MatchersV3.eachLike('this'),
//         someObject: {
//           withData: MatchersV3.like(true),
//           withTerm: MatchersV3.regex('this|that', 'this'),
//           withNumber: 1,
//           withAnotherNumber: MatchersV3.like(2),
//         },
//       };

//       const expected = {
//         some: 'data',
//         more: 'strings',
//         an: ['array'],
//         another: ['this'],
//         someObject: {
//           withData: true,
//           withTerm: 'this',
//           withNumber: 1,
//           withAnotherNumber: 2,
//         },
//       };

//       it('returns without matching guff', () => {
//         expect(MatchersV3.reify(someMatchers)).to.deep.equal(expected);
//       });
//     });

//     describe('when given a simple matcher', () => {
//       it('removes all matching guff', () => {
//         const expected = 'myawesomeword';

//         const matcher = MatchersV3.regex('\\w+', 'myawesomeword');

//         expect(MatchersV3.isMatcher(matcher)).to.eq(true);
//         expect(MatchersV3.reify(matcher)).to.eql(expected);
//       });
//     });
//     describe('when given a complex nested object with matchers', () => {
//       it('removes all matching guff', () => {
//         const o = MatchersV3.like({
//           stringMatcher: {
//             awesomeSetting: MatchersV3.like('a string'),
//           },
//           anotherStringMatcher: {
//             nestedSetting: {
//               anotherStringMatcherSubSetting: MatchersV3.like(true),
//             },
//             anotherSetting: MatchersV3.regex('this|that', 'this'),
//           },
//           arrayMatcher: {
//             lotsOfValueregex: MatchersV3.atLeastOneLike('useful', 3),
//           },
//           arrayOfMatcherregex: {
//             lotsOfValueregex: MatchersV3.atLeastOneLike(
//               {
//                 foo: 'bar',
//                 baz: MatchersV3.like('bat'),
//               },
//               3
//             ),
//           },
//         });

//         const expected = {
//           stringMatcher: {
//             awesomeSetting: 'a string',
//           },
//           anotherStringMatcher: {
//             nestedSetting: {
//               anotherStringMatcherSubSetting: true,
//             },
//             anotherSetting: 'this',
//           },
//           arrayMatcher: {
//             lotsOfValueregex: ['useful', 'useful', 'useful'],
//           },
//           arrayOfMatcherregex: {
//             lotsOfValueregex: [
//               {
//                 baz: 'bat',
//                 foo: 'bar',
//               },
//               {
//                 baz: 'bat',
//                 foo: 'bar',
//               },
//               {
//                 baz: 'bat',
//                 foo: 'bar',
//               },
//             ],
//           },
//         };

//         expect(MatchersV3.reify(o)).to.deep.equal(expected);
//       });
//     });
//   });
// });
