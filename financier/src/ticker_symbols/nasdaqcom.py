import csv
import os

class TickerSymbols(object):
  """
    Original website: 
      http://www.nasdaq.com/screening/company-list.aspx
    Current list of files being parsed this way:
      nasdaq_nasdaqcom.csv
      nyse_nasdaqcom.csv
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
    reader = csv.reader(open(filename, 'r'), delimiter=',')
    tbl = []
    for row in reader:
      rw = []
      for col in row:
        rw.append(col)
      tbl.append(rw)
    return tbl

  def getCompanyName(self, rowIndex):
    return self.table[rowIndex][TickerSymbols.COMPANY_NAME]

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
    name = os.path.join(os.path.dirname(__file__), 'nasdaq_nasdaqcom.csv')
    symbols = TickerSymbols(name)
    return symbols.getNameToTicker()

if __name__ == '__main__':
  name = os.path.join(os.path.dirname(__file__), 'nasdaq_nasdaqcom.csv')
  symbols = TickerSymbols(name)
  d = symbols.getNameToTicker()
  print d
