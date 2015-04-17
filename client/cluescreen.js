Template.cluescreen.helpers({
	activeClue: function() {
		if (Session.get("currentclue") != undefined && Session.get("game_categories") != undefined) {
			var cat = Session.get("currentclue").categorynumber;
			var cluenum = Session.get("currentclue").question;

			console.log("game_categories." + cat + ".clues[" + cluenum + "]");
			return Session.getJSON("game_categories." + cat + ".clues[" + cluenum + "]");
		}

		else {
			return "";
		}
		
	}
})