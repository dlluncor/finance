"""
06/15/2013
End points for angel applications.
"""

# Generic modules.
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

import os
import json

## JSON endpoints.

## HTML pages.
class AngelGamePage(webapp.RequestHandler):
  def get(self):
    values = {}
    path = os.path.join(os.path.dirname(__file__), 'templates', 'index.html')
    self.response.out.write(template.render(path, values))

## HTML pages.
class AngelVidPage(webapp.RequestHandler):
  def get(self):
    values = {}
    path = os.path.join(os.path.dirname(__file__), 'templates', 'angelvid.html')
    self.response.out.write(template.render(path, values))

def GetEndpoints():
  endpoints = [
    ('/angel', AngelGamePage),
    ('/angelvid', AngelVidPage)
  ]
  return endpoints



