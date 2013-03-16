
import os
import base64
import json

import urllib2

POST_TASK_URL = "https://agent8-backend-staging.appspot.com/hackathon/discovery/postTask"

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


class EasyDoer(object):

	def __init__(self):
		pass

	def Run(self, params):
		flight_info = params['flight_info']
	    # Handle the request
		city_to_hotel = {'SJC': 'San Jose Downtown ', 'SFO': 'Downtown SF'}
		toCity = params['toLocation']
		fromCity = params['fromLocation']
		hotel_name = city_to_hotel.get(toCity, '') + flight_info['hotelName']
		car_rental_name = flight_info['carRental']
		flight_suffix = '(%s to %s)' % (fromCity, toCity)
		flight_name = flight_info['flightName'] + ' ' + flight_suffix
		payload = {
		            "doType" : 5660, # ID of the Trigger in EasilyDo Builder
		            "doResponse" : [{
		                "userName" : "h.chitalia007@gmail.com", # EasilyDo user name
		                "uniqueId" : base64.urlsafe_b64encode(os.urandom(30)), 
		                "variables" : {
		                  "taskIconURL" : "http://thedancingpotato.files.wordpress.com/2011/09/almonds-spoon.gif",
		                  "FlightName" : flight_name,
		                  'HotelName': hotel_name,
		                  'CarRental': car_rental_name,
		                  'DeptDate': params['startDate'],
		                  'RetDate': params['endDate']
		                    }
		                }]  
		            }
		requestor = Contacter()
		r = requestor.Post(POST_TASK_URL, data=json.dumps(payload))
		#print r
		#print 'Found new friend, hello EasilyDo'
		return True