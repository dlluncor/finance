from stock_util import StockUtils
from util import DateUtils
from ticker_symbols import nasdaqtrader
from yahoo_stock_table import YahooStockTable

import time
import sys

#What is the best stock for time period starting X and ending Y?
class Question2(object):

  def __init__(self, start_date, end_date):
    """Information about the stocks.
      Args:
         start_date: start date of analysis in YYYYMMDD
        end_date: end date of analysis in YYYYMMDD
    """
    self.start_date = start_date
    self.end_date = end_date

  def fformat(self, float_val):
    """"Formats floats."""
    return float('%.2f' % float_val)

  def getInformation(self, tbl):
    """Gets information tuple given a table of information."""
    values = tbl.getAllClosing()
    avg_return = StockUtils.getAverageReturn(values)
    total_return = StockUtils.getTotalReturn(values)
    stdev_return = StockUtils.getStdevReturn(values)
    info = {}
    info['avg_return'] = self.fformat(avg_return)
    info['total_return'] = self.fformat(total_return)
    info['stdev_return'] = self.fformat(stdev_return)
    dates = tbl.getAllDates()
    date_range = '%s to %s' % (dates[0], dates[-1])
    info['date_range'] = date_range
    closing_val_range = '%.2f to %.2f' % (values[0], values[-1])
    info['closing_range'] = closing_val_range
    return info
 
  def rank(self, stocks):
    """Ranks a collection of stocks given an end date and a start date
       based on a certain objective function.
      
      Args:
        stocks: list of ticker symbols
      Returns:
        an array of ordered stocks according to rank with some information
        as to why they were ranked a certain way.
    """
    def compareF(item1, item2):
      return int((item1['info']['total_return'] * 100) - (item2['info']['total_return'] * 100))
      
    stockInfos = []
    for stock in stocks:
      tbl = YahooStockTable.make_data_table(stock, start_date, end_date)
      #print tbl.table
      try:
        infoTuple = self.getInformation(tbl)
      except Exception:
        #print tbl.table
        continue
      sInfo = {}
      sInfo['info'] = infoTuple
      sInfo['stock_name'] = stock       
      stockInfos.append(sInfo)
    stockInfos.sort(compareF)
    return stockInfos

if __name__ == '__main__':
  year = int(sys.argv[1])
  start_date = DateUtils.getDateStr(year, 1, 1)
  end_date = DateUtils.getDateStr(year, 12, 30)
  stocks = nasdaqtrader.TickerSymbols.getNasdaqMap().values()
  stocks = stocks[0:10]
  #print stocks
  q2 = Question2(start_date, end_date)
  #print time.time()
  ranked_stocks = q2.rank(stocks)
  for rstock in ranked_stocks:
    line1 = rstock['stock_name'] + ' ' + str(rstock['info']['total_return']) + ' ' + str(rstock['info']['closing_range'])
    line2 = '(' + str(rstock['info']['date_range']) + ')'
    #print line1 + line2
  #print time.time()
