# edits json clues easier

import json

suffix = ".json"

fileNumber = raw_input("File number? ")
fd = open(fileNumber + suffix, "rw")
lines = fd.readlines()
newdata= []
for x in lines:
	 newdata.append(json.loads(x))

for d in newdata:
	for i in range(0, 5):
		oldAnswers = d["clues"][i]["answer"]
		print oldAnswers

		s = raw_input("q: " + d["clues"][i]["question"])
		print s
