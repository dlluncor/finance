# What is the correlation of two stocks for time periods X and Y?
from stock_util import StockUtils
from util import DateUtils
from ticker_symbols import nasdaqtrader
from yahoo_stock_table import YahooStockTable

import itertools
import logging
import numpy
import sys

class Question5(object):
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
  def main_fundamentals(stocks, start_year):
    start_date = DateUtils.getDateStr(start_year, 1, 2)
    end_date = DateUtils.getDateStr(start_year, 1, 3)
    for stock in stocks:
      dt = YahooStockTable.make_data_table(stock, start_date, end_date)
      print dt.header
      print dt.table
    return ''

  @staticmethod
  def main(stocks, year):
    start_date = DateUtils.getDateStr(year, 1, 1)
    end_date = DateUtils.getDateStr(year, 12, 30)
    return Question5.main_correlations(stocks, start_date, end_date)

if __name__ == '__main__':
  start_year = int(sys.argv[1])
  #q5 = Question5(start_date, end_date)
  stocks = ['RUE']
  print Question5.main_fundamentals(stocks, start_year)
