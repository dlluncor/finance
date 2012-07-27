from datetime import datetime, timedelta #DateUtils
import math
import pylab #Plotter
import sys
import ystockquote #YahooStockTable

class YahooStockTable(object):
  DATA_START_ROW = 1 # Header is the first row.
  DATE_COL = 0
  CLOSE_COL = 4
  def __init__(self, table):
    """
      Args:
        table: 2D table that Yahoo historical prices returns. 
    """
    self.table = self.fixTable(table)
  
  def fixTable(self, table):
    """Fix the table by removing the header row and also
       reversing the order of the dates.

       Date is returned 01-30 to 01-01 but we want 01-01 to 01-30.
    """
    data_table = table[self.DATA_START_ROW:]
    reversed_table = [row for row in reversed(data_table)]
    return reversed_table

  def getNumDataRows(self):
    return len(self.table)

  def getClose(self, rowIndex):
    """Returns closing value as integer."""
    return float(self.table[rowIndex][self.CLOSE_COL])

  def getDate(self, rowIndex):
    """Returns closing value as integer."""
    return str(self.table[rowIndex][self.DATE_COL])

  def getAllClosing(self):
    """Returns all closing values for this table."""
    closing_values = [] # array of floats with closing stock prices.
    for rowIndex in range(0, self.getNumDataRows()):
      closing_values.append(self.getClose(rowIndex))
    return closing_values

  def getAllDates(self):
    """Returns all dates in the order received."""
    dates = []
    for rowIndex in range(0, self.getNumDataRows()):
      dates.append(self.getDate(rowIndex))
    return dates

  @staticmethod
  def make_data_table(ticker_symbol, start_date, end_date):
    """Gets historical prices data table from Yahoo.
    
      Args:
        ticker_symbol: GOOG
        start_date: YYYYMMDD
        end_date: YYYYMMDD
      Returns: 
        YahooStockTable
    """
    table = ystockquote.get_historical_prices(ticker_symbol, start_date, end_date)
    ysTable = YahooStockTable(table)
    #print table
    return ysTable

class Stats(object):
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
    return math.pow(Stats.compute_variance(values), 0.5)

class StockAnalysis(object):
  """"Helper class used to gather statistics on historical data
      of stock prices."""
  def __init__(self):
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
    pct_changes = StockAnalysis.getPercentChanges(closing_values)
    return sum(pct_changes) / float(len(pct_changes))

  @staticmethod
  def getTotalReturn(closing_values):
    """Computes the total return for a series of values.

     Ex. [10, 15, 20] total return is 2.0 (200% increase)
    """
    start = closing_values[0]
    finish = closing_values[-1]
    return StockAnalysis.getPercentChanges([start, finish])[0]

  @staticmethod
  def getStdevReturn(closing_values):
    """Gets the standard deviation of your returns."""
    pct_changes = StockAnalysis.getPercentChanges(closing_values)
    daily_stdev = Stats.compute_stdev(pct_changes)
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


class Plotter(object):
  def __init__(self):
    pass

  @staticmethod
  def plot(values):
    pylab.plot(values)
    pylab.show()


# Question: what is the variance and average return month to month
# for GOOG?

class Questions(object):
  def __init__(self):
    pass
 
  @staticmethod
  def makeYearlyTable(ticker_symbol, year):
    """Provide year data."""
    start_date = DateUtils.getDateStr(year, 1, 1)
    end_date = DateUtils.getDateStr(year, 12, 30)
    tbl = YahooStockTable.make_data_table(ticker_symbol, start_date, end_date)    
    return tbl

  @staticmethod
  def makeMonthlyTables(ticker_symbol, year):
     """Provide monthly (12 months) for a particular year for a particular
        ticker symbol.

     Ex: GOOG, 2012 -> tables for Jan 2012, Feb 2012, ..., Dec 2012     
     """
     months = [month for month in range(1, 13)]
     monthly_tables = []
     for month in months:
       # Assume we go from the 1st of the month, and then 30 days later.
       start_date = DateUtils.getDateStr(year, month, 1)
       end_date = DateUtils.getEndDate(start_date, 30)
       tbl = YahooStockTable.make_data_table(ticker_symbol, start_date, end_date)
       monthly_tables.append(tbl)
     return monthly_tables  

  @staticmethod
  def create_report_line(values, first_col_title):
    avg_return = StockAnalysis.getAverageReturn(values)
    total_return = StockAnalysis.getTotalReturn(values)
    stdev_return = StockAnalysis.getStdevReturn(values)
    closing_val_range = '%.2f to %.2f' % (values[0], values[-1])
    line = '%s,\t%.2f,\t%.2f,\t%.2f,\t%s' % (first_col_title, avg_return * 100, 
                                             total_return * 100, stdev_return * 100,
                                             closing_val_range)
    return (line, total_return)

  @staticmethod
  def print_report(yahoo_tables, do_plot=False):
    """Given a yahoo stock table prints a report.

    average return, standard deviation, total return
    """
    headers = ['date_range', 'average_return', 'total_return', 'stdev', 'closing_range']
    print '\t'.join(headers)

    total_returns = []
    for yahoo_table in yahoo_tables:
      try:
        closing_vals = yahoo_table.getAllClosing()
        dates = yahoo_table.getAllDates()
        first_col_title = '%s to %s' % (dates[0], dates[-1])
        (line, total_return) = Questions.create_report_line(closing_vals, first_col_title)
        print line
        total_returns.append(total_return)
        if do_plot:
          closing_vals = yahoo_table.getAllClosing()
          Plotter.plot(StockAnalysis.getPercentChanges(closing_vals)) 
      except Exception as inst:
        pass
    # Only do this for more or one tables.
    if len(yahoo_tables) <= 1:
      return
    # Compound your month to month returns.
    all_return = StockAnalysis.getCompoundedReturn(total_returns)
    gain = all_return - 1
    print 'Gain for year with month style: %.2f' % (gain * 100)
    #(line, t_return) = Questions.create_report_line(total_returns, 'Month-to-month')
    #print line


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

def main(ticker_symbol, year):
  tbls = Questions.makeMonthlyTables(ticker_symbol, year)
  Questions.print_report(tbls, False)
  print '-' * 30
  yearly_tbl = Questions.makeYearlyTable(ticker_symbol, year)
  Questions.print_report([yearly_tbl], False)

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
    Tests.assertEquals([1.0, 0.5], StockAnalysis.getPercentChanges([5, 10, 15]))
    Tests.assertEquals([0.75], [StockAnalysis.getAverageReturn([5, 10, 15])])
    Tests.assertEquals([-.67], [StockAnalysis.getTotalReturn([15, 10, 5])])
    Tests.assertStrEquals(["20120220"], [DateUtils.getEndDate("20120215", 5)])
    Tests.assertStrEquals(["20121231"], [DateUtils.getDateStr(2012, 12, 31)])

if __name__ == '__main__':
  Tests.runTests()
  stock = sys.argv[1]
  year = int(sys.argv[2])
  main(stock, year)
