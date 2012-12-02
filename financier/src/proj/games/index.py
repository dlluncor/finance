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
    path = os.path.join(os.path.dirname(__file__), 'templates', 'popto25.html')
    self.response.out.write(template.render(path, values))

class BubblePopGamePage(webapp.RequestHandler):
  def get(self):
    values = {}
    path = os.path.join(os.path.dirname(__file__), 'templates', 'bubblepop.html')
    self.response.out.write(template.render(path, values))

class GameArenaPage(webapp.RequestHandler):
  def get(self):
    values = {}
    path = os.path.join(os.path.dirname(__file__), 'templates', 'game_portal.html')
    self.response.out.write(template.render(path, values))

def GetEndpoints():
  endpoints = [
    ('/to25', To25GamePage),
    ('/bubblepop', BubblePopGamePage),
    ('/gameportal', GameArenaPage),
  ]
  return endpoints
