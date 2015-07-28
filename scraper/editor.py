# edits json clues easier

import json

suffix = ".json"

fileNumber = raw_input("File number? ")
fd = open("clues/" + fileNumber + suffix, "r+w")
lines = fd.readlines()
newdata= []
for x in lines:
	 newdata.append(json.loads(x))

fd.seek(0,0)
fd.truncate()	 

for d in newdata:
	for i in range(0, 5):
		oldAnswers = d["clues"][i]["answer"]
		s = "q: " + d["clues"][i]["question"]
		print d["category"]
		print s
		print oldAnswers
		try:
			newAnswers = input("New answers: ")
		except SyntaxError:
			newAnswers = None
		if newAnswers != None:
			d["clues"][i]["answer"] += newAnswers 
	
	fd.write(json.dumps(d))
	fd.write("\n")

