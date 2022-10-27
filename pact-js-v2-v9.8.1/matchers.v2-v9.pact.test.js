/* tslint:disable:no-unused-expression no-empty object-literal-sort-keys */

// run the following 2 commands in your terminal
//
// npm install @pact-foundation/pact jest axios --save-dev
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
    axios.get(baseUrl + '/matchers/v2').then((response) => response.data)
  /* other endpoints here */
});

const { Pact, Matchers } = require('@pact-foundation/pact');
const provider = new Pact({
  consumer: 'v2-consumer-pact-js-v9',
  provider: 'v2-provider'
});

const {
  boolean,
  decimal,
  eachLike,
  hexadecimal,
  integer,
  ipv4Address,
  ipv6Address,
  ISO8601_DATE_FORMAT,
  iso8601Date,
  iso8601DateTime,
  iso8601DateTimeWithMillis,
  iso8601Time,
  rfc3339Timestamp,
  somethingLike,
  string,
  term,
  email,
  uuid,
  validateExample,
  extractPayload
  //   isMatcher
} = Matchers;
describe('showcase pact v2 matchers', () => {
  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  it('should make a request to test all matchers', () => {
    const responsePayloadWithAllMatchers = {
      term: term({
        generate: 'myawesomeword',
        matcher: '\\w+'
      }),
      validateExample: validateExample('2010-01-01', ISO8601_DATE_FORMAT),
      somethingLike: somethingLike('myspecialvalue'),
      eachLikeNull: eachLike(null, { min: 1 }),
      eachLikeObject: eachLike({ a: 1 }, { min: 1 }),
      eachLikeArray: eachLike([1, 2, 3], { min: 1 }),
      eachLikeValue: eachLike('test', { min: 1 }),
      eachLikeWithMatchers: eachLike({ id: somethingLike(10) }, { min: 1 }),
      eachLikeTerm: eachLike(
        {
          colour: term({
            generate: 'red',
            matcher: 'red|green'
          })
        },
        { min: 1 }
      ),
      eachLikeNested: eachLike(eachLike('blue', { min: 1 }), { min: 1 }),
      eachLikeComplexStructure: eachLike(
        eachLike(
          {
            colour: term({ generate: 'red', matcher: 'red|green|blue' }),
            size: somethingLike(10),
            tag: eachLike([somethingLike('jumper'), somethingLike('shirt')], {
              min: 2
            })
          },
          { min: 1 }
        ),
        { min: 1 }
      ),
      eachLikeOptionsMinOne: eachLike({ a: 1 }),
      eachLikeOptionsMinThree: eachLike({ a: 1 }, { min: 3 }),
      email: email(),
      emailA: email('hello@world.com'),
      emailB: email('hello@world.com.au'),
      emailC: email('hello@a.co'),
      uuid: uuid(),
      uuidPattern: uuid('ce118b6e-d8e1-11e7-9296-cec278b6b50a'),
      ipv4Address: ipv4Address(),
      ipv4AddressPattern: ipv4Address('127.0.0.1'),
      ipv6Address: ipv6Address(),
      ipv6AddressPattern: ipv6Address(
        '2001:0db8:85a3:0000:0000:8a2e:0370:7334'
      ),
      ipv6AddressLoopback: ipv6Address('::1'),
      hexadecimal: hexadecimal(),
      hexadecimalPattern: hexadecimal('6F'),
      boolean: boolean(),
      booleanTrue: boolean(true),
      booleanFalse: boolean(false),
      string: string(),
      stringPattern: string('test'),
      decimal: decimal(),
      decimalPattern: decimal(10.1),
      integer: integer(),
      integerPattern: integer(10.1),
      rfc3339Timestamp: rfc3339Timestamp(),
      rfc3339TimestampPattern: rfc3339Timestamp(
        'Mon, 31 Oct 2016 15:21:41 -0400'
      ),
      iso8601Time: iso8601Time(),
      iso8601TimePattern: iso8601Time('T22:44:30.652Z'),
      iso8601Date: iso8601Date(),
      iso8601DatePattern: iso8601Date('2017-12-05'),
      iso8601DateTime: iso8601DateTime(),
      iso8601DateTimePattern: iso8601DateTime('2015-08-06T16:53:10+01:00'),
      iso8601DateTimeWithMillis: iso8601DateTimeWithMillis(),
      iso8601DateTimeWithMillisA: iso8601DateTimeWithMillis(
        '2020-12-10T09:01:29.1Z'
      ),
      iso8601DateTimeWithMillisB: iso8601DateTimeWithMillis(
        '2020-12-10T09:01:29.06Z'
      ),
      iso8601DateTimeWithMillisC: iso8601DateTimeWithMillis(
        '2015-08-06T16:53:10.537357Z'
      ),
      iso8601DateTimeWithMillisD: iso8601DateTimeWithMillis(
        '2015-08-06T16:53:10.123+01:00'
      )
    };

    const expected = {
      term: 'myawesomeword',
      validateExample: true,
      somethingLike: 'myspecialvalue',
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
              ['jumper', 'shirt'],
              ['jumper', 'shirt']
            ]
          }
        ]
      ],
      eachLikeOptionsMinOne: [{ a: 1 }],
      eachLikeOptionsMinThree: [{ a: 1 }, { a: 1 }, { a: 1 }],
      email: 'hello@pact.io',
      emailA: 'hello@world.com',
      emailB: 'hello@world.com.au',
      emailC: 'hello@a.co',
      uuid: 'ce118b6e-d8e1-11e7-9296-cec278b6b50a',
      uuidPattern: 'ce118b6e-d8e1-11e7-9296-cec278b6b50a',
      ipv4Address: '127.0.0.13',
      ipv4AddressPattern: '127.0.0.1',
      ipv6Address: '::ffff:192.0.2.128',
      ipv6AddressPattern: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
      ipv6AddressLoopback: '::1',
      hexadecimal: '3F',
      hexadecimalPattern: '6F',
      boolean: true,
      booleanTrue: true,
      booleanFalse: false,
      string: 'iloveorange',
      stringPattern: 'test',
      decimal: 13.01,
      decimalPattern: 10.1,
      integer: 13,
      integerPattern: 10.1,
      rfc3339Timestamp: 'Mon, 31 Oct 2016 15:21:41 -0400',
      rfc3339TimestampPattern: 'Mon, 31 Oct 2016 15:21:41 -0400',
      iso8601Time: 'T22:44:30.652Z',
      iso8601TimePattern: 'T22:44:30.652Z',
      iso8601Date: '2013-02-01',
      iso8601DatePattern: '2017-12-05',
      iso8601DateTime: '2015-08-06T16:53:10+01:00',
      iso8601DateTimePattern: '2015-08-06T16:53:10+01:00',
      iso8601DateTimeWithMillis: '2015-08-06T16:53:10.123+01:00',
      iso8601DateTimeWithMillisA: '2020-12-10T09:01:29.1Z',
      iso8601DateTimeWithMillisB: '2020-12-10T09:01:29.06Z',
      iso8601DateTimeWithMillisC: '2015-08-06T16:53:10.537357Z',
      iso8601DateTimeWithMillisD: '2015-08-06T16:53:10.123+01:00'
    };

    provider.addInteraction({
      state: 'Server is V2',
      uponReceiving: 'A request for get all v2 matchers',
      withRequest: {
        method: 'GET',
        path: '/matchers/v2'
      },
      willRespondWith: {
        status: 200,
        body: responsePayloadWithAllMatchers
      }
    });

    // Configure your client under test to use the Pact mock service URL
    const client = api(provider.mockService.baseUrl);
    // console.log(
    //   extractPayload(responsePayloadWithAllMatchers.eachLikeComplexStructure)
    // );
    return client.getMatchers().then((data) => {
      expect(data).toEqual(expected);
    });
  });

  it('should make a request to test a complex structure', () => {
    const responsePayloadWithSomeMatchers = somethingLike({
      stringMatcher: {
        awesomeSetting: somethingLike('a string')
      },
      anotherStringMatcher: {
        nestedSetting: {
          anotherStringMatcherSubSetting: somethingLike(true)
        },
        anotherSetting: term({ generate: 'this', matcher: 'this|that' })
      },
      arrayMatcher: {
        lotsOfValues: eachLike('useful', { min: 3 })
      },
      arrayOfMatchers: {
        lotsOfValues: eachLike(
          {
            foo: 'bar',
            baz: somethingLike('bat')
          },
          { min: 3 }
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

    provider.addInteraction({
      state: 'Server is V2',
      uponReceiving: 'A request for get some v2 matchers',
      withRequest: {
        method: 'GET',
        path: '/matchers/v2'
      },
      willRespondWith: {
        status: 200,
        body: responsePayloadWithSomeMatchers
      }
    });
    // console.log(extractPayload(responsePayloadWithSomeMatchers));

    // Configure your client under test to use the Pact mock service URL
    const client = api(provider.mockService.baseUrl);
    return client.getMatchers().then((data) => {
      expect(data).toEqual(expected);
    });
  });
});
