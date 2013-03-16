#!/usr/bin/python

import os
import base64
import requests
import json

POST_TASK_URL = "https://agent8-backend-staging.appspot.com/hackathon/discovery/postTask"

def run(request=None):
    # Handle the request

    # Discovery algorithms go here, 
    # such as discovering if you have recently added a new friend in Facebook

    # POST data from trigger code to Do-Engine
    payload = {
                "doType" : 5652, # ID of the Trigger in EasilyDo Builder
                "doResponse" : [{
                    "userName" : "h.chitalia007@gmail.com", # EasilyDo user name
                    "uniqueId" : base64.urlsafe_b64encode(os.urandom(30)), 
                    "variables" : {
                      "taskIconURL" : "http://thedancingpotato.files.wordpress.com/2011/09/almonds-spoon.gif",
                      "KEY1" : "Delta",
                      #"HOTEL" : "EmbassySuites",
                      #"CAR" : "NATIONAL"
                        }
                    }]  
                }
    r = requests.post(POST_TASK_URL, data=json.dumps(payload))
    print r
    print 'Found new friend, hello EasilyDo'
    return True
    

if __name__ == '__main__':
    run()
