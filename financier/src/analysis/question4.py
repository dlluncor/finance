from yahoo_stock_table import YahooStockTable
from stock_util import StockUtils

import math
import random

def choose(n, k):
  numer = 1
  for x in range(n, n-k, -1):
    numer = numer * x
  return numer / math.factorial(k)

class Question4(object):
  """
    Trying to understand whether there is any long term benefit to rebalancing
    one's portfolio after the end of the year.

    Also examining whether there is a benefit to spreading one's assets across
    multiple classes or whether it is better to heavily favor one stock
    over another.
  """
  def __init__(self, start_date, end_date):
    self.start_date = start_date
    self.end_date = end_date

  def get_return(self, stock):
    """Gets the return on a particular stock for the particular
       start_date and end_date.
        
       If one had a 5% gain, this will return 1.05
       If one had a 10% loss, this will return 0.9
    """
    ytable = YahooStockTable.make_data_table(stock, self.start_date, self.end_date)
    closing_values = ytable.getAllClosing()
    return StockUtils.getTotalReturn(closing_values)

  def get_returns(self, stocks):
    """Gets the returns as an array for a set of stocks.
       5% gain and then 10% loss will be [1.05, 0.9]
    """
    stock_returns = []
    for stock in stocks:
      stock_returns.append(self.get_return(stock))
    return stock_returns    

  def get_optimal_mix(self, stock_returns):
    """Gets the optimal mix and information about the return on that
       mix (always 100% the best performing stock)."""
    max_value = max(stock_returns)
    max_value_index = stock_returns.index(max_value)
    ans = {}
    ans['stock'] = stocks[max_value_index]
    ans['return'] = max_value
    return ans

  def get_possibilities(self, stocks, bins=20):
    """Gives the number of ways to divide up money across these stocks, 
       assuming you can split 1 dollar in B number of bins.
       If you can split 1 dollar into 20 bins there are 20 cookies
       and with N stocks, you have C(20 + N - 1, N - 1) to divide that
       money.
    """
    N = len(stocks)
    combinations = choose(bins + N - 1, N - 1)

  @staticmethod
  def equal_allocation(stocks):
    N = len(stocks)
    return [1.0 / N for stock in stocks]
  @staticmethod
  def random_allocation(stocks, bins=20):
    """Suppose three stocks, might return [0.2, 0.5, 0.3]"""
    allocation = [] 
    N = len(stocks)
    inc = 1.0 / bins
    allocations = [0.0 for i in range(0, N)]
    for ind in range(0, bins):
      stock_ind = random.randint(0, N-1)
      allocations[stock_ind] += inc
    return allocations

  @staticmethod
  def get_returns_with_alloc(returns, allocations):
    """Suppose [1.05, 1.10] and allocated [0.5, 0.5] then return is 1.075"""
    N = len(returns)
    total = 0
    for ind in range(0, N):
      total += returns[ind] * allocations[ind]
    return total

  def run_simulations(self, stocks, num_simulations, bins=20):
    returns = self.get_returns(stocks)
    optimal_obj = q4.get_optimal_mix(returns)
    optimal_return = optimal_obj['return']
    rand_returns = []
    for ind in range(0, num_simulations):
      allocations = Question4.random_allocation(stocks)
      rand_return = Question4.get_returns_with_alloc(returns, allocations)
      ans = {}
      ans['return'] = rand_return
      ans['allocation'] = allocations
      rand_returns.append(ans)

    print 'Optimal: %.1f' % (optimal_return * 100)
    print 'Stocks: %s' % str(stocks)
    print 'Their returns: %s' % (str(['%.1f' % (ret * 100) for ret in returns]))
    # Optimal, actual (absolute missed gain)
    diffs = []
    for rand_return in rand_returns:
      rand_return_num = rand_return['return']
      diff = rand_return_num - optimal_return
      diffs.append(diff)
      alloc = str([ '%.1f' % alloc for alloc in rand_return['allocation'] ])
      print 'Alloc: %s, Actual: %.1f, Difference: %.1f' % (alloc, rand_return_num * 100, diff * 100)
    print 'Average diff: %.1f' % (sum(diffs) / len(diffs) * 100.0)

    # Even distribution off
    even_alloc = [1.0/len(stocks) for stock in stocks]
    even_return = Question4.get_returns_with_alloc(returns, even_alloc)
    print 'Even allocation diff: %.1f' % ((even_return - optimal_return) * 100)

  def is_rebal_good(self, stocks, allocations, freq_days):
    """If I rebalance every freq_days, how does it affect my overall value?
    """
    all_rebal_vals = []
    for stock in stocks:
      rebal_vals = self.get_rebal_values(stock, freq_days)
      all_rebal_vals.append(rebal_vals)
    print 'Rebalance values:\n %s' % str(all_rebal_vals)

    # We need all the rebalance values to have the same length.
    # Assume we start off with a dollar.
    num_stocks = len(stocks)
    num_rebalances = len(all_rebal_vals[0])
    cur_value = 1
    for ind in range(0, num_rebalances - 1):
      returns = []
      # Get returns for stocks after each time period.
      for stock_ind in range(0, num_stocks):
        stock_rebal = all_rebal_vals[stock_ind] # Gets list of values.
        start = stock_rebal[ind]
        closing = stock_rebal[ind + 1]
        return_value = 1 + StockUtils.getTotalReturn([start, closing])
        returns.append(return_value)
      print 'Returns after rebalance %d is:\n %s' % (ind, str(returns))
      cur_return = Question4.get_returns_with_alloc(returns, allocations)
      cur_value = cur_value * cur_return
    print 'Rebalance return value: %.3f' % (cur_value)

    # Simple approach.
    simple_returns = []
    for stock_ind in range(0, num_stocks):
      stock_rebal = all_rebal_vals[stock_ind]
      cur_return = StockUtils.getTotalReturn(stock_rebal)
      simple_returns.append(cur_return)
    final_return = Question4.get_returns_with_alloc(simple_returns, allocations)
    print 'Simple return value: %.3f' % (1 + final_return)
    
      

  def get_rebal_values(self, stock, freq_days):
    """What are my closing values on rebalancing days.
    """
    ytable = YahooStockTable.make_data_table(stock, self.start_date, self.end_date)
    closing_values = ytable.getAllClosing()
    total_days = len(closing_values)
    print 'Total num days: %d'  % total_days 
    # Construct closing values after each end of frequency days.
    num_realloc = total_days / freq_days
    # Construct closing_values for only the days you start investing and when you reallocate
    # your money.
    realloc_day = 0
    rebal_values = []
    for ind in range(0, num_realloc + 1):
      # To ensure we stay within bounds of days.
      day = min(realloc_day, total_days-1)
      print 'Reallocating at day: ' + str(day)
      rebal_values.append(closing_values[day])
      realloc_day += freq_days
    return rebal_values
      
    
class Tests(object):
  @staticmethod
  def assertEquals(val, val2):
    if val != val2:
      raise AssertionError("Expected: " + str(val) + " Actual: " + str(val2))

  @staticmethod
  def run():
    Tests.assertEquals(6, choose(4, 2))
    
if __name__ == '__main__':
  Tests.run()
  #stocks = ['GOOG', 'MSFT', 'AAPL']
  start_date = '20060101'
  end_date = '20120710'
  q4 = Question4(start_date, end_date)
  stocks = ['JAVTX', 'OAKIX', 'HIINX', 'BIAGX', 'NOSGX', 'DGAGX', 'PQIAX']
  #q4.run_simulations(stocks, 10)
  allocations = Question4.equal_allocation(stocks)
  print allocations
  q4.is_rebal_good(stocks, allocations, 360)
