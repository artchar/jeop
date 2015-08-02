for f in done_clues/*.json
do
	mongoimport --host apollo.modulusmongo.net --port 27017 --username tawwdmuncru --password ZsnakR97v --db en4ipuRi --collection clues --file $f
done
