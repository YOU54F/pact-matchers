const { Verifier } = require('@pact-foundation/pact');
const { server } = require('./provider');

describe('Pact Verification', () => {
  let listener;
  beforeAll(() => {
    listener = server.listen(8081);
  });

  it('validates the expectations of PathProviderService', () => {
    const opts = {
      logLevel: 'INFO',
      providerBaseUrl: 'http://localhost:8081',
      providerVersion: '1.0.0-someprovidersha',
      provider: 'path-provider',
      consumerVersionSelectors: [
        { tag: 'master', latest: true },
        { tag: 'prod', latest: true }
      ],
      pactUrls: [
        './pacts/v2-path-consumer-path-provider.json',
      ],
      enablePending: true,
      stateHandlers: {
        ["an id of 12 exists"]: {
          setup: (parameters) => {
            server.get('/12', (req, res) => {
              res.json({ id: "12", status: "LOOSE_MATCH" });
            });
            return Promise.resolve("Seeded data")
          },
          teardown: (parameters) => {
            // do your teardown here
            // return a promise if you need to
          },
          
        }
      }
    };

    return new Verifier(opts)
      .verifyProvider()
      .then((output) => {
        console.log('Pact Verification Complete!');
        console.log(output);
      })
      .finally(() => listener.close());
  });
});
