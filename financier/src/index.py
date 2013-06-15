"""
The main point of entry for the webapp.
@since: July 24, 2012
@author: dlluncor
"""
import logging
import os

from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app

from django.utils import simplejson

# Import modules I don't want to create another application for.
from proj.health import index as health_index
from proj.education import index as education_index
from proj.reading import index as reading_index
from proj.games import index as games_index
from proj.easydo import index as easydo_index
from proj.stats import index as stats_index
from proj.puzzles import index as puzzles_index
from proj.healith import index as healith_index
from proj.angel import index as angel_index

from simulator import assets
from analysis import question1
from analysis import question3
from ticker_symbols import ticker_mapper

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
    logging.info('hi mom')
    results = question1.Question1.main(ticker, year)
    logging.info(results)
    myresponse = {'results': results}
    json = simplejson.dumps(myresponse)
    self.response.headers.add_header('content-type', 'application/json', charset='utf-8')
    self.response.out.write(json)

class StockComparisonEndPoint(webapp.RequestHandler):
  def get(self):
    year = int(self.request.get("whichYear"))
    tickers_str = self.request.get("ticker")
    tickers = tickers_str.split(',')
    the_tickers = []
    for ticker in tickers:
      the_tickers.append(ticker.strip())
    results = question3.Question3.main(the_tickers, year)
    logging.info(results)
    myresponse = {'results': results}
    json = simplejson.dumps(myresponse)
    self.response.headers.add_header('content-type', 'application/json', charset='utf-8')
    self.response.out.write(json)

class TickerSymbolSuggestionsEndPoint(webapp.RequestHandler):
  """Used for autocomplete when wanting to go from easy to input company
     name (Google) to ticker symbol (GOOG).
  """
  def get(self):
    query = self.request.get("query")
    ret = ticker_mapper.get_suggestions(query)
    json = simplejson.dumps(ret)
    self.response.headers.add_header('content-type', 'application/json', charset='utf-8')
    self.response.out.write(json)

def main():
  # Tuple of paths to web handler classes.
  finance_endpoints = [
    ('/', MainPage),
    ('/simulation_results', ResultEndPoint),
    ('/stock_history_results', StockHistoryEndPoint),
    ('/stock_comparison_results', StockComparisonEndPoint),
    ('/ticker_symbol_suggestions', TickerSymbolSuggestionsEndPoint)
  ]
  health_endpoints = health_index.GetEndpoints()
  education_endpoints = education_index.GetEndpoints()
  reading_endpoints = reading_index.GetEndpoints()
  games_endpoints = games_index.GetEndpoints()
  easydo_endpoints = easydo_index.GetEndpoints()
  stats_endpoints = stats_index.GetEndpoints()
  puzzles_endpoints = puzzles_index.GetEndpoints()
  healith_endpoints = healith_index.GetEndpoints()
  angel_endpoints = angel_index.GetEndpoints()
  endpoints = (finance_endpoints + health_endpoints + education_endpoints +
      reading_endpoints + games_endpoints + easydo_endpoints + stats_endpoints +
      puzzles_endpoints + healith_endpoints + angel_endpoints)
  application = webapp.WSGIApplication(endpoints, debug=True)
  run_wsgi_app(application)

if __name__ == '__main__':
  main()
