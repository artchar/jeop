var han2dle = "HH";

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

	currentClueCategory: function() {
		if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentState == 2) {
			return Rooms.findOne({_id: Meteor.user().currentRoom}).activeClue.category;
		}
		else {
			return "";
		}
	},

	moneyDisplay: function() {
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
	},

	answerTimer: function() {
		if (Rooms.findOne({_id: Meteor.user().currentRoom}).answeringPlayer == Meteor.userId()) {
			if (Rooms.findOne({_id: Meteor.user().currentRoom}).answerTimer == 0) {
				$("#answer-form").submit();
				return ":00";
			}
			return ":0" + Rooms.findOne({_id: Meteor.user().currentRoom}).answerTimer;
		}
		else return "";
	},

	clueActiveTimer: function() {
		if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentState == 4) {
			return ":0" + Rooms.findOne({_id: Meteor.user().currentRoom}).clueActiveTimer;
		}
		else return "";
	},

	lightup: function() {
		if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentState == 4) {
			return "lightup";
		}
		else return "";
	}

});

Template.cluescreen.events({
	"click #start": function(event) {
		Meteor.call("startGame");
	},

	"click #ready": function (event) {
		Meteor.call("toggleReady");
	},

	"click #newgame": function(event) {
		Meteor.call("newGame");
	},

	"submit form": function(event) {
		event.preventDefault();

		var answer = $("#answer").val();
		$("#answer-form").hide();

		Meteor.setTimeout(function() {
			Meteor.call("checkAnswer", answer);
		}, 1200);

		Meteor.setTimeout(function() {
			$("#answer-form").show();
		}, 4000);
	},

	"click #buzzer": function(event) {
		event.preventDefault();
		if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentState == 4)
			Meteor.call("buzzIn");
		else if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentState == 3) {
			var hideTime = Rooms.findOne({_id: Meteor.user().currentRoom}).buzzTimer * 100;
			hideTime += 300;
			$("#buzzer").hide();
			Meteor.setTimeout(function() {
				$("#buzzer").show();
			}, hideTime);
		}
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

