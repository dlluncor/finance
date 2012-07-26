# Given the standard deviation and mean of an asset class
# how do we expect it to do over time?
import csv
import os
import random
import sys

class Asset(object):
  YEARS = 10 # Let's say by default we run 10 year simulations.
  def __init__(self, name='', mean=0.0, stdev=1.0, years=YEARS):
    self.name = name
    self.mean = mean
    self.stdev = stdev
    self.years = years

  def run_finance_simulation(self):
    """Runs a financial simulation.
    Args:
      mean: mean return on asset class. (Ex 0.2 is 20%)
      stdev: standard deviation of asset class. (Ex 0.1 is 10%)
      years: number of years you invest that investment
    """
    # Assume you start with a dollar.
    investment = 1
    for year in range(0, self.years):
      year_growth = random.normalvariate(self.mean, self.stdev)
      #print 'Growth: %f' % year_growth
      investment *= (1 + year_growth)
      #print 'After year %d: %f' % (year, investment)
      return investment

  def __str__(self):
    return '%s (%d years): ' % (self.name, self.years)
    
class CsvReader(object):
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

  def getAssets(self):
    """Converts a csv to asset objects."""
    assets = []
    for row in self.table:
      asset = self.rowToAsset(row)
      assets.append(asset)
    return assets

  def rowToAsset(self, row):
    """Assume each row goes: name, mean, stdev."""
    name = row[0]
    mean = float(row[1])
    stdev = float(row[2])
    return Asset(name=name, mean=mean, stdev=stdev)

def main(years):
  """Runs the main simulation of financial fluctuation.
  
    Args:
      years: number of years to run the simulation for.

  """
  results = []
  filename = 'finances.csv'
  reader = CsvReader(filename)
  assets = reader.getAssets()

  finalToAsset = {}
  for asset in assets:
    asset.years = years # Set the number of years for all simulations.
    final_investment = asset.run_finance_simulation()
    finalToAsset[final_investment] = asset

  # Print the results
  dKeys = finalToAsset.keys()
  dKeys.sort(reverse=True)
  for final_investment in dKeys:
    asset = finalToAsset[final_investment]
    as_gain_or_loss = final_investment - 1
    results.append('%s %.2f' % (str(asset), as_gain_or_loss))
  return results

if __name__ == "__main__":
  main(100000)
