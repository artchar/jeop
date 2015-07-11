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
		Meteor.call("clickClue", cat, clue, Meteor.user().currentRoom);
		// Meteor.setTimeout(function() {
		// 	$(".btn-money").removeClass('disabled');
		// }, 900);
	}
})

Tracker.autorun(function() {
	Meteor.subscribe("user");
})


/* states

0: pregame
1: player choosing a clue
2: clue display
3: players buzzing in
4: player answering clue
5: end
*/