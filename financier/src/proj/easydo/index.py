"""
End points for health applications.
"""

# Self defined modules.

# Generic modules.
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

import os
from django.utils import simplejson

## JSON endpoints.
class TriggerEndPoint(webapp.RequestHandler):
  def get(self):
   d = {}
   query = self.request.get('query')
   results = []
   d['results'] = results
   json = simplejson.dumps(d)
   self.response.headers.add_header('content-type', 'application/json', charset='utf-8') 
   self.response.out.write(json)

## HTML pages.
class PreferencesMainPage(webapp.RequestHandler):
  def get(self):
    values = {}
    values['entries'] = ['Find online resources for any topic.']
    popular_queries = ['cells', 'chinese', 'computers']
    values['popular_queries'] = popular_queries
    path = os.path.join(os.path.dirname(__file__), 'templates', 'easydo_pref_home.html')
    self.response.out.write(template.render(path, values))

def GetEndpoints():
  endpoints = [
    ('/initiate_trigger', TriggerEndPoint),
    ('/easydo_preferences', PreferencesMainPage),
  ]
  return endpoints
