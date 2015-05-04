Template.cluescreen.helpers({
	activeClue: function() {
		return Rooms.findOne({_id: Meteor.user().currentRoom}).activeClue.question;
	},

	moneyDisplay: function() {
		console.log(Rooms.findOne({_id: Meteor.user().currentRoom}).activeClue.worth);
		if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentState == 2) {
			return '<div class="money-display">$' + Rooms.findOne({_id: Meteor.user().currentRoom}).activeClue.worth + '</div>';
		}
		else {
			return "";
		}
	},

	startDisable: function() {
		var allReady = true;
		var players = Rooms.findOne({_id: Meteor.user().currentRoom}).players;
		for (i = 0; i < players.length; i++) {
			if (players[i].readyStatus == false)
				allReady = false;
		}
		return allReady ? "" : "disabled";
	},

	owner: function() {
		return Rooms.findOne({_id: Meteor.user().currentRoom}).ownerId == Meteor.userId();
	},

	buzzer: function() {
		return Rooms.findOne({_id: Meteor.user().currentRoom}).answeringPlayer != Meteor.userId();
	}

});

Template.cluescreen.events({
	"click #start": function(event) {
		Meteor.call("startGame", Meteor.user().currentRoom);
	},

	"click #ready": function (event) {
		Meteor.call("toggleReady", Meteor.user().currentRoom, Meteor.user()._id);
	},

	"submit form": function(event) {
		event.preventDefault();
		var answer = $("#answer").val();
		Meteor.call("checkAnswer", answer);
	},

	"click #buzzer": function(event) {
		event.preventDefault();
		if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentState == 4)
			Meteor.call("buzzIn");
	}

});

/* states

0: pregame
1: player choosing a clue
2: money display, disable buttons, 2 seconds
3: clue display, 4 seconds
4: players buzzing in, 5 seconds
5: player answering, 5 seconds, back to state 1
6: if all clues selected, end game
*/