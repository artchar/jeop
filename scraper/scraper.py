# SCRAPE J-ARCHIVE

import json
from bs4 import BeautifulSoup
import urllib2

# Download j-archive html files
# Use Beautiful Soup to parse files
# Store categories, questions, and answers in JSON documents, save to files

html = urllib2.urlopen("http://www.j-archive.com/showgame.php?game_id=1144")

soup = BeautifulSoup(html, 'html.parser')
print(soup.title.contents[0])