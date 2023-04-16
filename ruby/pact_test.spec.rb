require 'httparty'

class APIClient
  include HTTParty
  base_uri 'http://your-api.example.com'

  def get_health
    JSON.parse(self.class.get('/health').body)['status']
  end
end

require 'pact/consumer/rspec'
# or require 'pact/consumer/minitest' if you are using Minitest

Pact.configure do |config|
  # Default is ./specs/pacts
  config.pact_dir = './pacts'
  config.log_dir = './logs'
end

Pact.service_consumer 'consumer-ruby-v2' do
  has_pact_with 'provider-ruby-v2' do
    mock_service :provider_service do
      port 1234
      # host '...' # optional, defaults to 'localhost'
    end
  end
end

describe APIClient, pact: true do
  before do
    # Configure your client to point to the stub service on localhost using the port you have specified
    APIClient.base_uri 'localhost:1234'
  end

  subject { APIClient.new }

  describe 'get_health' do
    before do
      provider_service.given('Server is healthy')
                      .upon_receiving('A request for API health')
                      .with(method: :get, path: '/health')
                      .will_respond_with(
                        status: 200,
                        body: { status: 'up' }
                      )
    end

    it 'returns healthy status' do
      expect(subject.get_health).to eq('up')
    end
  end
end
