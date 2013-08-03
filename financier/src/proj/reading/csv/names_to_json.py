

import csv
import json


def firstNamesDict():
  r = csv.reader(open('./proj/reading/csv/firstnames.csv', 'r'))
  d = []
  for row in r:
  	el = row[0]
  	d.append(el)
  return d

def lastNamesDict():
  r = csv.reader(open('./proj/reading/csv/lastnames.csv', 'r'))
  d = []
  for row in r:
  	el = row[0]
  	d.append(el)
  return d

def main():
  print "About to write to file."
  out = open('./proj/reading/js/names_db.js', 'w')
  out.write('var lastnames = %s;\n' % json.dumps(lastNamesDict()))
  out.write('var firstnames = %s;\n' % json.dumps(firstNamesDict()))
  out.close()


main()