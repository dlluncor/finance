import logging
import ystockquote

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
