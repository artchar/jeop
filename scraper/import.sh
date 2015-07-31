for f in done_clues/*.json
do
	mongoimport --host production-db-d2.meteor.io --port 27017 --username client-54b0388e --password e4dfd533-9702-e09a-cf65-40c5f81ff4fc --db jepp_meteor_com --collection clues --file $f
done
