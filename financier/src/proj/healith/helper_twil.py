"""Twilio helper client."""

import constants

from twilio.rest import TwilioRestClient

# Your Account Sid and Auth Token from twilio.com/user/account
client = TwilioRestClient(constants.account_sid, constants.auth_token)


def SendMessage(messageBody, toNumber):
  message = client.sms.messages.create(
  	body=messageBody,
    to="+1" + toNumber,
    from_="+13105077984")
  return message.sid