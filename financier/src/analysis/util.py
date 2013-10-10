from datetime import datetime, timedelta #DateUtils

class DateUtils(object):
  FORMAT = "%Y%m%d" # Example: YYYYMMDD, or, 20120531
  @staticmethod
  def getDateStr(year, month, day):
    """Returns the formatted YYYYMMDD string with years
       months and days provided."""
    dt = datetime(year, month, day)
    return dt.strftime(DateUtils.FORMAT)
    
 
  @staticmethod
  def getEndDate(start_date_formatted, num_days):
    """Given a full_date in YYYYMMDD format, and the number of days
       past that date, return the start and end date for that
       range in YYYYMMDD format.
    """
    start_date = datetime.strptime(start_date_formatted, DateUtils.FORMAT)
    delta = timedelta(days=num_days)
    end_date = start_date + delta
    end_date_formatted = end_date.strftime(DateUtils.FORMAT)
    return end_date_formatted

import math
class StatUtils(object):
  @staticmethod
  def compute_variance(values):
    """Computes variance for a list of float values."""
    N = len(values)
    sumX = sum(values)
    sumX2 = sum([math.pow(val, 2) for val in values])
    E_X2 = sumX2 / N
    EX_2 = math.pow((sumX / N), 2)
    return E_X2 - EX_2

  @staticmethod
  def compute_stdev(values):
    return math.pow(StatUtils.compute_variance(values), 0.5)

#import pylab #Plotter
class Plotter(object):
  def __init__(self):
    pass

  @staticmethod
  def plot(values):
    pylab.plot(values)
    pylab.show()
