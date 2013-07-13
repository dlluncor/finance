import opentok

api_key = "25443712"        # Replace with your OpenTok API key.
api_secret = "6f5adc6f93e7fdc54546ef45a20367c5dd330f76"  # Replace with your OpenTok API secret.

def GetTokens():
  opentok_sdk = opentok.OpenTokSDK(api_key, api_secret)
  session_properties = {opentok.SessionProperties.p2p_preference: "disabled"}
  session = opentok_sdk.create_session(None, session_properties)
  token = opentok_sdk.generate_token(session.session_id)
  d = {
    'session_id': session.session_id,
    'token': token
  }
  return d

#print GetTokens()