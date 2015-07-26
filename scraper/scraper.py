# SCRAPE J-ARCHIVE

import json
from bs4 import BeautifulSoup
import urllib2

# Download j-archive html files
# Use Beautiful Soup to parse files
# Store categories, questions, and answers in JSON documents, save to files

def clueIterate(list, cat, soup):
	for clue in range(1, 6):
			clueid = "clue_J_" + str(cat) + "_" + str(clue)
			if soup.find(id=clueid) == None or "a href" in str(soup.find(clueid)):
				dontuse.append(cat)
				return

for i in range(2542, 2600):
	url = "http://www.j-archive.com/showgame.php?game_id=" + str(i)
	html = urllib2.urlopen(url)

	soup = BeautifulSoup(html, 'html.parser')

	# Get categories that don't have 5 clues
	dontuse = []

	for category in range(1, 7):
		clueIterate(dontuse, category, soup)
	
	for category in range(1, 7):
		if category in dontuse:
			continue

		cat = soup.findAll(class_="category_name")[category].contents[0]
		catComments = soup.findAll(class_="category_comments")[category].contents[0]	
		
		for clue in range(1, 6):
			clueid = "clue_J_" + str(category) + "_" + str(clue)
		print cat



	#if "a href" in str(soup.find(id="clue_J_1_1")):
	#print type(str(soup.find(id="clue_J_1_1")))
	# for x in dontuse:
	# 	print url
	# 	print x