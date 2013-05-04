"""
End points for healith applicatoins.
"""

# Self defined modules.
#import helper_twil

# Generic modules.
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

import os
from django.utils import simplejson

class HealithDocMainPage(webapp.RequestHandler):
  def get(self):
    values = {}
    path = os.path.join(os.path.dirname(__file__), '', 'healith_home.html')
    self.response.out.write(template.render(path, values))

class HealithPatientMobilePage(webapp.RequestHandler):
  def get(self):
    values = {}
    path = os.path.join(os.path.dirname(__file__), '', 'patient_mobile_app.html')
    self.response.out.write(template.render(path, values))

class SendMessageTwilio(webapp.RequestHandler):
  def get(self):
    self.response.write("The twilio version is " + twilio.__version__)
    #text = helper_twil.SendMessage('hi david', '3109876896')
    #self.response.out.write(text)

def GetEndpoints():
  endpoints = [
    ('/healith', HealithDocMainPage),
    ('/patient', HealithPatientMobilePage),
    ('/sendmessage', SendMessageTwilio)
  ]
  return endpoints
