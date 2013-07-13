"""
End points for puzzle applications.
"""

# Generic modules.
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.api import memcache

import os
from django.utils import simplejson

import opentok_driver

class ReverseDateMainPage(webapp.RequestHandler):
  def get(self):
    values = {
      'session_id': memcache.get('session_id'),
      'token': memcache.get('token')
    }
    path = os.path.join(os.path.dirname(__file__), '', 'reversedate.html')
    self.response.out.write(template.render(path, values))

class ReloadMainPage(webapp.RequestHandler):
  def get(self):
    tokens = opentok_driver.GetTokens()
    memcache.set('session_id', tokens['session_id'])
    memcache.set('token', tokens['token'])
    output = '<html>Token reloaded.</html>'
    self.response.out.write(output)

def GetEndpoints():
  endpoints = [
    ('/reversedate', ReverseDateMainPage),
    ('/reload', ReloadMainPage),
  ]
  return endpoints
