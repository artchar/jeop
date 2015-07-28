# edits json clues easier

import json

suffix = ".json"

fileNumber = raw_input("File number? ")
fd = open(fileNumber + suffix, "rw")
lines = fd.readlines()
newdata= []
for x in lines:
	 newdata.append(json.loads(x))
print len(newdata)