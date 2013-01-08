# Hi
import logging

from google.appengine.api import mail
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

import atom
import gdata.alt.appengine
import gdata.auth
import gdata.calendar
import gdata.calendar.service

# Reconstruct the Calendar entry, and update the information.
                    cal_event = gdata.calendar.CalendarEventEntryFromString(
                        str(event.gcal_event_xml))
                    # Modify the event's Google Calendar entry
                    cal_event.title = atom.Title(text=self.request.get('name'))
                    cal_event.content = atom.Content(text=self.request.get('description'))
                    start_time = '%s.000Z' % datetime.datetime.strptime(
                        self.request.get('datetimestamp'), '%d/%m/%Y %H:%M').isoformat()
                    cal_event.when = [gdata.calendar.When(start_time=start_time)]
                    cal_event.where = [gdata.calendar.Where(
                        value_string=self.request.get('location'))]
                    # Add a who element for each attendee.
                    if self.request.get('attendees'):
                        attendee_list = self.request.get('attendees').split(',')
                        if attendee_list:
                            cal_event.who = []
                            for attendee in attendee_list:
                                cal_event.who.append(gdata.calendar.Who(email=attendee))
                    # Send the updated Google Calendar entry to the Google server.
                    try:
                        updated_entry = calendar_client.UpdateEvent(str(event.edit_link),
                                                                    cal_event)

class UpdateCalendarHandler(webapp.RequestHandler):
    def __init__(self):
      # Create a Google Calendar client to talk to the Google Calendar service.
      self.calendar_client = gdata.calendar.service.CalendarService()

      # Modify the client to search for auth tokens in the datastore and use
      # urlfetch instead of httplib to make HTTP requests to Google Calendar.
      gdata.alt.appengine.run_on_appengine(self.calendar_client)

    def get(self):
      self.SendEmail()
      self.UpdateCalendar()
      logging.info('what up what up what up')

    def SendEmail(self):
      mail.send_mail(sender="David Lluncor <david.lluncor@gmail.com>",
                     to="Lluncor David <lluncor.david@gmail.com>",
                     subject="Hi david",
                     body="Whatup dude!")

    def UpdateCalendar(self):
      pwd = 'thebeststate#update'
      self.calendar_client.ClientLogin('lluncorservice@gmail.com', pwd) 

 
