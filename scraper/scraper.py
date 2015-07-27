# SCRAPE J-ARCHIVE

import json
from bs4 import BeautifulSoup
import urllib2

# Download j-archive html files
# Use Beautiful Soup to parse files
# Store categories, questions, and answers in JSON documents, save to files

# This function finds categories that don't have all the clues
def clueIterate(list, cat, soup):
	for clue in range(1, 6):
			clueid = "clue_J_" + str(cat) + "_" + str(clue)
			if soup.find(id=clueid) == None or "a href" in str(soup.find(clueid)):
				dontuse.append(cat)
				return



# Loop through games
for i in range(1147, 1200):
	filename = str(i) + ".json"
	fd = open(filename, "w")
	url = "http://www.j-archive.com/showgame.php?game_id=" + str(i)
	html = urllib2.urlopen(url)

	soup = BeautifulSoup(html, 'lxml')

	# Get categories that don't have 5 clues
	dontuse = []

	for category in range(1, 7):
		clueIterate(dontuse, category, soup)


	# Get the answers and store them in a dictionary, with the clue id as the keys	
	answerDictionary = {}

	answers = soup.findAll("div", onmouseover=True)

	for a in answers:
		try:
			a = a.get("onmouseover")
			a = BeautifulSoup(a, "lxml")
			a = a.find("p")
			a_key = a.contents[0].string[8:19]
			if a_key[-1] == "'":
				a_key = a_key[:-1]
			a_answer = a.find(class_="correct_response").contents[0].string
			answerDictionary[a_key] = a_answer

		except AttributeError:
			pass

	# Get the clues from single Jeoaprdy round
	for category in range(1, 7):
		entry = {}
		entry["clues"] = []
		if category in dontuse:
			continue

		# Get category name and comments
		cat = soup.findAll(class_="category_name")[category-1].get_text()
		print cat
		
		if soup.findAll(class_="category_comments")[category-1].contents != []:
			catComments = soup.findAll(class_="category_comments")[category-1].contents[0]
		else:
			catComments = ""

		# Save category and comments to JSON doc	
		entry["category"] = cat
		entry["comments"] = catComments	

		
		# Save clues and save them to the 
		for clue in range(1, 6):
			clueid = "clue_J_" + str(category) + "_" + str(clue)
			clu = soup.find("td", id=clueid)
			cluAnswer = answerDictionary[clueid]
			clueObject = {"question": clu.get_text(), "answer": [cluAnswer]}
			entry["clues"].append(clueObject)
		entry = json.dumps(entry)
		fd.write(entry)
		
	fd.close()


