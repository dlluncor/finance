# This one has GOOG and other companies I am familiar with:
# http://www.eoddata.com/symbols.aspx

# Technical trading rules the FF? http://cran.r-project.org/web/packages/TTR/index.html
import nasdaqcom
import nasdaqtrader

NAME_TO_TICKER = nasdaqtrader.TickerSymbols.getSymbolMap()
#NAME_TO_TICKER = nasdaqcom.TickerSymbols.getSymbolMap()

def get_suggestions(query):
  """Gets suggestions for this particular query.
     Uses json structure needed for jquery.
  """
  query = query.lower() # Make everything case insensitive.
  names = NAME_TO_TICKER.keys()
  suggestions = []
  data = [] # The ticker symbols associated with each suggestion.
  for name in names:
    lowercasename = name.lower()
    # We should be case insensitive.
    if query in lowercasename:
      ticker = NAME_TO_TICKER[name]
      suggestions.append(name + '(' + ticker + ')')
      data.append(ticker)
  suggest_json = {}
  suggest_json['query'] = query
  suggest_json['suggestions'] = suggestions
  suggest_json['data'] = data
  return suggest_json

    

  
