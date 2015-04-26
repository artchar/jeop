Template.players.helpers({
	playerAnswering: function() {
		if (Template.currentData().playerid == Rooms.findOne().activePlayer)
			return "player-answering";
		else
			return "";
	}
})