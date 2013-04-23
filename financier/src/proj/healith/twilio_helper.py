"""Twilio helper client."""

import constants

from twilio.rest import TwilioRestClient

# Your Account Sid and Auth Token from twilio.com/user/account
client = TwilioRestClient(constants.account_sid, constants.auth_token)


def SendMessage(messageBody=''):
  message = client.sms.messages.create(
  	body=messageBody,
    to="+14159352345",
    from_="+14158141829")
  print message.sid