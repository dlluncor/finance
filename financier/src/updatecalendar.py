# Hi
import logging

from google.appengine.api import mail
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

class UpdateCalendarHandler(webapp.RequestHandler):
    def get(self):
      self.SendEmail()
      logging.info('what up what up what up')

    def SendEmail(self):
      mail.send_mail(sender="David Lluncor <david.lluncor@gmail.com>",
                     to="Lluncor David <lluncor.david@gmail.com>",
                     subject="Hi david",
                     body="Whatup dude!")
