
import simplejson

class Constants:
  """Maps the column index to the two sig digits of the ztable."""
  COL_TO_DEC = {
    1: 0.00,
    2: 0.01,
    3: 0.02,
    4: 0.03,
    5: 0.04,
    6: 0.05,
    7: 0.06,
    8: 0.07,
    9: 0.08,
    10: 0.09
  }

def parseZscoreTsv(inputfile, outputfile):
  """Parses a zscore table to a JSON file."""
  zscore_to_cdf = {}
  tsv = open(inputfile, 'r')
  col_to_dec = Constants.COL_TO_DEC
  for line in tsv.readlines():
    els = line.split('\t')
    if not els:
      continue
    if els[0] == 'z':
      continue
    first_part = float(els[0])
    for index in xrange(len(els)):
      if index == 0:
        continue
      second_part = float(col_to_dec[index])
      zscore = first_part + second_part
      if first_part < 0:
        zscore = first_part - second_part
      print zscore
      cdf = els[index].replace('\n', '')
      zscore_as_str = '%.2f' % zscore
      zscore_to_cdf[zscore_as_str] = cdf

  print_out_dict = simplejson.dumps(zscore_to_cdf)
  print print_out_dict
  tsv.close()
  fd = open(outputfile, 'w')
  fd.write('var ztable = %s;' % print_out_dict)
  fd.close()

class Constants2:
  """In a t-table map of column index to two-sided significance level."""
  COL_TO_SIGLEVEL = {
    1: 0.20,
    2: 0.10,
    3: 0.05,
    4: 0.02,
    5: 0.01,
    6: 0.005,
    7: 0.002,
    8: 0.001
  }

class TTableObj(object):
  def __init__(self, df, critical_t, p_value):
    self.df = df
    self.critical_t = critical_t
    self.p_value = p_value

  def AsDict(self):
    d = {
      'df': int(self.df),
      'critical_t': float(self.critical_t),
      'p_value': float(self.p_value)
    }
    return d
    

def _RemoveIllegals(els):
  new_els = []
  for el in els:
    nel = el.replace(' ', '')
    nel = nel.replace('\n', '')
    if nel:
      new_els.append(nel)
  return new_els

def parseTtableTsv(inputfile, outputfile):
  """Parses a ttable to a JSON file."""
  # An array of t-value objects with the following
  # format. 
  # {'df': degree_of_freedom (20), 'p_value': 0.05, 'critical_t': 2.093}

  tsv = open(inputfile, 'r')
  t_table_objects = []
  for line in tsv.readlines():
    els = line.split('\t')
    els = _RemoveIllegals(els)
    if not els:
      continue
    if els[0] == 'df':
      continue
    degree_of_freedom = els[0]
    for index in xrange(len(els)):
      if index == 0:
        continue
      critical_t = els[index]
      p_value = Constants2.COL_TO_SIGLEVEL[index]
      t_table_objects.append(TTableObj(degree_of_freedom, critical_t, p_value))

  t_table_strs = [obj.AsDict() for obj in t_table_objects]
  print_out_arr = simplejson.dumps(t_table_strs)

  tsv.close()
  fd = open(outputfile, 'w')
  fd.write('var ttable = %s;' % print_out_arr)
  fd.close()


class FConstants(object):
  ind_to_df = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    11: 12,
    12: 15,
    13: 20,
    14: 24,
    15: 30,
    16: 40,
    17: 60,
    18: 120,
    19: 150
  }

# Returns an object, {df2: {df1: critical_f}}
def parseFtableTsv(inputfile, outputfile):
  tsv = open(inputfile, 'r')

  d = {}
  row = 0
  for line in tsv.readlines():
    row += 1
    els = line.split('\t')
    els = _RemoveIllegals(els)
    if not els:
      continue
    if els[0] == '/':
      # Skip the first line.
      continue

    col = 0
    df_2 = int(els[0])
    d[df_2] = {}
    for ind in xrange(len(els)):
      if ind == 0:
        continue
      df_1 = FConstants.ind_to_df[ind]
      critical_f = els[ind]
      d[df_2][df_1] = critical_f
      col += 1

  print d[30][30]
  print_out = simplejson.dumps(d)
  fd = open(outputfile, 'w')
  fd.write('var ftable = %s;' % print_out)
  fd.close()


class ChiSquareConstants(object):
  ind_to_p = {
    0: 0.05,
    1: 0.01,
    2: 0.001
  }
# Returns an object, {df: {p_value: critical_chi_square}}
def parseChiSquaretableTsv(inputfile, outputfile):
  tsv = open(inputfile, 'r')

  d = {}
  lines = tsv.readlines()
  for row in xrange(len(lines)):
    line = lines[row]
    els = line.split('\t')
    els = _RemoveIllegals(els)
    if not els:
      continue

    df = row + 1
    d[df] = {}
    for ind in xrange(len(els)):
      pval = ChiSquareConstants.ind_to_p[ind]
      critical_val = els[ind]
      d[df][pval] = critical_val

  expected = d[10][0.05]
  assert expected == '18.31'
  print_out = simplejson.dumps(d)
  fd = open(outputfile, 'w')
  fd.write('var chisquaretable = %s;' % print_out)
  fd.close()

def main():
  #parseZscoreTsv('zscore.tsv', 'ztable.js')
  #parseTtableTsv('ttable.tsv', 'ttable.js')
  #parseFtableTsv('ftable.tsv', 'ftable.js')
  parseChiSquaretableTsv('chisquare.tsv', 'chisquaretable.js')

if __name__ == '__main__':
  main()
