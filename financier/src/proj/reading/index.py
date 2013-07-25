"""
End points for speed reading applications.
"""

# Self defined modules.

# Generic modules.
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

import logging
import os
import urllib2
from django.utils import simplejson

## HTML pages.
class ReadingMainPage(webapp.RequestHandler):
  def get(self):
    values = {}
    path = os.path.join(os.path.dirname(__file__), 'templates', 'reading_home.html')
    self.response.out.write(template.render(path, values))

class MemoryReadPage(webapp.RequestHandler):
  def get(self):
    values = {}
    path = os.path.join(os.path.dirname(__file__), 'templates', 'memory_read.html')
    self.response.out.write(template.render(path, values))


class Contacter(object):

  def __init__(self):
    pass

  def Get(self, url):
    result = urllib2.urlopen(url)
    return result.read()

  def Post(self, url, data='needed data'):
    req = urllib2.Request(url=url, data=data)
    f = urllib2.urlopen(req)
    return str(f.read())

import pdb

class JSONApiEndpoint(webapp.RequestHandler):
  """Used to proxy any API requests we need to make."""
  cache = {}

  def get(self):
    query = self.request.get("query")
    json = None
    # Consider using a SQL Lite cache.
    if query in JSONApiEndpoint.cache:
      logging.info('**Reading from cache.')
      json = JSONApiEndpoint.cache[query]
    else:
      c = Contacter()
      json = c.Get(query)
      JSONApiEndpoint.cache[query] = json
    self.response.headers.add_header('content-type', 'application/json', charset='utf-8')
    self.response.out.write(json)


def GetEndpoints():
  endpoints = [
    ('/speedreading', ReadingMainPage),
    ('/memoryread', MemoryReadPage),
    ('/getjson', JSONApiEndpoint),
  ]
  return endpoints
