for f in done_clues/*.json
do
	mongoimport --host production-db-d2.meteor.io --port 27017 --username client-195be45d --password 1247bbb7-c5d7-23d4-d234-ccf022cd1475 --db jepp_meteor_com --collection clues --file $f
done
