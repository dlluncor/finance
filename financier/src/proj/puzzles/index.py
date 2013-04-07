"""
End points for puzzle applications.
"""

# Generic modules.
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

import os
from django.utils import simplejson

class PuzzlesMainPage(webapp.RequestHandler):
  def get(self):
    values = {}
    path = os.path.join(os.path.dirname(__file__), '', 'hanoi.html')
    self.response.out.write(template.render(path, values))

class ImageizerMainPage(webapp.RequestHandler):
  def get(self):
    values = {}
    path = os.path.join(os.path.dirname(__file__), '', 'imageizer.html')
    self.response.out.write(template.render(path, values))

def GetEndpoints():
  endpoints = [
    ('/puzzles', PuzzlesMainPage),
    ('/imageizer', ImageizerMainPage),
  ]
  return endpoints
