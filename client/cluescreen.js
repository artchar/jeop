Template.cluescreen.helpers({
	activeClue: function() {
		return Rooms.findOne({_id: Meteor.user().currentRoom}).activeClue;
	},

	moneyDisplay: function() {
		console.log("here");
		if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentState == 2) {
			console.log("good");
			return '<div class="money-display">$500</div>';
		}
		else {
			console.log("bad");
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
		if (Rooms.findOne({_id: Meteor.user().currentRoom}).ownerId == Meteor.userId())
			return true;
		else
			return false;
	},

	buzzer: function() {
		if (Rooms.findOne({_id: Meteor.user().currentRoom}).answeringPlayer == Meteor.userId())
			return false;
		else
			return true;
	}

})

Template.cluescreen.events({
	"click #start": function(event) {
		Meteor.call("startGame", Meteor.user().currentRoom);
	},

	"click #ready": function (event) {
		Meteor.call("toggleReady", Meteor.user().currentRoom, Meteor.user()._id);
	},

	"submit form": function(event) {
		event.preventDefault();
		alert("hi");
		Meteor.call("checkAnswer")
	},

	"click #buzzer": function(event) {
		event.preventDefault();
		if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentState == 4)
			Meteor.call("buzzIn");
	}

})

/* states

0: pregame
1: player choosing a clue
2: money display, disable buttons, 2 seconds
3: clue display, 4 seconds
4: players buzzing in, 5 seconds
5: player answering, 5 seconds, back to state 1
6: if all clues selected, end game
*/