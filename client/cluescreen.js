Template.cluescreen.helpers({
	activeClue: function() {
	},

	startButton: function() {

	}
})

Template.cluescreen.events({
	"click #start": function(event) {
		Meteor.call("startGame", Session.get("currentRoom"));
	},

})