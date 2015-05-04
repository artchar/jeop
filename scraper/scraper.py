# SCRAPE J-ARCHIVE

import json
from bs4 import BeautifulSoup
import urllib2

# Download j-archive html files
# Use Beautiful Soup to parse files
# Store categories, questions, and answers in JSON documents, save to files