"""File that contacts the MedlinePlusConnect service.
Author: David Lluncor
Date: 9/23/2012
"""
import logging
import urllib

from xml.etree import ElementTree

class Connector(object):
  FEED_INDEX_START = 1
  def __init__(self):
    pass

  def ParseEntry(self, entry_node):
    """
    Parameters:
      entry_node: An ElementTree node.
    """
    text = ''
    for child in entry_node:
      if 'summary' in child.tag:
        logging.info(dir(child))
        logging.info('Summary node: ' + str(child.text))
        return child.text

  def Request(self):
    url = ("http://apps.nlm.nih.gov/medlineplus/services/mpconnect_service.cfm"
           "?mainSearchCriteria.v.cs=2.16.840.1.113883.6.96&mainSearchCriteria.v.c"
           "=195967001&mainSearchCriteria.v.dn=&informationRecipient.languageCode.c=en")
    handle = urllib.urlopen(url)
    xml_response = handle.readlines()[Connector.FEED_INDEX_START]
    root = ElementTree.fromstring(xml_response)
    entry_texts = []
    for child in root:
      if 'entry' in child.tag:
        entry_texts.append(self.ParseEntry(child))
    return entry_texts

def Ask():
  conn = Connector()
  return conn.Request()
