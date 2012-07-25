"""
The main point of entry for the webapp.
@since: July 24, 2012
@author: dlluncor
"""
import os

from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app

import assets

class MainPage(webapp.RequestHandler):
  def get(self):
    results = assets.main()
    template_values = {'results': results}
    path = os.path.join(os.path.dirname(__file__), 'templates', 'index.html')
    self.response.out.write(template.render(path, template_values))

def main():
  application = webapp.WSGIApplication([
    ('/', MainPage),
  ], debug=True)
  run_wsgi_app(application)

if __name__ == '__main__':
  main()
