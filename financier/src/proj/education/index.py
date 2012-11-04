"""
End points for health applications.
"""

# Self defined modules.

# Generic modules.
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

import os
import simplejson

## JSON endpoints.
class GooruEndPoint(webapp.RequestHandler):
  def get(self):
   d = {}
   query = self.request.get('query')
   results = [query + 'hi', 'bye']
   d['results'] = results
   json = simplejson.dumps(d)
   self.response.headers.add_header('content-type', 'application/json', charset='utf-8') 
   self.response.out.write(json)

## HTML pages.
class EducationMainPage(webapp.RequestHandler):
  def get(self):
    values = {}
    values['entries'] = ['hi']
    path = os.path.join(os.path.dirname(__file__), 'templates', 'education_home.html')
    self.response.out.write(template.render(path, values))

def GetEndpoints():
  endpoints = [
    ('/gooru', GooruEndPoint),
    ('/education', EducationMainPage),
  ]
  return endpoints
