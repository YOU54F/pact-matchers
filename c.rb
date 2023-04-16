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

provider_service.given('Server is healthy')
                .upon_receiving('A request for API health')
                .with(method: :get, path: '/health')
                .will_respond_with(
                  status: 200,
                  body: { status: 'up' }
                )
