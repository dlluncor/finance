from stock_util import StockUtils
from util import DateUtils
from yahoo_stock_table import YahooStockTable

import sys

# Question: what is the variance and average return month to month
# for GOOG?
class Question1(object):
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
    avg_return = StockUtils.getAverageReturn(values)
    total_return = StockUtils.getTotalReturn(values)
    stdev_return = StockUtils.getStdevReturn(values)
    closing_val_range = '%.2f to %.2f' % (values[0], values[-1])
    line = '%s\t%.2f\t%.2f\t%.2f\t%s' % (first_col_title, avg_return * 100, 
                                             total_return * 100, stdev_return * 100,
                                             closing_val_range)
    cols = {"cols": line.split("\t")}
    return (cols, total_return)

  @staticmethod
  def print_report(yahoo_tables, do_plot=False):
    """Given a yahoo stock table prints a report.

    average return, standard deviation, total return
    """
    results = []
    headers = ['Date Range', 'Average Return (%)', 'Total Return (%)', 'Standard deviation', 
               'Closing stock range']
    results.append({"cols": headers})

    total_returns = []
    for yahoo_table in yahoo_tables:
      try:
        closing_vals = yahoo_table.getAllClosing()
        dates = yahoo_table.getAllDates()
        first_col_title = '%s to %s' % (dates[0], dates[-1])
        (line, total_return) = Question1.create_report_line(closing_vals, first_col_title)
        results.append(line)
        total_returns.append(total_return)
        if do_plot:
          closing_vals = yahoo_table.getAllClosing()
          Plotter.plot(StockUtils.getPercentChanges(closing_vals)) 
      except Exception:
        pass
    # Only do this for more or one tables.
    if len(yahoo_tables) <= 1:
      return results
    # Compound your month to month returns.
    all_return = StockUtils.getCompoundedReturn(total_returns)
    gain = all_return - 1
    gain_line = {"cols": ['Total return by putting in each month style: %.2f percent.' % (
      gain * 100)]}
    results.append(gain_line)
    return results

  @staticmethod
  def main(ticker_symbol, year):
    """Returns an array of results (where each result is a line of text)."""
    tbls = Question1.makeMonthlyTables(ticker_symbol, year)
    results1 = Question1.print_report(tbls, False)
    yearly_tbl = Question1.makeYearlyTable(ticker_symbol, year)
    results2 = Question1.print_report([yearly_tbl], False)
    return results1 + results2

if __name__ == '__main__':
  stock = sys.argv[1]
  year = int(sys.argv[2])
  print Question1.main(stock, year)
