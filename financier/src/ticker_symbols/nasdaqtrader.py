import csv
import os

class TickerSymbols(object):
  """
    Good google query: list of all stocks on the nasdaq
      http://www.nasdaqtrader.com/Trader.aspx?id=symbollookup
    Files:
      nasdaq_nasdaqtrader.csv
      mutualfunds_nasdaqtrader.csv
  """
  # Column numbers
  SYMBOL = 0
  COMPANY_NAME = 1
  # Row information
  DATA_START = 1
  def __init__(self, filename):
    self.filename = filename
    self.table = self.makeTable(filename)

  def makeTable(self, filename):
    reader = csv.reader(open(filename, 'r'), delimiter='|')
    tbl = []
    for row in reader:
      rw = []
      for col in row:
        rw.append(col)
      tbl.append(rw)
    return tbl

  def getCompanyName(self, rowIndex):
    # Get rid of the all text after the -
    orig_name = self.table[rowIndex][TickerSymbols.COMPANY_NAME]
    ind = orig_name.rfind('-')
    if ind == -1:
      return orig_name
    else:
      return orig_name[0:ind]

  def getTickerSymbol(self, rowIndex):
    return self.table[rowIndex][TickerSymbols.SYMBOL]

  def getNameToTicker(self):
    nameToTicker = {}
    for ind in range(TickerSymbols.DATA_START, len(self.table)):
      name = self.getCompanyName(ind)
      ticker = self.getTickerSymbol(ind)
      nameToTicker[name] = ticker
    return nameToTicker

  @staticmethod
  def getSymbolMap():
    """Gets the main symbol map associated with this."""
    name = os.path.join(os.path.dirname(__file__), 'nasdaq_nasdaqtrader.csv')
    symbols = TickerSymbols(name)
    return symbols.getNameToTicker()

  @staticmethod
  def getMututalFundMap():
    """Gets a map of names to ticker symbols for mutual funds."""
    name = os.path.join(os.path.dirname(__file__), 'mutualfunds_nasdaqtrader.csv')
    symbols = TickerSymbols(name)
    return symbols.getNameToTicker()   

  @staticmethod
  def getNasdaqMap():
    """Gets a map of names to ticker symbols for NASDAQ."""
    name = os.path.join(os.path.dirname(__file__), 'nasdaq_nasdaqtrader.csv')
    symbols = TickerSymbols(name)
    return symbols.getNameToTicker()

if __name__ == '__main__':
  name = os.path.join(os.path.dirname(__file__), 'nasdaq_nasdaqtrader.csv')
  symbols = TickerSymbols(name)
  d = symbols.getNameToTicker()
  print d
