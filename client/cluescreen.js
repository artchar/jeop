var han2dle = "HH";
var submitted = false;

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
			return "Correct answer: " + Rooms.findOne({_id: Meteor.user().currentRoom}).correctAnswer + "<span class='reportspan'><a href='#' class='report'> Report faulty clue</a></span>";

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
		for (var i = 0; i < players.length; i++) {
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

		
		if (Session.get("answering")) {
			
			return ":0" + Session.get("answeringTime");
		}
		else return "";
	},

	clueActiveTimer: function() {
		if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentState == 4) {
			return ":0" + Session.get("activeTime");
		}
		else return "";
	},

	lightup: function() {
		if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentState == 4) {
			return "lightup";
		}
		else return "";
	},

	currentClueComments: function() {
		if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentState == 2) {
			return Rooms.findOne({_id: Meteor.user().currentRoom}).activeClue.comments;
		}
		else {
			return "";
		}
	}

});

Template.cluescreen.events({
	"click .reportspan": function(event) {
		event.preventDefault();
		$(".reportspan").html("<span class='report' style='color: #51CA51'> Thanks!</span>");
		Meteor.call("reportClue");

	},

	"click #start": function(event) {
		Meteor.call("startGame");
	},

	"click #ready": function (event) {
		Meteor.call("toggleReady");
	},

	"click #newgame": function(event) {
		$("#newgame").hide();
		Meteor.call("newGame", function(err, result) {
			$("#newgame".show());
		});
	},

	"submit form": function(event) {
		event.preventDefault();

		if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentState != 5)
			return;

		var answer = $("#answer").val();
		$("#answer-form").hide();
		Session.set("answering", false);
		Meteor.clearInterval(s);

		Meteor.setTimeout(function() {
			Meteor.call("spellCheck", answer, function(err, result) {
				Meteor.call("checkAnswer", result, answer);
			});
			
		}, 1000);


		Meteor.setTimeout(function() {
			$("#answer-form").show();
		}, 6000);
	},

	"click #buzzer": function(event) {
		event.preventDefault();
		if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentState == 4)
			Meteor.call("buzzIn", function(err, result) {
				if (result) {
					Session.set("answering", true);
					Session.set("answeringTime", 8);
					s = Meteor.setInterval(function() {
						if (Session.get("answeringTime") == 0 && Session.get("answering")) {
							$("#answer-form").submit();
							Meteor.clearInterval(s);
							Session.set("answering", false);
							return ":00";
						}
						else {
							Session.set("answeringTime", Session.get("answeringTime") - 1);
						}
					}, 1000);
				}

			});
		else if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentState == 3) {
			var hideTime = Session.get("buzzTime");
			hideTime += 200;
			$("#buzzer").hide();
			Meteor.setTimeout(function() {
				$("#buzzer").show();
			}, hideTime);
		}
		else
			return;
	}

});

Template.cluescreen.onRendered(function() {
	var stateQuery = Rooms.find({_id: Meteor.user().currentRoom});
	handle = stateQuery.observeChanges({
		changed: function(id, fields) {
			if (fields.currentState == 4) {
				Session.set("activeTime", 6);
				h = Meteor.setInterval(function() {
					if (Session.equals("activeTime", 0) || Rooms.findOne({_id: Meteor.user().currentRoom}).currentState != 4)
					{
						Meteor.clearInterval(h);
					}
					else 
						Session.set("activeTime", Session.get("activeTime") -1);
				}, 1000);
			}
			else if (fields.currentState == 3) {
				Session.set("buzzTime", 3000);
				j = Meteor.setInterval(function() {
					if (Session.equals("buzzTime"), 0) {
						Meteor.clearInterval(j);
					}
					else
						Session.set("buzzTime", Session.get("buzzTime") - 1);
				}, 1);
			}
			else if (fields.currentState == 5) {
				Meteor.clearInterval(j);
			}
		}

	});
});

Template.cluescreen.onDestroyed(function() {
	handle.stop();
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

