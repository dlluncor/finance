"""
The main point of entry for the webapp.
@since: July 24, 2012
@author: dlluncor
"""
import os

from django.utils import simplejson
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app

import assets
import stock_analysis

class MainPage(webapp.RequestHandler):
  def get(self):
    template_values = {}
    path = os.path.join(os.path.dirname(__file__), 'templates', 'simulation_home.html')
    self.response.out.write(template.render(path, template_values))

class ResultEndPoint(webapp.RequestHandler):
  def get(self):
    years = int(self.request.get("numYears"))
    results = assets.main(years)
    myresponse = {'results': results}
    json = simplejson.dumps(myresponse)
    self.response.headers.add_header('content-type', 'application/json', charset='utf-8')
    self.response.out.write(json)

class StockHistoryEndPoint(webapp.RequestHandler):
  def get(self):
    year = int(self.request.get("whichYear"))
    ticker = self.request.get("ticker")
    results = stock_analysis.main(ticker, year)
    myresponse = {'results': results}
    json = simplejson.dumps(myresponse)
    self.response.headers.add_header('content-type', 'application/json', charset='utf-8')
    self.response.out.write(json)

def main():
  application = webapp.WSGIApplication([
    ('/', MainPage),
    ('/simulation_results', ResultEndPoint),
    ('/stock_history_results', StockHistoryEndPoint), 
  ], debug=True)
  run_wsgi_app(application)

if __name__ == '__main__':
  main()
