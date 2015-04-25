Template.cluescreen.helpers({
	activeClue: function() {
	},

	startButton: function() {

	},

	preGame: function() {
		if (Rooms.findOne({_id: Session.get("currentRoom")}).currentState == 0)
			return true;
		else
			return false;
	},

	owner: function() {
		if (Rooms.findOne({_id: Session.get("currentRoom")}).ownerId == Meteor.userId())
			return true;
		else
			return false;
	}
})

Template.cluescreen.events({
	"click #start": function(event) {
		Meteor.call("startGame", Session.get("currentRoom"));
	},

})
