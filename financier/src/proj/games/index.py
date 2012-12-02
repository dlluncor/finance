"""
End points for health applications.
"""

# Generic modules.
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

import os
from django.utils import simplejson

## JSON endpoints.

## HTML pages.
class To25GamePage(webapp.RequestHandler):
  def get(self):
    values = {}
    path = os.path.join(os.path.dirname(__file__), 'templates', 'pop.html')
    self.response.out.write(template.render(path, values))

def GetEndpoints():
  endpoints = [
    ('/to25', To25GamePage),
  ]
  return endpoints
