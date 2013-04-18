"""
End points for healith applicatoins.
"""

# Self defined modules.

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

def GetEndpoints():
  endpoints = [
    ('/healith', HealithDocMainPage),
    ('/patientmobile', HealithPatientMobilePage)
  ]
  return endpoints
