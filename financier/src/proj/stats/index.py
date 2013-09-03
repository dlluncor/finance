"""
End points for statistics applications.
"""

# Self defined modules.

# Generic modules.
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

import os
from django.utils import simplejson

## HTML pages.
class StatsMainPage(webapp.RequestHandler):
  def get(self):
    values = {}
    path = os.path.join(os.path.dirname(__file__), '', 'hello.html')
    self.response.out.write(template.render(path, values))

def GetEndpoints():
  endpoints = [
    ('/stats', StatsMainPage),
  ]
  return endpoints
