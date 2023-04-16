import requests
import atexit
import unittest
from pact import Consumer, Provider

def user(user_name):
    """Fetch a user object by user_name from the server."""
    uri = 'http://localhost:1234/users/' + user_name
    return requests.get(uri).json()

pact = Consumer('Consumer').has_pact_with(Provider('Provider'),log_dir='./logs',pact_dir='./pacts')
pact.start_service()
atexit.register(pact.stop_service)

class GetUserInfoContract(unittest.TestCase):
  def test_get_user(self):
    expected = {
      'username': 'UserA',
      'id': 123,
      'groups': ['Editors']
    }

    (pact
     .given('UserA exists and is not an administrator')
     .upon_receiving('a request for UserA')
     .with_request('get', '/users/UserA')
     .will_respond_with(200, body=expected))
    with pact:
      result = user('UserA')
    
    self.assertEqual(result, expected)
    pact.verify()