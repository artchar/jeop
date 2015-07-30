for f in done_clues/*.json
do
	mongoimport --host production-db-d2.meteor.io --port 27017 --username client-0c281915 --password 6a22a92c-26f8-9772-8b11-83ea1d5e5767 --db jepp_meteor_com --collection clues --file $f
done
