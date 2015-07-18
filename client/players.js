Template.players.helpers({
	playerAnswering: function() {
		if (Template.currentData().playerid == Rooms.findOne().answeringPlayer)
			return "player-answering";
		else
			return "";
	},

	readyStatus: function() {
		if (Template.currentData().readyStatus == true) {
			return "Ready";
		}
		else
			return "Not ready"
	},

	currentPlayer: function() {
		if (Template.currentData().playerid == Rooms.findOne().activePlayer) {
			return '<span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>';
		}
		else
			return "";
	},

	isWinner: function() {
		if(Template.currentData().isWinner) {
			return "WINNER!";
		}
		else
			return "";
	}
})