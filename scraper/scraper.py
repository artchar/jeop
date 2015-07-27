# SCRAPE J-ARCHIVE

import json
from bs4 import BeautifulSoup
import urllib2

# Download j-archive html files
# Use Beautiful Soup to parse files
# Store categories, questions, and answers in JSON documents, save to files

# This function finds categories that don't have all the clues
def clueIterate(dontuse, cat, soup, round):
	for clue in range(1, 6):
		if round == 1:
			prefix = "clue_J_"
		else:
			prefix = "clue_DJ_"
		clueid = prefix + str(cat) + "_" + str(clue)
		print clueid
		if soup.find(id=clueid) == None or "a href" in str(soup.find(clueid)):
			dontuse.append(cat)
			return



# Loop through games
for i in range(2348, 2581):
	url = "http://www.j-archive.com/showgame.php?game_id=" + str(i)
	html = urllib2.urlopen(url)

	soup = BeautifulSoup(html, 'lxml')

	if soup.find(class_="category_name") == None:
		continue
	
	filename = str(i) + ".json"
	fd = open(filename, "w")


	# Get categories that don't have 5 clues
	dontuse = []
	dontuse2 = []

	for category in range(1, 7):
		clueIterate(dontuse, category, soup, 1)

	for category in range(1, 7):
		clueIterate(dontuse2, category, soup, 2)
	print dontuse
	print dontuse2


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

	# Get the clues from single and double Jeoaprdy rounds
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
		fd.write("\n")

	for category in range(1, 7):
		entry2 = {}
		entry2["clues"] = []

		if category in dontuse2:
			continue

		# Get category name and comments
		cat2 = soup.findAll(class_="category_name")[(category+6)-1].get_text()
		print cat2
		

		if soup.findAll(class_="category_comments")[(category+6)-1].contents != []:
			catComments2 = soup.findAll(class_="category_comments")[(category+6)-1].contents[0]
		else:
			catComments2 = ""

		# Save category and comments to JSON doc	

		entry2["category"] = cat2
		entry2["comments"] = catComments2
		
		# Save clues and save them to the 
		for clue in range(1, 6):
			clueid2 = "clue_DJ_" + str(category) + "_" + str(clue)
			clu2 = soup.find("td", id=clueid2)
			cluAnswer2 = answerDictionary[clueid2]
			clueObject2 = {"question": clu2.get_text(), "answer": [cluAnswer2]}
			entry2["clues"].append(clueObject2)
		entry2 = json.dumps(entry2)
		fd.write(entry2)
		fd.write("\n")
		
	fd.close()
