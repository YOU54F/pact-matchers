const axios = require("axios");
const defaultBaseUrl = "http://your-api.example.com";
const api = (baseUrl = defaultBaseUrl) => ({
  getHealth: () =>
    axios.get(baseUrl + "/health").then((response) => response.data.status),
  /* other endpoints here */
});

const { Pact, Matchers } = require("@pact-foundation/pact");
const provider = new Pact({
  consumer: "consumer-js-v2",
  provider: "provider-js-v2",
});

const { regex, like } = Matchers;

describe("Name of the group", () => {
  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  it("should create a v2 js pact", () => {
    provider.addInteraction({
      state: "Server is healthy",
      uponReceiving: "A request for API health",
      withRequest: {
        method: "GET",
        path: "/health",
      },
      willRespondWith: {
        status: 200,
        body: { status: like("up") },
      },
    });

    const client = api(provider.mockService.baseUrl);
    return client.getHealth().then((health) => {
      expect(health).toEqual("up");
    });
  });
});
