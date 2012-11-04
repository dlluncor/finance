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

class Gooru(object):
  """Utility to contact the gooru API."""
  def __init__(self):
    self._API_KEY = 'ba6fd2a0-2612-11e2-8103-12313d1cb62e'
    self._BASE_URI = 'http://concept.goorulearning.org'
    self._contact = Contacter()
    self._token = None # The session token.

  def Init(self):
    self._token = self.GetSessionToken()

  def GetSessionToken(self):
    json_text = self._SignIn()
    d = simplejson.loads(json_text)
    return d['token']

  def _SignIn(self):
    pre = os.path.join(self._BASE_URI,
        'gooruapi/rest/account/signin.json?')
    arg1 = '%s=%s' % ('userName', 'david.lluncor@gmail.com')
    arg2 = '%s=%s' % ('password', 'david1234')
    arg3 = '%s=%s' % ('apiKey', self._API_KEY)
    args = '&'.join([arg1, arg2, arg3])
    req = pre + args
    return self._contact.Post(req)

  #### List of the different APIs. ####
  def _SearchResource(self, query, pageNum=1, pageSize=1):
    pre = os.path.join(self._BASE_URI,
      'gooru-search/rest/search/resource?')
    arg0 = '%s=%s' % ('sessionToken', self._token)
    arg1 = '%s=%s' % ('query', query)
    arg2 = '%s=%d' % ('pageSize', pageSize)
    arg3 = '%s=%d' % ('pageNum', pageNum)
    args = '&'.join([arg0, arg1, arg2, arg3])
    req = pre + args
    print req
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
    req = urllib2.Request(url=url, data=data)
    f = urllib2.urlopen(req)
    return str(f.read()) 


def main(argv):
  gooru = Gooru()
  gooru.Init()
  print gooru._SearchResource('computer')

if __name__ == '__main__':
  main(sys.argv)
