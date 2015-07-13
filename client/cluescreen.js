Template.cluescreen.helpers({
	activeClue: function() {
		return Rooms.findOne({_id: Meteor.user().currentRoom}).activeClue.question;
	},

	playerAnswer: function() {
		return Rooms.findOne({_id: Meteor.user().currentRoom}).currentPlayerAnswer;
	},

	answerCorrect: function() {
		if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentAnswerCorrect) {
			return '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>';
		}
		else if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentAnswerCorrect == false)
		{
			return '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>';
		}
		else {
			return '';
		}
	},

	theCorrectAnswer: function() {
		if (Rooms.findOne({_id: Meteor.user().currentRoom}).correctAnswer != null) 
			return "Correct answer: " + Rooms.findOne({_id: Meteor.user().currentRoom}).correctAnswer;

		else
			return "";

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
		if (Rooms.findOne({_id: Meteor.user().currentRoom}).answeringPlayer != Meteor.userId()) {
			if (Rooms.findOne({_id: Meteor.user().currentRoom}).players[Meteor.user().playerSlot].incorrect)
				return false;
			return true;
		}
		return false;
	},

	incorrect: function() {
		var slot = Meteor.user().playerSlot;
		return Rooms.findOne({_id: Meteor.user().currentRoom}).players[slot].incorrect;
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