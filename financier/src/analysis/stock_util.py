from util import DateUtils
from util import StatUtils
import sys

class StockUtils(object):
  """"Helper class used to gather statistics on historical data
      of stock prices."""
  def __init__(self):
    Tests.runTests()
    pass

  @staticmethod
  def getPercentChanges(closing_values):
     """Given a list of closing values, compute the list of
        percent changes occured for that stock.

        Ex. [10, 15, 20] returns [.50, .33]
     """
     differences = []
     for ind in range(0, len(closing_values) - 1):
       start = float(closing_values[ind])
       closing = float(closing_values[ind + 1])
       if start == 0.0:
         start = 0.0000000000000000000001
       pct_change = (closing - start) / start
       differences.append(pct_change)
     return differences

  @staticmethod
  def getAverageReturn(closing_values):
    """Computes the average return that you got for a series
       of values.

      Ex. [10, 15, 20] returns are [1.0, .5] average return
          is (1.0 + .5) / 2 = .75
    """
    pct_changes = StockUtils.getPercentChanges(closing_values)
    return sum(pct_changes) / float(len(pct_changes))

  @staticmethod
  def getTotalReturn(closing_values):
    """Computes the total return for a series of values.

     Ex. [10, 15, 20] total return is 2.0 (200% increase)
    """
    start = closing_values[0]
    finish = closing_values[-1]
    return StockUtils.getPercentChanges([start, finish])[0]

  @staticmethod
  def getStdevReturn(closing_values):
    """Gets the standard deviation of your returns."""
    pct_changes = StockUtils.getPercentChanges(closing_values)
    daily_stdev = StatUtils.compute_stdev(pct_changes)
    return daily_stdev

  @staticmethod
  def getCompoundedReturn(values):
    """Gets the compounded return.
       Lets say you start with 1. Now you have a bunch of percent
       changes, how much do you end up with? It should be the total
       return but somehow it is not.
       1  * val[0] * val[1]
       TODO: check why is this not total return???
     """
    # I put in 1/12 of my month if there are 12 total changes.
    # Then at each month I add 1/12 to the pie and see what happens.
    count = 0
    fraction_add = 1/ float(len(values))
    for val in values:
      count += fraction_add
      count *= (1 + val)
    return count

class Tests():
  @staticmethod
  def assertEquals(floats1, floats2):
    if len(floats1) != len(floats2):
      raise AssertionError("Arrays not equal len.")
    for ind in range(0, len(floats1)):
      v1 = '%.2f' % floats1[ind]
      v2 = '%.2f' % floats2[ind]
      if (v1 != v2):
        raise AssertionError('Expected: %s Actual: %s' % (v1, v2))

  @staticmethod
  def assertStrEquals(strs1, strs2):
    if len(strs1) != len(strs2):
      raise AssertionError("Arrays not equal len.")
    for ind in range(0, len(strs1)):
      v1 = strs1[ind]
      v2 = strs2[ind]
      if (v1 != v2):
        raise AssertionError('Expected: %s Actual: %s' % (v1, v2))
  
  @staticmethod
  def runTests():
    Tests.assertEquals([1.0, 0.5], StockUtils.getPercentChanges([5, 10, 15]))
    Tests.assertEquals([0.75], [StockUtils.getAverageReturn([5, 10, 15])])
    Tests.assertEquals([-.67], [StockUtils.getTotalReturn([15, 10, 5])])
    Tests.assertStrEquals(["20120220"], [DateUtils.getEndDate("20120215", 5)])
    Tests.assertStrEquals(["20121231"], [DateUtils.getDateStr(2012, 12, 31)])
