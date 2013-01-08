"""
Gooru is a platform that aggregates educational content. This class
helps contact their API.

@since: Nov 3 2012
@author: dlluncor
"""
import os
import urllib2
import sys
import simplejson

class Constants(object):
  CALENDAR = 'lluncorservice@gmail.com'

class Gooru(object):
  """Utility to contact the gooru API."""

  def __init__(self):
    self._API_KEY = 'AIzaSyBo6Ggn8qJwveMlZ2dw3wRmWmH5odxYXzY'
    self._BASE_URI = 'https://www.googleapis.com/calendar/v3/calendars/'
    self._contact = Contacter()
    self._token = None # The session token.

  def Init(self):
    pass

  #### List of the different APIs. ####
  def ListEvents(self, calendar=Constants.CALENDAR):
    pre = os.path.join(self._BASE_URI, calendar, 'events?')
    arg0 = '%s=%s' % ('key', self._API_KEY)
    args = '&'.join([arg0])
    req = pre + args
    return self._contact.Post(req)

  def _SearchResource(self, query, pageNum=1, pageSize=20):
    pre = os.path.join(self._BASE_URI,
      'gooru-search/rest/search/resource?')
    arg0 = '%s=%s' % ('sessionToken', self._token)
    arg1 = '%s=%s' % ('query', query)
    arg2 = '%s=%d' % ('pageSize', pageSize)
    arg3 = '%s=%d' % ('pageNum', pageNum)
    args = '&'.join([arg0, arg1, arg2, arg3])
    req = pre + args
    """
      url returns actual resource
      description
      resourceSource['attribution'] who is providing the source
      thumbnail['url'] icon for the company
    """
    return self._contact.Get(req)


class Contacter(object):

  def __init__(self):
    pass

  def Get(self, url):
    result = urllib2.urlopen(url)
    return result.read()

  def Post(self, url, data='needed data'):
    print url
    req = urllib2.Request(url=url, data=data)
    f = urllib2.urlopen(req)
    return str(f.read()) 


def GetResults(query):
  """Gets results for the user about this query.

  Args:
    query: the text query, e.g., "philosophy"
  """
  gooru = Gooru()
  gooru.Init()
  resp_text = gooru._SearchResource(query)
  print resp_text
  response = simplejson.loads(resp_text)
  return response['searchResults']

def main(argv):
  gooru = Gooru()
  gooru.Init()
  print gooru.ListEvents()

if __name__ == '__main__':
  main(sys.argv)
