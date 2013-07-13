"""
End points for puzzle applications.
"""

# Generic modules.
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

import os
from django.utils import simplejson

class ReverseDateMainPage(webapp.RequestHandler):
  def get(self):
    values = {}
    path = os.path.join(os.path.dirname(__file__), '', 'reversedate.html')
    self.response.out.write(template.render(path, values))

def GetEndpoints():
  endpoints = [
    ('/reversedate', ReverseDateMainPage),
  ]
  return endpoints
