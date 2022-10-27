const { Verifier } = require('@pact-foundation/pact');
const { server } = require('./provider');

describe('Pact Verification', () => {
  let listener;
  beforeAll(() => {
    listener = server.listen(8081);
  });

  it('validates the expectations of ProductService', () => {
    const opts = {
      logLevel: 'INFO',
      providerBaseUrl: 'http://localhost:8081',
      providerVersion: '1.0.0-someprovidersha',
      provider: 'v2-provider',
      consumerVersionSelectors: [
        { tag: 'master', latest: true },
        { tag: 'prod', latest: true }
      ],
      pactUrls: [
        // './pacts/v2-consumer-pact-js-v2-provider.json',
        // './pacts/v3-consumer-pact-js-v3-provider.json'
        `${process.env.PWD}/pacts/v2-consumer-pact-js-v9-v2-provider.json`
      ],
      // pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
      // publishVerificationResult: true,
      enablePending: true
    };

    // await expect().resolves.toBe({});
    // // return;
    return new Verifier(opts)
      .verifyProvider()
      .then((output) => {
        console.log('Pact Verification Complete!');
        console.log(output);
      })
      .finally(() => listener.close());
  });
});
