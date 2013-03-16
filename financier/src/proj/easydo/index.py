"""
End points for easydo applications.
"""

import pdb
# Self defined modules.
import easydoer

# Generic modules.
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

import logging
import math

import os
from django.utils import simplejson

class Constants(object):
  DEFAULT_SOURCE = 'http://www.cleartrip.com/api/docs/air-api/schemas/search-result.xml'

class FlightContacter(object):
  
  def __init__(self, xml_source = Constants.DEFAULT_SOURCE):
    self.xml_source = xml_source

  def HasCheapestFlightInfo(self):
    samples = self.GetPreviousFlightPrices()
    current_prices = self.GetCurrentPrices()
    stats = Stats(samples)
    for cur_price in current_prices:
      info = stats.isCheapFlightInfo(cur_price)
      if info['is_cheap_flight']:
        return info
    return None

  def GetPreviousFlightPrices(self):
    prices = [2000.00,2000.00,2000.00,2000.00,2850.00,1850.00,1850.00,2850.00,2850.00,
    2850.00,2850.00,2850.00,2850.00,2850.00,4170.00,6380.00,6090.00,8755.00,1500.00,
    1500.00,1500.00,1350.00,1350.00,2350.00,2350.00,2350.00,2350.00,2350.00,2350.00,
    2350.00,4570.00,4570.00,4570.00,6890.00,8755.00]
    return [price / 10.0 for price in prices]

  def GetCurrentPrices(self):
    return [200, 500]


class Stats(object):

  def __init__(self, samples):
    self.samples = samples
    self.mean = self.CalculateMean()
    self.sampling_stdev_sample_mean = self.CalculateStdevMean()

  def CalculateStdevMean(self):
    """Computes sampling distribution of sample mean."""
    n = len(self.samples) * 1.0
    mean = sum(self.samples) / n
    sum_sq_dist = 0
    for sample in self.samples:
      sum_sq_dist += math.pow(sample - mean, 2)

    s = math.sqrt(sum_sq_dist / (n - 1))
    sampling_stdev_mean = s / math.sqrt(n)
    return sampling_stdev_mean

  def CalculateMean(self):
    return sum(self.samples) / (len(self.samples) * 1.0)

  def isCheapFlightInfo(self, flight_sample):
    """Returns whether this flight price is 95 percent less than all samples taken."""
    self.z_score_thresh = 1.96
    my_zscore = (flight_sample - self.mean) / self.sampling_stdev_sample_mean

    d = {}
    d['is_cheap_flight'] = abs(my_zscore) > self.z_score_thresh
    d['discount'] = (self.mean - flight_sample)
    d['flight_cost'] = flight_sample
    d['zscore'] = my_zscore
    d['mean'] = self.mean
    d['sample_stdev'] = self.sampling_stdev_sample_mean

    # Send to easydo.
    d['flightName'] = 'Southwest'
    d['hotelName'] = 'Mariott'
    d['carRental'] = 'Hertz'
    return d

## JSON endpoints.
class TriggerEndPoint(webapp.RequestHandler):
  def get(self):
   d = {}
   for key in self.request.GET:
     d[key] = str(self.request.GET[key])

   # Start contacting flight sources to find cheapest flight.
   flighter = FlightContacter()
   flight_info = flighter.HasCheapestFlightInfo()
   if flight_info:
    d['flight_info'] = flight_info

   # If we have found a cheap flight, send a trigger to EasyDo.
   easydo = easydoer.EasyDoer()
   easydo.Run(d)

   #pdb.set_trace()
   json = simplejson.dumps(d)
   self.response.headers.add_header('content-type', 'application/json', charset='utf-8') 
   self.response.out.write(json)

## HTML pages.
class PreferencesMainPage(webapp.RequestHandler):
  def get(self):
    values = {}
    values['entries'] = ['Find online resources for any topic.']
    popular_queries = ['cells', 'chinese', 'computers']
    values['popular_queries'] = popular_queries
    path = os.path.join(os.path.dirname(__file__), 'templates', 'easydo_pref_home2.html')
    self.response.out.write(template.render(path, values))

def GetEndpoints():
  endpoints = [
    ('/initiate_trigger', TriggerEndPoint),
    ('/easydo_preferences', PreferencesMainPage),
  ]
  return endpoints
