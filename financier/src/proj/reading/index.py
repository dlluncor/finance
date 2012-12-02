"""
End points for speed reading applications.
"""

# Self defined modules.

# Generic modules.
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

import os
from django.utils import simplejson

## HTML pages.
class ReadingMainPage(webapp.RequestHandler):
  def get(self):
    values = {}
    path = os.path.join(os.path.dirname(__file__), 'templates', 'reading_home.html')
    self.response.out.write(template.render(path, values))

def GetEndpoints():
  endpoints = [
    ('/speed_reading', ReadingMainPage),
  ]
  return endpoints
