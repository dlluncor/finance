# What is the correlation of two stocks for time periods X and Y?
from stock_util import StockUtils
from util import DateUtils
from ticker_symbols import nasdaqtrader
from yahoo_stock_table import YahooStockTable

import itertools
import logging
import numpy
import sys

class Question3(object):
  def __init__(self, start_date, end_date):
    self.start_date = start_date
    self.end_date = end_date
  
  def fformat(self, nums):
    for num in nums:
      logging.info('%.2f' % num,)

  def get_correlation(self, stocks):
    """Returns a correlation matrix defined by numpy.corrcoef.
      Basically if you pass in 3 stocks (0, 1, 2)
      Then corr[0][2] or corr[2][0] will tell the correlation of 0 and 2.
 
     Correlation is: Var(A * B) / Stdev(A) * Stdev(B)
    """
    lists_of_changes = []
    for stock in stocks:
      tbl = YahooStockTable.make_data_table(stock, self.start_date, self.end_date)
      closing = tbl.getAllClosing()
      pct_changes = StockUtils.getPercentChanges(closing)
      lists_of_changes.append(pct_changes)

    for changes in lists_of_changes:
      logging.info(self.fformat(changes))
    corr = numpy.corrcoef(lists_of_changes)
    return corr # correlation matrix

  @staticmethod
  def main_correlations(stocks, start_date, end_date):
    q3 = Question3(start_date, end_date)
    correlations = q3.get_correlation(stocks)
    # Find all pairwise combinations of 0 to length of stocks.
    pair_indices = itertools.combinations([i for i in range(0, len(stocks))], 2)
    results = []
    for pair in pair_indices:
      ind = pair[0]
      ind2 = pair[1]
      cor = correlations[ind][ind2]
      result = {}
      result['stock1'] = stocks[ind]
      result['stock2'] = stocks[ind2]
      result['correlation'] = '%.2f' % cor
      results.append(result)
    # Sort the results
    def sorter(left, right):
      return int(float(left['correlation']) * 100.0 - 
             float(right['correlation']) * 100.0)
    results.sort(sorter)
    return results

  @staticmethod
  def main(stocks, year):
    start_date = DateUtils.getDateStr(year, 1, 1)
    end_date = DateUtils.getDateStr(year, 12, 30)
    return Question3.main_correlations(stocks, start_date, end_date)

if __name__ == '__main__':
  year = int(sys.argv[1])
  start_date = DateUtils.getDateStr(year, 1, 1)
  end_date = DateUtils.getDateStr(year, 12, 30)
  q3 = Question3(start_date, end_date)
  stocks = ['GOOG', 'MSFT', 'AAPL']
  # Schwab suggestion on being aggressive.
  stocks = ['JAVTX', 'OAKIX', 'HIINX', 'BIAGX', 'NOSGX', 'DGAGX', 'PQIAX']
  print Question3.main_correlations(stocks, start_date, end_date)
