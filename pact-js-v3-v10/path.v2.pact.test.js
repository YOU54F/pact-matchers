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
  getRequest: (path) =>
    axios.get(baseUrl + path).then((response) => response.data)
  /* other endpoints here */
});

const { Pact, Matchers } = require('@pact-foundation/pact');
const provider = new Pact({
  consumer: 'v2-path-consumer',
  provider: 'path-provider'
});

const {
  term,
} = Matchers;
describe('GET /request/path/:requestId', () => {
  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  it('should return a status LOOSE_MATCH for any request id bar 2', () => {
    const requestId = '12';
    const requestPath = `/request/path/${requestId}`;

    const expectedBody = {
      id: requestId,
      status: 'LOOSE_MATCH'
    };

    const interaction = {
      state: `an id of ${requestId} exists`,
      uponReceiving: `a GET to ${requestPath}`,
      withRequest: {
        method: 'GET',
        path: term({
          generate: requestPath,
          matcher: '/request/path/(?![2]$)\\d+'
        })
      },
      willRespondWith: {
        body: expectedBody,
        headers: {
          'Content-Type': 'application/json'
        },
        status: 200
      }
    };

    provider.addInteraction(interaction);


    // Configure your client under test to use the Pact mock service URL
    const client = api(provider.mockService.baseUrl);
    return client.getRequest(requestPath).then((data) => {
      expect(data).toEqual(expectedBody);
    });
  });

  it('should return a status RIGID_MATCH for only requestId 1', () => {
    const requestId = '1';
    const requestPath = `/request/path/${requestId}`;

    const expectedBody = {
      id: requestId,
      status: 'RIGID_MATCH'
    };

    const interaction = {
      state: `an id of ${requestId} exists`,
      uponReceiving: `a GET to ${requestPath}`,
      withRequest: {
        method: 'GET',
        path: requestPath
      },
      willRespondWith: {
        body: expectedBody,
        headers: {
          'Content-Type': 'application/json'
        },
        status: 200
      }
    };

    provider.addInteraction(interaction);


    // Configure your client under test to use the Pact mock service URL
    const client = api(provider.mockService.baseUrl);
    return client.getRequest(requestPath).then((data) => {
      expect(data).toEqual(expectedBody);
    });
  });

});
