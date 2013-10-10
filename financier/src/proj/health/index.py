"""
End points for health applicatoins.
"""

# Self defined modules.
import medlineplus

# Generic modules.
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

import os
from django.utils import simplejson

class HealthMainPage(webapp.RequestHandler):
  def get(self):
    values = {}
    try:
      values['entries'] = simplejson.dumps(medlineplus.Ask())
    except:
      values['entries'] = simplejson.dumps(['No results!'])
    path = os.path.join(os.path.dirname(__file__), 'templates', 'health_home.html')
    self.response.out.write(template.render(path, values))

def GetEndpoints():
  endpoints = [
    ('/health', HealthMainPage),
  ]
  return endpoints
