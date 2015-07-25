# SCRAPE J-ARCHIVE

import json
from bs4 import BeautifulSoup
import urllib2

# Download j-archive html files
# Use Beautiful Soup to parse files
# Store categories, questions, and answers in JSON documents, save to files

for i in range(2542, 2543):
	url = "http://www.j-archive.com/showgame.php?game_id=" + str(i)
	html = urllib2.urlopen(url)

	soup = BeautifulSoup(html, 'html.parser')

	# Get categories that don't have 5 clues

	for category in range(1, 6):
		for clue in range(1, 5):
			clueid = "clue_J_" + str(category) + "_" + str(clue))
			if soup.find(id=clueid) == None or "a href" in str(soup.find(clueid):
				print i
				print category
				print clued
	#if "a href" in str(soup.find(id="clue_J_1_1")):
	print type(str(soup.find(id="clue_J_1_1")))