Template.board.helpers({

	clueHide: function(cat, clue) {
		if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentState == 0)
			return "";

		else if (!Rooms.findOne({_id: Meteor.user().currentRoom}).clues[cat].clues[clue].selected) {
			switch (clue) {
				case 0:
					return "$400";
					break;
				case 1:
					return "$800";
					break;
				case 2:
					return "$1200";
					break;
				case 3:
					return "$1600";
					break;
				case 4:
					return "$2000";
					break;
				default:
					return "hi";
					break;
			}
		}
		else
			return "";
	},

	disable: function(cat, clue) {
		if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentState != 1 || Rooms.findOne().activePlayer != Meteor.user()._id)
			return "disabled";
		else if (Rooms.findOne({_id: Meteor.user().currentRoom}).clues[cat].clues[clue].selected)
			return "disabled";
		else return "";
	},

	clicker: function() {
		var counter = 0;
		var clicktimer = Meteor.setInterval(function() {
			if (Meteor.user().currentRoom == null)
				return;
			console.log("AA4A");
			counter++;
			if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentState == 1 && Rooms.findOne({_id: Meteor.user().currentRoom}).activePlayer == Meteor.userId()) {
				if (counter == 6) {
					for (i = 0; i < 5; i++) {
						for (j = 0; j < 4; j++) {
							if (!Rooms.findOne({_id: Meteor.user().currentRoom}).clues[i].clues[j].selected) {
								var string = "#cat" + i + "clue" + j;
								$(string).click();
								counter = 0;
								Meteor.clearInterval(clicktimer);
								return;
							}
						}
					}
				}
			}
		}, 1000);
	},

	activePlayer: function() {
		if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentState == 1 && Rooms.findOne({_id: Meteor.user().currentRoom}).activePlayer == Meteor.userId())
			return true;
		else
			return false;
	}


})

Template.board.events({
	'click button': function(event) {
		event.preventDefault();

	},


	"click .btn-money": function(event) {
		event.preventDefault();
		$(".btn-money").addClass('disabled');
		var cat = event.currentTarget.id[3];
		var clue = event.currentTarget.id[8];
		Meteor.call("clickClue", cat, clue);
		// Meteor.setTimeout(function() {
		// 	$(".btn-money").removeClass('disabled');
		// }, 900);
	}
})

Tracker.autorun(function() {
	Meteor.subscribe("user");
})

// Meteor.setInterval(function() {
// 	var counter = 0;
// 	var clicktimer = Meteor.setInterval(function() {
// 		if (Meteor.user().currentRoom == undefined){
// 			Meteor.clearInterval(clicktimer);
// 			return;
// 		}
// 		counter++;
// 		if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentState == 1 && Rooms.findOne({_id: Meteor.user().currentRoom}).activePlayer == Meteor.userId()) {
// 			if (counter == 6) {
// 				for (i = 0; i < 5; i++) {
// 					for (j = 0; j < 4; j++) {
// 						if (!Rooms.findOne({_id: Meteor.user().currentRoom}).clues[i].clues[j].selected) {
// 							var string = "#cat" + i + "clue" + j;
// 							$(string).click();
// 							counter = 0;
// 							Meteor.clearInterval(clicktimer);
// 							return;
// 						}
// 					}
// 				}
// 			}
// 		}
// 	}, 1000);
// }, 10000);







/* states

0: pregame
1: player choosing a clue
2: clue display
3: players buzzing in
4: player answering clue
5: end
*/